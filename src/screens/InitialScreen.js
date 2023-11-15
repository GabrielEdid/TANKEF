import React from "react";
import { View, Text, StyleSheet, Image, ImageBackground } from "react-native";

const InitialScreen = ({}) => {
  return (
    //Fondo de pantalla
    <ImageBackground
      source={require("../../Images/Fondo.png")}
      style={{ flex: 1 }}
    >
      //Logo de Tankef
      <View style={{ flex: 1 }}>
        <Image
          source={require("../../Images/Logo_Tankef.png")}
          style={styles.imagen}
        />
      </View>
      //Contenedor de los botones
      <View style={styles.container}></View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 500,
    height: 250,
    justifyContent: "flex-end",
    backgroundColor: "white",
  },
  imagen: {
    width: 100,
    height: 100,
    alignSelf: "center",
    marginTop: 60,
  },
});

export default InitialScreen;
