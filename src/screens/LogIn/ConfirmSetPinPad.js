// Importaciones de React y React Native
import React, { useState, useContext, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { ActivityIndicator } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
// Importaciones de Hooks y Componentes
import { APIGet, getToken } from "../../API/APIService";
import PinPad from "../../components/PinPad";
import { UserContext } from "../../hooks/UserContext";

const ConfirmSetPinPad = ({ navigation, route }) => {
  // Estados de la pantalla
  const { user, setUser } = useContext(UserContext);
  const { pin } = route.params;
  const [confirmPin, setConfirmPin] = useState("");
  const [isProfileLoaded, setIsProfileLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const titleCase = (str) => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  useEffect(() => {
    if (user && user.loggedIn) {
      const userInfo = {
        pin: user.pin,
        loggedIn: user.loggedIn,
        userToken: getToken(),
      };
      AsyncStorage.setItem("userInfo", JSON.stringify(userInfo))
        .then(() => console.log("Información guardada con éxito"))
        .catch((error) =>
          console.error("Error guardando la información", error)
        );
    }
  }, [user]);

  const fetchProfileData = async () => {
    const url = "/api/v1/profile";
    const result = await APIGet(url);

    if (result.error) {
      console.error("Error al obtener datos del perfil:", result.error);
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
        valorRed: result.data.data.network_invested_amount,
      });
      setIsProfileLoaded(true);
    }
  };

  const handleIncorrectPin = () => {
    setConfirmPin("");
    Alert.alert("Error", "Los Pines no Coinciden");
  };

  const handleConfirmPin = async () => {
    setIsLoading(true);
    if (confirmPin === pin) {
      setUser({
        ...user,
        pin: confirmPin,
        loggedIn: true,
      });

      await fetchProfileData();

      navigation.navigate("MainFlow", {
        screen: "PerfilMain",
      });
    } else {
      handleIncorrectPin();
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (confirmPin.length === 6 && confirmPin === pin) {
      setIsProfileLoaded(true);
    } else {
      setIsProfileLoaded(false);
    }
  }, [confirmPin, pin]);

  // Se renderiza la pantalla
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
        <PinPad
          id={false}
          get={confirmPin}
          set={setConfirmPin}
          userPin={pin}
          onIncorrectPin={handleIncorrectPin}
        />
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
          <Text style={styles.loadingText}>
            Estamos recuperando tus datos{"\n"}Por favor espera...
          </Text>
        </View>
      )}
    </View>
  );
};

// Estilos de la pantalla
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
    marginHorizontal: 20,
    marginBottom: 40,
    borderRadius: 5,
  },
  buttonText: {
    alignSelf: "center",
    padding: 10,
    fontSize: 16,
    fontFamily: "opensanssemibold",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontFamily: "opensanssemibold",
    marginTop: 15,
    color: "white",
    textAlign: "center",
  },
});

export default ConfirmSetPinPad;
