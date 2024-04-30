// Importaciones de React Native y React
import { Text, View, StyleSheet, TouchableOpacity, Image } from "react-native";
import React, { useState, useContext } from "react";
// Importaciones de Firebase
import { auth } from "../../../firebaseConfig";
// Importaciones de Hooks y Componentes
import PinPad from "../../components/PinPad";
import { AntDesign } from "@expo/vector-icons";
import { UserContext } from "../../hooks/UserContext";

const SetPinPad = ({ navigation }) => {
  // Estados locales y contexto global
  const { user, setUser } = useContext(UserContext);
  const [pin, setPin] = useState("");

  // Función para guardar el pin
  const handleSetPin = (newPin) => {
    setPin(newPin);
  };

  // Función para regresar y borrar el usuario para evitar duplicados
  const handleGoBack = () => {
    navigation.goBack();
    /*let user = auth.currentUser;
    user
      .delete()
      .then(() => console.log("User deleted"))
      .catch((error) => console.log(error));*/
  };

  // Componente visual
  return (
    <View style={{ backgroundColor: "white", flex: 1 }}>
      {/* Boton de Regresar */}
      <TouchableOpacity onPress={() => handleGoBack()} style={{ zIndex: 10 }}>
        <Text style={styles.back}>Cancelar</Text>
      </TouchableOpacity>
      <View>
        <Image
          source={require("../../../assets/images/Logo.png")}
          style={styles.logo}
        />
        <Text style={styles.titulo}>Crea tu PIN</Text>
      </View>
      <View style={{ marginTop: -50 }}>
        <PinPad id={false} get={pin} set={setPin} style={{ zIndex: 1000 }} />
      </View>
      {/* Logica para activar el boton de Siguiente si el PIN tiene el largo esperado */}
      {pin.length === 6 && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => [
            navigation.navigate("ConfirmSetPinPad", {
              pin: pin,
              onSetPin: handleSetPin,
            }),
            console.log("El pin es: " + pin),
          ]}
        >
          <Text style={styles.buttonText}>Siguiente</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// Estilos de la Pantalla
const styles = StyleSheet.create({
  logo: {
    marginTop: 100,
    width: 175,
    height: 70,
    alignSelf: "center",
  },
  back: {
    fontSize: 16,
    fontFamily: "opensanssemibold",
    color: "#060B4D",
    marginTop: 60,
    marginLeft: 20,
    position: "absolute",
  },
  titulo: {
    marginTop: 40,
    fontSize: 16,
    alignSelf: "center",
    fontFamily: "opensanssemibold",
    color: "#060B4D",
  },
  button: {
    marginTop: 30,
    backgroundColor: "#060B4D",
    width: "90%",
    alignSelf: "center",
    borderRadius: 5,
  },
  buttonText: {
    alignSelf: "center",
    padding: 10,
    fontFamily: "opensanssemibold",
    fontSize: 16,
    color: "white",
  },
});

export default SetPinPad;
