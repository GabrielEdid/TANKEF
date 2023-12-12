// Importaciones de React Native y React
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import React, { useState, useContext } from "react";
// Importaciones de Firebase
import { auth } from "../../firebaseConfig";
// Importaciones de Hooks y Componentes
import PinPad from "../components/PinPad";
import { AntDesign } from "@expo/vector-icons";
import { UserContext } from "../hooks/UserContext";

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
    <View>
      {/* Boton de Regresar */}
      <TouchableOpacity onPress={() => handleGoBack()} style={{ zIndex: 10 }}>
        <AntDesign
          name="arrowleft"
          size={40}
          color="#29364d"
          style={styles.back}
        />
      </TouchableOpacity>
      {/* Texto de Crear el PIN */}
      <Text style={styles.titulo}>Crea tu PIN</Text>
      {/* Componente de PinPad, ahí mismo aparece el logo y titulo de Tankef */}
      <PinPad id={false} get={pin} set={setPin} />
      {/* Logica para activar el boton de Siguiente si el PIN tiene el largo esperado */}
      {pin.length === 6 ? (
        <TouchableOpacity
          style={styles.botonGrande}
          onPress={() => [
            navigation.navigate("ConfirmSetPinPad", {
              pin: pin,
              onSetPin: handleSetPin,
            }),
            console.log("El pin es: " + pin),
          ]}
        >
          <Text style={styles.textoBotonGrande}>SIGUIENTE</Text>
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
  },
  titulo: {
    marginTop: 210,
    fontSize: 15,
    alignSelf: "center",
    position: "absolute",
    color: "#29364d",
  },
  botonGrande: {
    marginTop: 750,
    width: 350,
    height: 60,
    alignSelf: "center",
    justifyContent: "center",
    backgroundColor: "#29364d",
    borderRadius: 25,
    position: "absolute",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.37,
    shadowRadius: 5,
    elevation: 8,
  },
  textoBotonGrande: {
    color: "white",
    textAlign: "center",
    fontSize: 20,
    fontFamily: "conthrax",
  },
});

export default SetPinPad;
