// Importaciones de React Native y React
import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
// Importaciones de Componentes
import { useInactivity } from "../hooks/InactivityContext";

/**
 * `SearchResult` es un componente que muestra información de una busqueda de usuarios específica,
 * como una tarjeta interactuable. Ofrece la funcionalidad para navegar a una vista detallada
 * del perfil asociado.
 *
 * Props:
 * - `userID`: Identificador único del usuario asociado a la busqueda.
 * - `imagen`: Puede ser una URL de imagen o un recurso local para mostrar como avatar del usuario.
 * - `nombre`: Nombre del usuario a mostrar en la tarjeta de busqueda.
 *
 * Ejemplo de uso (o ver en MiRed.js):
 * <SearchResult
 *   userID="123"
 *   imagen="https://ruta/a/imagen.jpg"
 *   nombre="John Doe"
 * />
 *
 */

const SearchResult = ({ nombre, imagen, userID }) => {
  const navigation = useNavigation();
  // Estados y Contexto
  const { resetTimeout } = useInactivity();

  return (
    //Lo hace boton y maneja la navegacion
    <TouchableOpacity
      style={styles.container}
      onPress={() => [
        navigation.navigate("VerPerfiles", { userID: userID }),
        resetTimeout(),
      ]}
    >
      {/* Datos del usuario a mostrar */}
      <View style={{ flexDirection: "row", flex: 1 }}>
        <Image source={imagen} style={styles.icon} />
        <Text style={styles.textoNombre}>{nombre}</Text>
      </View>
    </TouchableOpacity>
  );
};

// Estilos del componente
const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    marginTop: 3,
    paddingHorizontal: 20,
    height: 85,
    width: "100%",
    flexDirection: "row",
  },
  textoNombre: {
    fontSize: 20,
    fontFamily: "opensansbold",
    alignSelf: "center",
    color: "#060B4D",
    marginLeft: 10,
  },
  icon: {
    height: 48,
    width: 48,
    borderRadius: 50,
    alignSelf: "center",
  },
});

export default SearchResult;
