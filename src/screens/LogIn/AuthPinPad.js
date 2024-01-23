// Importaciones de React Native y React
import { Text, View, StyleSheet, Alert } from "react-native";
import React, { useState, useEffect, useContext } from "react";
// Importaciones de Componentes y Hooks
import { UserContext } from "../../hooks/UserContext";
import PinPad from "../../components/PinPad";

const AuthPinPad = ({ navigation, route }) => {
  // Estado local y el pin obtenido del AsyncStorage
  const {
    userPin,
    userLoggedIn,
    userId,
    userToken,
    userTelefono,
    userName,
    userApellido1,
    userApellido2,
    userCURP,
    userEMail,
  } = route.params; // Se obtiene el pin del AsyncStorage
  const { user, setUser } = useContext(UserContext);
  const [pin, setPin] = useState("");

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

  // Función para comparar el pin introducido con el pin del AsyncStorage
  useEffect(() => {
    if (pin.length === 6) {
      if (pin === userPin) {
        setUser({
          ...user,
          userToken: userToken,
          userID: userId,
          loggedIn: userLoggedIn,
          pin: userPin,
          telefono: userTelefono,
          nombre: titleCase(userName),
          apellidoPaterno: titleCase(userApellido1),
          apellidoMaterno: titleCase(userApellido2),
          CURP: userCURP,
          email: userEMail,
        });
        navigation.navigate("MainFlow", {
          screen: "Perfil",
        });
      } else {
        Alert.alert("Acceso Denegado", "PIN incorrecto");
        setPin("");
      }
    }
  }, [pin, userPin, navigation]);

  // Componente visual
  return (
    <View>
      {/* Texto de Introduce tu PIN */}
      <Text style={styles.titulo}>Introduce tu PIN</Text>
      {/* Componente de PinPad, ahí mismo aparece el logo, titulo de Tankef, faceID y olvide mi PIN */}
      <PinPad id={true} get={pin} set={setPin} />
    </View>
  );
};

// Estilos de la pantalla
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
});

export default AuthPinPad;
