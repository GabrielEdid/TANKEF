// Importaciones de React Native y React
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const CuadroRedUsuario = (props) => {
  return (
    <View style={styles.Cuadro}>
      <Text style={styles.textoTitulo}>{props.titulo}</Text>
      <Text style={styles.textoBody}>{props.body}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  Cuadro: {
    borderWidth: 1.5,
    borderRadius: 13,
    borderColor: "#060B4D",
    marginEnd: 5,
    padding: 10,
  },
  textoTitulo: {
    fontSize: 10,
    color: "#060B4D",
    fontFamily: "opensansbold",
    textAlign: "center",
  },
  textoBody: {
    fontSize: 12,
    color: "#060B4D",
    fontFamily: "opensansbold",
    textAlign: "center",
  },
});

export default CuadroRedUsuario;
