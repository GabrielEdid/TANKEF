// Importaciones de React Native y React
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React from "react";
// Importaciones de Hooks y Componentes

const MiRed = () => {
  // Componente visual
  return (
    //Imagen de Fondo
    <View style={styles.background}>
      {/* Titulo */}
      <Text style={styles.titulo}>TANKEF</Text>
      <TextInput style={styles.input} />
    </View>
  );
};

// Estilos de la pantalla
const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "white",
  },
  titulo: {
    fontFamily: "conthrax",
    fontSize: 27,
    color: "#29364d",
    marginTop: 70,
    marginLeft: 20,
    position: "absolute",
  },
  input: {
    height: 40,
    width: 354,
    borderColor: "#D5D5D5",
    borderWidth: 1,
    marginTop: 115,
    alignSelf: "center",
    borderRadius: 15,
  },
});

export default MiRed;
