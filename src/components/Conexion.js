// Importaciones de React Native y React
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
// Importaciones de Componentes
import { AntDesign } from "@expo/vector-icons";

const Conexion = (props) => {
  // Estados y Contexto
  const [isVisible, setIsVisible] = useState(true);

  // Para cuando se desee eliminar el Request
  const handleRemove = () => {
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Image source={props.imagen} style={styles.icon} />
      <Text style={styles.textoNombre}>{props.nombre}</Text>
      {/* Para Mostrar Boton de Eliminar */}
      <TouchableOpacity style={styles.botonElim} onPress={handleRemove}>
        <AntDesign name="deleteuser" size={40} color="#29364d" />
      </TouchableOpacity>

      {/* Linea delgada para dividr cada Request */}
      <View style={styles.linea}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 85,
    width: 352,
  },
  textoNombre: {
    fontSize: 16,
    top: 20,
    color: "#29364d",
    fontWeight: "bold",
    paddingTop: 10,
    width: 283,
    left: 70,
  },
  icon: {
    height: 57,
    width: 57,
    borderRadius: 50,
    marginTop: 10,
    position: "absolute",
  },
  botonElim: {
    height: 40,
    width: 45,
    alignItems: "center",
    position: "absolute",
    top: 20,
    left: 300,
  },
  linea: {
    backgroundColor: "#cccccc",
    height: 1,
    width: 550,
    alignSelf: "center",
    position: "absolute",
    top: 80,
  },
});

export default Conexion;
