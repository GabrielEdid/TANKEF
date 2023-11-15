import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
} from "react-native";

const InitialScreen = ({}) => {
  return (
    //Fondo de pantalla
    <ImageBackground
      source={require("../../assets/images/Fondo.png")}
      style={{ flex: 1 }}
    >
      {/*Logo de Tankef*/}
      <Image
        source={require("../../assets/images/Logo_Tankef.png")}
        style={styles.imagen}
      />
      {/*Contenedor de los botones*/}
      <View style={styles.container}>
        <TouchableOpacity style={{ marginBottom: 10 }}>
          <Text
            style={{
              color: "#29364d",
              textAlign: "center",
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            Ya tengo una cuenta
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.boton}>
          <Text
            style={{
              color: "white",
              textAlign: "center",
              fontSize: 22,
              fontFamily: "Conthrax",
            }}
          >
            CREAR CUENTA
          </Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 455,
    height: 240,
    justifyContent: "flex-end",
    backgroundColor: "white",
  },
  imagen: {
    width: 100,
    height: 100,
    alignSelf: "center",
    marginTop: 60,
  },
  boton: {
    width: 350,
    height: 60,
    alignSelf: "center",
    justifyContent: "center",
    marginBottom: 40,
    backgroundColor: "#29364d",
    borderRadius: 25,
  },
});

export default InitialScreen;
