// Importaciones de React Native y React
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React from "react";
// Importaciones de Hooks y Componentes

const MisMovimientos = () => {
  // Componente visual
  return (
    <View style={styles.background}>
      {/* Titulo */}
      <Text style={styles.titulo}>TANKEF</Text>
      {/* Seccion de los Creditos del Usuario */}
      <Image
        style={styles.imagenCredito}
        source={require("../../../assets/images/Credito.png")}
      />
      <Text style={styles.texto}>Mis Créditos</Text>
      {/* Boton de Nuevo Crédito y Ver Más */}
      <TouchableOpacity style={styles.boton}>
        <Text style={[styles.textoBoton]}>NUEVO CRÉDITO</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.verMas}>
        <Text style={styles.textoVerMas}>VER MÁS</Text>
      </TouchableOpacity>
      {/* Seccion de las Inversiones del Usuario */}
      <Image
        style={styles.imagenInvertir}
        source={require("../../../assets/images/Invertir.png")}
      />
      <Text style={[styles.texto, { width: 150, marginTop: 435 }]}>
        Mis Inversiones
      </Text>
      {/* Boton de Invertir y Ver Más */}
      <TouchableOpacity style={[styles.boton, { marginTop: 440 }]}>
        <Text style={[styles.textoBoton]}>INVERTIR</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.verMas, { marginTop: 730 }]}>
        <Text style={styles.textoVerMas}>VER MÁS</Text>
      </TouchableOpacity>
    </View>
  );
};

// Estilos de la pantalla
const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "white",
  },
  titulo: {
    fontFamily: "conthrax",
    fontSize: 27,
    color: "#29364d",
    marginTop: 70,
    marginLeft: 20,
    position: "absolute",
  },
  imagenCredito: {
    width: 70,
    height: 45,
    tintColor: "#29364d",
    marginTop: 120,
    left: 20,
  },
  imagenInvertir: {
    width: 69,
    height: 52,
    tintColor: "#29364d",
    marginTop: 260,
    left: 20,
  },
  texto: {
    fontSize: 16,
    width: 110,
    fontFamily: "conthrax",
    color: "#29364d",
    marginTop: 120,
    left: 100,
    position: "absolute",
  },
  boton: {
    backgroundColor: "#29364d",
    width: 130,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    left: 240,
    marginTop: 130,
  },
  textoBoton: {
    fontSize: 10,
    fontFamily: "conthrax",
    color: "white",
    position: "absolute",
  },
  verMas: {
    width: 65,
    height: 20,
    borderRadius: 15,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    position: "absolute",
    marginTop: 390,
  },
  textoVerMas: {
    fontSize: 10,
    fontFamily: "conthrax",
    color: "#29364d",
    position: "absolute",
  },
});

export default MisMovimientos;
