// Importaciones de React Native y React
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
// Importaciones de Hooks y Componentes
import { Ionicons } from "@expo/vector-icons";

const MisConexiones = () => {
  // Estados y Contexto
  const [text, setText] = useState("");

  // Mapa para cargar todas las imagenes
  const imageMap = {
    Bruce: require("../../../assets/images/Fotos_Personas/Bruce.png"),
    Carol: require("../../../assets/images/Fotos_Personas/Carol.png"),
    Jane: require("../../../assets/images/Fotos_Personas/Jane.png"),
    // ... más imágenes
  };

  // Componente visual
  return (
    //Fondo
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
      <Text style={styles.header}>Mis Conexiones</Text>
      <ScrollView style={styles.scroll}>
        <Text style={styles.texto}>
          Componente para mostrar nombres de conexiones
        </Text>
      </ScrollView>
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
  texto: {
    fontSize: 18,
    color: "#29364d",
    marginTop: 13,
    position: "absolute",
  },
  header: {
    fontSize: 20,
    color: "#29364d",
    fontWeight: "bold",
    left: 20,
    top: 15,
  },
  scroll: {
    flex: 1,
    width: 353,
    left: 20,
    paddingTop: 6,
    top: 20,
  },
});

export default MisConexiones;
