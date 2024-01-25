// Importaciones de React Native y React
import { Text, View, StyleSheet, Alert } from "react-native";
import React, { useState, useEffect, useContext } from "react";
// Importaciones de Componentes y Hooks
import { APIGet, setToken } from "../../API/APIService";
import { UserContext } from "../../hooks/UserContext";
import PinPad from "../../components/PinPad";

const AuthPinPad = ({ navigation, route }) => {
  // Estado local y el pin obtenido del AsyncStorage
  const { userPin, userLoggedIn } = route.params; // Se obtiene el pin del AsyncStorage
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

  // Función para obtener los datos del perfil
  const fetchProfileData = async () => {
    const url = "/api/v1/profile";

    const result = await APIGet(url);

    if (result.error) {
      console.error("Error al obtener datos del perfil:", result.error);
      // Manejo del error
    } else {
      setToken(result.data.data.token);
      setUser({
        ...user,
        loggedIn: userLoggedIn,
        pin: userPin,
        userID: result.data.data.id,
        telefono: result.data.data.phone,
        nombre: titleCase(result.data.data.name),
        apellidoPaterno: titleCase(result.data.data.first_last_name),
        apellidoMaterno: titleCase(result.data.data.second_last_name),
        CURP: result.data.data.curp,
        email: result.data.data.email,
        fechaNacimiento: result.data.data.dob,
      });
      console.log("Datos del perfil:", result.data);
      // Manejo de los datos del perfil
    }
  };

  // Función para comparar el pin introducido con el pin del AsyncStorage
  useEffect(() => {
    if (pin.length === 6) {
      if (pin === userPin) {
        fetchProfileData();
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
