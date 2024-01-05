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
import Request from "../../components/Request";

const SolicitudesConexion = () => {
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
      <TouchableOpacity style={styles.misConexiones}>
        <Image
          source={require("../../../assets/images/MiRed.png")}
          style={styles.imagen}
        />
        <Text style={styles.texto}>Mis Conexiones</Text>
        <Text style={[styles.texto, { right: 30 }]}>15</Text>
      </TouchableOpacity>
      <Text style={styles.header}>Solicitudes de Conexión Nuevas</Text>
      <ScrollView style={styles.scroll}>
        <Request imagen={imageMap["Bruce"]} nombre={"Bruce García Banner"} />
        <Request imagen={imageMap["Carol"]} nombre={"Carol Danvers Miller"} />
        <Request imagen={imageMap["Jane"]} nombre={"Jane Foster Cruz"} />
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
  misConexiones: {
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
    fontSize: 18,
    color: "#29364d",
    marginTop: 13,
    marginLeft: 60,
    position: "absolute",
  },
  imagen: {
    height: 25,
    width: 35,
    position: "absolute",
    left: 15,
    top: 10,
    tintColor: "#29364d",
    transform: [{ scaleX: -1 }],
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
    position: "absolute",
    top: 255,
  },
});

export default SolicitudesConexion;
