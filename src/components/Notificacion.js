// Importaciones de React Native y React
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

const Notificacion = (props) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity>
        <Image source={props.imagen} style={styles.icon} />
        <Text style={styles.textoNombre}>
          {props.nombre}{" "}
          <Text style={{ fontWeight: "normal" }}>{props.body}</Text>
        </Text>
        <Text style={styles.textoTiempo}>Hace {props.tiempo}</Text>
      </TouchableOpacity>
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
    marginEnd: 10,
  },
  textoNombre: {
    fontSize: 13,
    color: "#29364d",
    fontWeight: "bold",
    paddingTop: 15,
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
  textoTiempo: {
    fontSize: 12,
    color: "grey",
    paddingTop: 5,
    width: 200,
    left: 70,
  },
});

export default Notificacion;
