import {
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import React, { useContext, useEffect } from "react";
import { UserContext } from "../hooks/UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Main = ({ navigation }) => {
  const { user, setUser, resetUser } = useContext(UserContext);

  const handleOnPress = async () => {
    resetUser();
    // Espera a que el estado se actualice antes de guardar en AsyncStorage
    await AsyncStorage.setItem("userInfo", JSON.stringify(user));
    console.log("Información reseteada y guardada con éxito");
    navigation.navigate("InitialScreen");
  };

  return (
    //Imagen de Fondo
    <ImageBackground
      source={require("../../assets/images/Fondo.png")}
      style={styles.background}
    >
      {/* Logo, Titulo */}
      <Image
        source={require("../../assets/images/Logo_Tankef.png")}
        style={styles.imagen}
      />
      <Text style={styles.titulo}>TANKEF</Text>
      {/* Fin Logo y Titulo */}
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
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  back: {
    marginTop: 60,
    marginLeft: 20,
    position: "absolute",
  },
  background: {
    flex: 1,
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

export default Main;
