// Importaciones de React Native y React
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import React, { useState, useContext, useEffect } from "react";
// Importaciones de Hooks y Componentes
import { APIGet, getToken } from "../../API/APIService";
import PinPad from "../../components/PinPad";
import { UserContext } from "../../hooks/UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign } from "@expo/vector-icons";

const ConfirmSetPinPad = ({ navigation, route }) => {
  // Estados locales y contexto global
  const { user, setUser } = useContext(UserContext);
  const { pin, onSetPin } = route.params;
  const [confirmPin, setConfirmPin] = useState("");
  const [isProfileLoaded, setIsProfileLoaded] = useState(false);

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
    if (confirmPin === pin) {
      setUser({
        ...user,
        pin: confirmPin,
        loggedIn: true,
      });

      // Llamada a la función para obtener los datos del perfil
      await fetchProfileData();

      navigation.navigate("MainFlow", {
        screen: "Perfil",
      });
    } else {
      alert("Los Pines no Coinciden");
      setConfirmPin("");
      navigation.navigate("SetPinPad"); // Se regresa a la pantalla de SetPinPad
    }
  };

  // Componente visual
  return (
    <View>
      {/* Boton de Regresar */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{ zIndex: 10 }}
      >
        <AntDesign
          name="arrowleft"
          size={40}
          color="#29364d"
          style={styles.back}
        />
      </TouchableOpacity>
      {/* Texto de Confirma el PIN */}
      <View style={{ height: "89%" }}>
        <Text style={styles.titulo}>Confirma tu PIN</Text>
        {/* Componente de PinPad, ahí mismo aparece el logo y titulo de Tankef */}
        <PinPad id={false} get={confirmPin} set={setConfirmPin} />
        {/* Logica para activar el boton de Guardar PIN si el PIN tiene el largo esperado */}
      </View>
      {confirmPin.length === 6 && isProfileLoaded ? (
        <TouchableOpacity
          style={styles.botonGrande}
          onPress={() => [
            handleConfirmPin(),
            console.log("El Pin es: " + confirmPin),
          ]}
        >
          <Text style={styles.textoBotonGrande}>GUARDAR PIN</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

// Estilos de la Pantalla
const styles = StyleSheet.create({
  back: {
    marginTop: 60,
    marginLeft: 20,
    position: "absolute",
    zIndex: 10000000,
  },
  titulo: {
    marginTop: 210,
    fontSize: 15,
    alignSelf: "center",
    position: "absolute",
    color: "#29364d",
  },
  botonGrande: {
    width: "85%",
    height: 60,
    alignSelf: "center",
    justifyContent: "center",
    backgroundColor: "#29364d",
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.37,
    shadowRadius: 5,
    elevation: 8,
    marginTop: 20,
  },
  textoBotonGrande: {
    color: "white",
    textAlign: "center",
    fontSize: 20,
    fontFamily: "conthrax",
  },
});

export default ConfirmSetPinPad;
