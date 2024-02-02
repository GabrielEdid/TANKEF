// Importaciones de React Native y React
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

const Notificacion = (props) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={{ flexDirection: "row" }}>
        <Image source={props.imagen} style={styles.icon} />
        <Text style={styles.textoNombre}>
          {props.nombre}{" "}
          <Text style={{ fontWeight: "normal" }}>{props.body}</Text>
        </Text>
        <Text style={styles.textoTiempo}>Hace {props.tiempo}</Text>
      </TouchableOpacity>
      {/* Linea delgada para dividr cada Notificacion */}
      <View
        style={{
          backgroundColor: "#cccccc",
          height: 1,
          width: "100%",
          alignSelf: "center",
          top: 15,
        }}
      ></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 85,
    width: "100%",
    marginEnd: 10,
  },
  textoNombre: {
    fontSize: 13,
    color: "#29364d",
    fontWeight: "bold",
    paddingTop: 15,
    width: "80%",
    left: 10,
  },
  icon: {
    height: 57,
    width: 57,
    borderRadius: 50,
    marginTop: 10,
  },
  textoTiempo: {
    fontSize: 12,
    color: "grey",
    paddingTop: 5,
    width: "100%",
    position: "absolute",
    top: "70%",
    left: 67.5,
  },
});

export default Notificacion;
