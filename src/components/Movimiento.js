// Importaciones de React Native y React
import React, { useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const Movimiento = (props) => {
  return (
    <TouchableOpacity style={styles.CuadroMovimiento}>
      <Text style={styles.textoTitulo}>{props.titulo}</Text>
      <Text style={styles.textoFecha}>{props.fecha}</Text>
      <Text style={styles.textoBody}>{props.body}</Text>
      <View style={{ marginLeft: 60, marginTop: 15, flexDirection: "row" }}>
        <View style={styles.Tag}>
          <Text style={styles.textoTag}>{props.tag[0]}</Text>
        </View>
        <View style={styles.Tag}>
          <Text style={styles.textoTag}>{props.tag[1]}</Text>
        </View>
      </View>
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
    marginTop: 15,
    backgroundColor: "#F2F5F9",
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
});

export default Movimiento;
