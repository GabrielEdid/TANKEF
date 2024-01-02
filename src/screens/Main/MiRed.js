// Importaciones de React Native y React
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
// Importaciones de Hooks y Componentes
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

const MiRed = () => {
  // Estados y Contexto
  const [text, setText] = useState("");
  // Componente visual
  return (
    //Imagen de Fondo
    <View style={styles.background}>
      {/* Titulo */}
      <Text style={styles.titulo}>TANKEF</Text>
      <TextInput
        style={styles.input}
        placeholder="Buscar"
        onChangeText={setText}
        value={text}
      />
      <Ionicons
        name="search-sharp"
        size={24}
        color="#D5D5D5"
        style={styles.search}
      />
      <TouchableOpacity style={styles.administrar}>
        <Text style={styles.texto}>Administar mi Red</Text>
        <Text style={styles.subTexto}>3 conexiones nuevas</Text>
        <AntDesign
          name="arrowright"
          size={30}
          color="#29364d"
          style={styles.arrow}
        />
      </TouchableOpacity>
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
    color: "#29364d",
    paddingLeft: 40,
  },
  search: {
    position: "absolute",
    top: 122.5,
    left: 30,
  },
  administrar: {
    height: 50,
    width: 354,
    borderColor: "#D5D5D5",
    borderWidth: 1,
    marginTop: 15,
    alignSelf: "center",
    borderRadius: 15,
    color: "#29364d",
    paddingLeft: 40,
  },
  texto: {
    fontSize: 19,
    color: "#29364d",
    marginTop: 12.5,
    marginLeft: 20,
    position: "absolute",
  },
  subTexto: {
    fontSize: 11,
    color: "#C0C0C0",
    marginTop: 17.5,
    right: 50,
    position: "absolute",
  },
  arrow: {
    position: "absolute",
    top: 10,
    right: 20,
  },
});

export default MiRed;
