// Importaciones de React Native y React
import { View, Text, StyleSheet } from "react-native";
import React from "react";
// Importaciones de Componentes y Hooks
import { Entypo } from "@expo/vector-icons";

/**
 * `BulletPointTextSmall` es un componente que muestra un texto con un ícono de punto (bullet) al lado.
 * Este componente se utiliza para destacar elementos en una lista o para presentar información de manera puntual.
 *
 * Props:
 * - `titulo`: Una cadena de texto que se muestra como el título o encabezado al lado del punto (bullet).
 * - `body`: Una cadena de texto que proporciona detalles adicionales o descripción debajo del título.
 *
 * Ejemplo de uso (o ver en Inversion1.js):
 *
 * <BulletPointTextSmall
 *   titulo="Punto Destacado"
 *   body="Este es un detalle importante que acompaña al título."
 * />
 */

const BulletPointText = (props) => {
  // Componente Visual
  return (
    <View style={{ flexDirection: "row", marginTop: -2 }}>
      <Entypo name="dot-single" size={40} color="#2FF690" />
      <View style={{ marginTop: 12, marginLeft: -10 }}>
        <Text style={styles.titulo}>{props.titulo}</Text>
        <Text style={styles.body}>{props.body}</Text>
      </View>
    </View>
  );
};

// Estilos del componente
const styles = StyleSheet.create({
  titulo: {
    fontSize: 12,
    fontFamily: "opensanssemibold",
    color: "#060B4D",
  },
  body: {
    fontSize: 18,
    marginLeft: -10,
    textAlign: "center",
    fontFamily: "opensanssemibold",
    color: "#9a9cb8ff",
  },
});

export default BulletPointText;
