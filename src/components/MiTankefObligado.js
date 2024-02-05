// Importaciones de React Native y React
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
// Importaciones de Componentes y Hooks

const MiTankefObligado = (props) => {
  const imageMap = {
    MiRed: require("../../assets/images/MiRed.png"),
    // ... más imágenes
  };

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

const styles = StyleSheet.create({
  bill: {
    height: 30,
    width: 37,
    marginBottom: 5,
    tintColor: "#bcbeccff",
  },
});

export default MiTankefObligado;
