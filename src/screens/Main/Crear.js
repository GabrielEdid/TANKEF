// Importaciones de React Native y React
import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";
// Importaciones de Hooks y Componentes

const Crear = () => {
  // Componente visual
  return (
    <View style={styles.background}>
      {/* Titulo Superior */}
      <Text style={styles.titulo}>TANKEF</Text>
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
});

export default Crear;
