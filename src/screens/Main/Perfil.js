// Importaciones de React Native y React
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React, { useContext, useEffect } from "react";
// Importaciones de Hooks y Componentes
import { UserContext } from "../../hooks/UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Perfil = ({ navigation }) => {
  // Estado global
  const { user, setUser, resetUser } = useContext(UserContext);

  // Función para salir de la sesión
  const handleOnPress = async () => {
    resetUser();
    // Espera a que el estado se actualice antes de guardar en AsyncStorage
    await AsyncStorage.setItem("userInfo", JSON.stringify(user));
    console.log("Información reseteada y guardada con éxito");
    navigation.navigate("InitialScreen");
  };

  // Componente visual
  return (
    //Imagen de Fondo
    <View style={styles.background}>
      {/* Logo, Titulo */}
      <Image
        source={require("../../../assets/images/Logo_Tankef.png")}
        style={styles.imagen}
      />
      <Text style={styles.titulo}>TANKEF</Text>
      {/* Boton de Cerrar Sesion */}
      <TouchableOpacity
        style={{
          marginTop: 600,
          alignSelf: "center",
          alignItems: "center",
        }}
        onPress={() => handleOnPress()}
      >
        <Text
          style={{ fontSize: 40, fontFamily: "conthrax", color: "#29364d" }}
        >
          Cerrar Sesión
        </Text>
      </TouchableOpacity>
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
    fontSize: 60,
    color: "white",
    marginTop: 450,
    alignSelf: "center",
    position: "absolute",
  },
});

export default Perfil;
