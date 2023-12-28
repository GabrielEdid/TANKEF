// Importaciones de React Native y React
import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";
// Importaciones de Hooks y Componentes

const Crear = () => {
  // Componente visual
  return (
    //Imagen de Fondo
    <View style={styles.background}>
      {/* Logo, Titulo */}
      <Image
        source={require("../../../assets/images/Logo_Tankef.png")}
        style={styles.imagen}
      />
      <Text style={styles.titulo}>Crear</Text>
    </View>
  );
};

// Estilos de la pantalla
const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "white",
  },
  imagen: {
    width: 150,
    height: 150,
    alignSelf: "center",
    marginTop: 300,
    position: "absolute",
  },
  titulo: {
    fontFamily: "conthrax",
    fontSize: 30,
    color: "#29364d",
    marginTop: 450,
    alignSelf: "center",
    position: "absolute",
  },
});

export default Crear;
