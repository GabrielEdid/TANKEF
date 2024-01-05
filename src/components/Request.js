// Importaciones de React Native y React
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const Request = (props) => {
  return (
    <View style={styles.container}>
      <Image source={props.imagen} style={styles.icon} />
      <Text style={styles.textoNombre}>{props.nombre}</Text>
      <TouchableOpacity style={styles.botonConf}>
        <LinearGradient
          colors={["#2FF690", "#21B6D5"]}
          start={{ x: 0, y: 0 }} // Inicio del gradiente
          end={{ x: 1, y: 1 }} // Fin del gradiente
          style={styles.botonGradient}
        >
          <Text style={styles.textoBoton}>CONFIRMAR</Text>
        </LinearGradient>
      </TouchableOpacity>
      <TouchableOpacity style={styles.botonElim}>
        <Text style={[styles.textoBoton, { color: "#29364d", paddingTop: 7 }]}>
          ELIMINAR
        </Text>
      </TouchableOpacity>
      {/* Linea delgada para dividr cada Request */}
      <View
        style={{
          backgroundColor: "#cccccc",
          height: 1,
          width: 550,
          alignSelf: "center",
          position: "absolute",
          top: 80,
        }}
      ></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 85,
    width: 352,
  },
  textoNombre: {
    fontSize: 14,
    color: "#29364d",
    fontWeight: "bold",
    paddingTop: 10,
    width: 283,
    left: 70,
  },
  icon: {
    height: 57,
    width: 57,
    borderRadius: 50,
    marginTop: 10,
    position: "absolute",
  },
  botonGradient: {
    justifyContent: "center",
    height: 31,
    width: 135,
    alignSelf: "center",
    borderRadius: 8,
  },
  botonConf: {
    height: 31,
    width: 135,
    borderRadius: 8,
    position: "absolute",
    top: 35,
    left: 70,
  },
  botonElim: {
    height: 31,
    width: 135,
    borderRadius: 8,
    backgroundColor: "white",
    borderColor: "#29364d",
    borderWidth: 1,
    position: "absolute",
    top: 35,
    left: 212,
  },
  textoBoton: {
    fontSize: 12,
    fontFamily: "conthrax",
    textAlign: "center",
    paddingTop: 1,
    color: "white",
  },
});

export default Request;
