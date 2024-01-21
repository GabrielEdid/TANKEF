// Importaciones de React Native y React
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
// Importaciones de Componentes y Hooks
import { Feather } from "@expo/vector-icons";

const MovimientoCredito = (props) => {
  switch (props.tag[1]) {
    case "Completado":
      colorTag = "#59B335";
      break;
    case "En Espera":
      colorTag = "#F09937";
      break;
    default:
      colorTag = "#29364d";
      break;
  }

  return (
    <TouchableOpacity style={styles.CuadroMovimiento}>
      <Text style={styles.textoTitulo}>{props.titulo}</Text>
      <Text style={styles.textoFecha}>{props.fecha}</Text>
      <Text style={styles.textoBody}>{props.body}</Text>
      <View style={{ marginLeft: 60, marginTop: 15, flexDirection: "row" }}>
        <View style={styles.Tag}>
          <Text style={styles.textoTag}>{props.tag[0]}</Text>
        </View>
        <View style={[styles.Tag, { backgroundColor: colorTag }]}>
          <Text style={styles.textoTag}>{props.tag[1]}</Text>
        </View>
      </View>
      <Feather
        name="arrow-down"
        size={35}
        color="#29364d"
        style={styles.arrow}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  CuadroMovimiento: {
    borderRadius: 13,
    height: 115,
    alignSelf: "stretch",
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 10,
    marginTop: 5,
    backgroundColor: "#F2F5F9", //"#E9ECEF"
    shadowOffset: { width: 0, height: 2 }, // Desplazamiento de la sombra
    shadowOpacity: 0.3, // Opacidad de la sombra
    shadowRadius: 4, // Radio de la sombra
    elevation: 5, // Elevación para Android
    shadowColor: "#000000", // Color de la sombra
  },
  Tag: {
    borderRadius: 13,
    alignSelf: "flex-start",
    marginRight: 10,
    backgroundColor: "#29364d",
  },
  textoTag: {
    fontSize: 11,
    color: "white",
    fontWeight: "800",
    textAlign: "left",
    padding: 8,
  },
  textoTitulo: {
    fontSize: 18,
    color: "#29364d",
    fontWeight: "bold",
    textAlign: "left",
    paddingTop: 15,
    paddingLeft: 60,
  },
  textoFecha: {
    fontSize: 14,
    color: "#29364d",
    fontWeight: "normal",
    textAlign: "left",
    paddingTop: 5,
    paddingLeft: 60,
  },
  textoBody: {
    fontSize: 18,
    color: "#29364d",
    fontWeight: "bold",
    textAlign: "right",
    alignSelf: "flex-end",
    paddingTop: 45,
    paddingRight: 25,
    position: "absolute",
  },
  arrow: {
    position: "absolute",
    top: 15,
    left: 15,
  },
});

export default MovimientoCredito;
