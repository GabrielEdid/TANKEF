// Importaciones de React Native y React
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
// Importaciones de Componentes y Hooks

/**
 * `MiTankefObligado` es un componente que visualiza el obligado solidario y muestra
 * información relevante como los montos y el nombre del obligado.
 * Está diseñado para ofrecer una visión rápida y efectiva de los recursos financieros del usuario
 * dentro de la pantalla MiTankef, es un componente que NO debe ser reusable.
 *
 * Props:
 * Este componente no recibe props directamente, pero se espera que la data necesaria para
 * los obligados solidarios sea recuperada a través de una llamada a una API.
 *
 * Ejemplo de uso (o ver en MiTankef.js):
 * <MiTankefObligado />
 */

const MiTankefObligado = (props) => {
  // Mapa de imágenes
  const imageMap = {
    MiRed: require("../../assets/images/MiRed.png"),
    // ... más imágenes
  };

  // Componente visual
  return (
    <View>
      {/* Componente repetible */}
      <TouchableOpacity
        style={{
          alignItems: "center",
          marginLeft: 10,
          paddingVertical: 20,
          paddingHorizontal: 5,
          borderRadius: 10,
          maxWidth: 100,
          backgroundColor: "white",
        }}
      >
        <Image
          source={imageMap["MiRed"]}
          style={[styles.bill, { tintColor: "#060B4D" }]}
        />
        <Text
          style={{
            color: "#060B4D",
            fontFamily: "opensans",
            textAlign: "center",
          }}
        >
          Luis G. Ramírez
        </Text>
        <Text style={{ color: "#060B4D", fontFamily: "opensansbold" }}>
          $10K
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// Estilos del componente
const styles = StyleSheet.create({
  bill: {
    height: 30,
    width: 37,
    marginBottom: 5,
    tintColor: "#bcbeccff",
  },
});

export default MiTankefObligado;
