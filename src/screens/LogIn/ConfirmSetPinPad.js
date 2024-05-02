// Importaciones de React Native y React
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
} from "react-native";
import React, { useState, useContext, useEffect } from "react";
import { ActivityIndicator } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
// Importaciones de Hooks y Componentes
import { APIGet, getToken } from "../../API/APIService";
import PinPad from "../../components/PinPad";
import { UserContext } from "../../hooks/UserContext";
import { AntDesign } from "@expo/vector-icons";

const ConfirmSetPinPad = ({ navigation, route }) => {
  // Estados locales y contexto global
  const { user, setUser } = useContext(UserContext);
  const { pin, onSetPin } = route.params;
  const [confirmPin, setConfirmPin] = useState("");
  const [isProfileLoaded, setIsProfileLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Función para convertir la primera letra de cada palabra en mayúscula
  function titleCase(str) {
    return str
      .toLowerCase()
      .split(" ")
      .map(function (word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(" ");
  }

  // Función para guardar valores en el AsyncStorage y
  useEffect(() => {
    if (user && user.loggedIn) {
      const userInfo = {
        pin: user.pin,
        loggedIn: user.loggedIn,
        userToken: getToken(), // Asegúrate de que getToken() devuelve el valor actualizado
      };
      AsyncStorage.setItem("userInfo", JSON.stringify(userInfo))
        .then(() => console.log("Información guardada con éxito"))
        .catch((error) =>
          console.error("Error guardando la información", error)
        );
    }
  }, [user]); // Se ejecuta cada vez que el estado 'user' cambia

  // Función para obtener los datos del perfil
  const fetchProfileData = async () => {
    const url = "/api/v1/profile";

    const result = await APIGet(url);

    if (result.error) {
      console.error("Error al obtener datos del perfil:", result.error);
      // Manejo del error
    } else {
      setUser({
        ...user,
        userID: result.data.data.id,
        telefono: result.data.data.phone,
        nombre: titleCase(result.data.data.name),
        apellidoPaterno: titleCase(result.data.data.first_last_name),
        apellidoMaterno: titleCase(result.data.data.second_last_name),
        CURP: result.data.data.curp,
        email: result.data.data.email,
        fechaNacimiento: result.data.data.dob,
        avatar: result.data.data.avatar,
        conexiones: result.data.data.count_conections,
      });
      console.log("Datos del perfil:", result.data);
      setIsProfileLoaded(true);
    }
  };

  useEffect(() => {
    if (confirmPin === pin) {
      fetchProfileData();
    }
  }, [confirmPin, pin]);

  // Función para guardar valores en el conexto y navegar a la pantalla siguiente
  const handleConfirmPin = async () => {
    setIsLoading(true);
    if (confirmPin === pin) {
      setUser({
        ...user,
        pin: confirmPin,
        loggedIn: true,
      });

      // Llamada a la función para obtener los datos del perfil
      await fetchProfileData();

      navigation.navigate("MainFlow", {
        screen: "PerfilMain",
      });
      setIsLoading(false);
    } else {
      alert("Los Pines no Coinciden");
      setConfirmPin("");
      navigation.navigate("SetPinPad"); // Se regresa a la pantalla de SetPinPad
      setIsLoading(false);
    }
  };

  // Componente visual
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Text style={styles.backText}>Cancelar</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <Image
          source={require("../../../assets/images/Logo.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>Confirma tu PIN</Text>
        <PinPad id={false} get={confirmPin} set={setConfirmPin} />
      </View>

      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor:
              confirmPin.length === 6 && isProfileLoaded
                ? "#060B4D"
                : "#F3F3F3",
          },
        ]}
        onPress={handleConfirmPin}
        disabled={!isProfileLoaded || confirmPin.length !== 6}
      >
        <Text
          style={[
            styles.buttonText,
            {
              color:
                confirmPin.length === 6 && isProfileLoaded ? "white" : "grey",
            },
          ]}
        >
          Siguiente
        </Text>
      </TouchableOpacity>
      {isLoading && (
        <View style={styles.overlay}>
          <ActivityIndicator size={75} color="#060B4D" />
          <Text
            style={{
              fontFamily: "opensanssemibold",
              marginTop: 15,
              color: "white",
              textAlign: "center",
            }}
          >
            Estamos recuperando tus datos{"\n"}Por favor espera...
          </Text>
        </View>
      )}
    </View>
  );
};

// Estilos de la Pantalla
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "space-between",
  },
  backButton: {
    zIndex: 10,
    marginTop: 60,
    marginLeft: 20,
    position: "absolute",
  },
  backText: {
    fontSize: 16,
    fontFamily: "opensanssemibold",
    color: "#060B4D",
  },
  content: {
    marginTop: 100,
    flex: 1,
    justifyContent: "center",
  },
  logo: {
    width: 175,
    height: 70,
    alignSelf: "center",
  },
  title: {
    alignSelf: "center",
    marginTop: 40,
    fontSize: 16,
    fontFamily: "opensanssemibold",
    color: "#060B4D",
  },
  button: {
    backgroundColor: "#060B4D",
    marginHorizontal: 20,
    marginBottom: 40,
    borderRadius: 5,
  },
  buttonText: {
    alignSelf: "center",
    padding: 10,
    fontSize: 16,
    color: "white",
    fontFamily: "opensanssemibold",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ConfirmSetPinPad;
