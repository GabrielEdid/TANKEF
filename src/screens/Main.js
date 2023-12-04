import {
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";

const Registro1 = ({ navigation }) => {
  return (
    //Imagen de Fondo
    <ImageBackground
      source={require("../../assets/images/Fondo.png")}
      style={styles.background}
    >
      <TouchableOpacity onPress={() => [navigation.navigate("InitialScreen")]}>
        <AntDesign
          name="arrowleft"
          size={40}
          color="#29364d"
          style={styles.back}
        />
      </TouchableOpacity>
      {/* Logo, Titulo */}
      <Image
        source={require("../../assets/images/Logo_Tankef.png")}
        style={styles.imagen}
      />
      <Text style={styles.titulo}>TANKEF</Text>
      {/* Fin Logo, Titulo y Avance */}
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

export default Registro1;
