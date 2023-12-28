// Importaciones de React Native y React
import { Text, View, StyleSheet, Alert } from "react-native";
import React, { useState, useEffect } from "react";
// Importaciones de Componentes
import PinPad from "../../components/PinPad";

const AuthPinPad = ({ navigation, route }) => {
  // Estado local y el pin obtenido del AsyncStorage
  const { userPin } = route.params; // Se obtiene el pin del AsyncStorage
  const [pin, setPin] = useState("");

  // Función para comparar el pin introducido con el pin del AsyncStorage
  useEffect(() => {
    if (pin.length === 6) {
      if (pin === userPin) {
        navigation.navigate("Perfil");
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
