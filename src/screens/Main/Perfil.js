// Importaciones de React Native y React
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React, { useContext } from "react";
import { useNavigation } from "@react-navigation/native";
// Importaciones de Hooks y Componentes
import { Feather } from "@expo/vector-icons";

const Perfil = () => {
  const navigation = useNavigation();

  // Componente visual
  return (
    //Imagen de Fondo
    <View style={styles.background}>
      <TouchableOpacity
        onPress={() => navigation.openDrawer()}
        style={styles.settings}
      >
        <Feather name="settings" size={30} color="#29364d" />
      </TouchableOpacity>
      {/* Titulo */}
      <Text style={styles.titulo}>TANKEF</Text>
    </View>
  );
};

// Estilos de la pantalla
const styles = StyleSheet.create({
  back: {
    marginTop: 60,
    marginLeft: 20,
    position: "absolute",
  },
  background: {
    flex: 1,
    backgroundColor: "white",
  },
  imagen: {
    width: 150,
    height: 150,
    alignSelf: "center",
    marginTop: 300,
    position: "absolute",
  },
  titulo: {
    fontFamily: "conthrax",
    fontSize: 27,
    color: "#29364d",
    marginTop: 70,
    marginLeft: 20,
    position: "absolute",
  },
  settings: {
    height: 32,
    width: 35,
    marginTop: 70,
    marginLeft: 340,
    alignItems: "center",
    position: "absolute",
  },
});

export default Perfil;
