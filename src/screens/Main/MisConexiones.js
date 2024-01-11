// Importaciones de React Native y React
import { View, Text, StyleSheet, TextInput, ScrollView } from "react-native";
import React, { useState } from "react";
// Importaciones de Hooks y Componentes
import { Ionicons } from "@expo/vector-icons";
import Conexion from "../../components/Conexion";

const MisConexiones = () => {
  // Estados y Contexto
  const [text, setText] = useState("");

  // Mapa para cargar todas las imagenes
  const imageMap = {
    Natasha: require("../../../assets/images/Fotos_Personas/Natahsa.png"),
    Quill: require("../../../assets/images/Fotos_Personas/Quill.png"),
    Clint: require("../../../assets/images/Fotos_Personas/Clint.png"),
    Antonio: require("../../../assets/images/Fotos_Personas/Antonio.png"),
    Steve: require("../../../assets/images/Fotos_Personas/Steve.png"),
    Test: require("../../../assets/images/Test.png"),
    // ... más imágenes
  };

  // Componente visual
  return (
    //Fondo
    <View style={styles.background}>
      {/*Titulo*/}
      <View style={styles.tituloContainer}>
        <Text style={styles.titulo}>TANKEF</Text>
      </View>
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
      <Text style={styles.header}>Mis Conexiones</Text>
      <ScrollView style={styles.scroll}>
        <Conexion
          nombre={"Natasha Ocasio Romanoff"}
          imagen={imageMap["Natasha"]}
        />
        <Conexion
          nombre={"Antonio Stark Rivera"}
          imagen={imageMap["Antonio"]}
        />
        <Conexion nombre={"Jose Antonio Quill"} imagen={imageMap["Quill"]} />
      </ScrollView>
    </View>
  );
};

// Estilos de la pantalla
const styles = StyleSheet.create({
  tituloContainer: {
    height: 105,
    backgroundColor: "white",
  },
  background: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
  },
  titulo: {
    fontFamily: "conthrax",
    fontSize: 27,
    color: "#29364d",
    marginTop: 70,
    position: "absolute",
  },
  input: {
    height: 40,
    width: "100%",
    borderColor: "#D5D5D5",
    borderWidth: 1,
    top: 10,
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
  header: {
    fontSize: 20,
    color: "#29364d",
    fontWeight: "bold",
    top: 20,
  },
  scroll: {
    flex: 1,
    width: "100%",
    paddingTop: 6,
    top: 20,
  },
});

export default MisConexiones;
