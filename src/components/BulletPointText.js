// Importaciones de React Native y React
import { View, Text, StyleSheet } from "react-native";
import React from "react";
// Importaciones de Componentes y Hooks
import { Entypo } from "@expo/vector-icons";

const BulletPointText = (props) => {
  // Componente Visual
  return (
    <View style={{ flexDirection: "row", marginTop: -2 }}>
      <Entypo name="dot-single" size={60} color="#2FF690" />
      <View style={{ marginTop: 15, marginLeft: -10 }}>
        <Text style={styles.titulo}>{props.titulo}</Text>
        <Text style={styles.body}>{props.body}</Text>
      </View>
    </View>
  );
};

// Estilos de la pantalla
const styles = StyleSheet.create({
  titulo: {
    fontSize: 16,
    fontFamily: "opensanssemibold",
    color: "#060B4D",
  },
  body: {
    fontSize: 14,
    fontFamily: "opensanssemibold",
    color: "#9a9cb8ff",
  },
});

export default BulletPointText;
