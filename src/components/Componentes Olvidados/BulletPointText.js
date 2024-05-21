// Importaciones de React Native y React
import { View, Text, StyleSheet } from "react-native";
import React from "react";
// Importaciones de Componentes y Hooks
import { Entypo } from "@expo/vector-icons";

/**
 * `BulletPointText` es un componente que muestra un texto con un ícono de punto (bullet) al lado.
 * Este componente se utiliza para destacar elementos en una lista o para presentar información de manera puntual.
 *
 * Props:
 * - `titulo`: Una cadena de texto que se muestra como el título o encabezado al lado del punto (bullet).
 * - `body`: Una cadena de texto que proporciona detalles adicionales o descripción debajo del título.
 *
 * Ejemplo de uso (o ver en Inversion2.js):
 *
 * <BulletPointText
 *   titulo="Punto Destacado"
 *   body="Este es un detalle importante que acompaña al título."
 * />
 */

const BulletPointText = (props) => {
  // Componente Visual
  return (
    <View style={{ flexDirection: "row", marginTop: -2 }}>
      <Entypo name="dot-single" size={60} color="#2FF690" />
      <View style={{ marginTop: 17.5, marginLeft: -12.5 }}>
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
