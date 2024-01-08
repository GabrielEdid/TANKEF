import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const ProgressBar = ({ progress }) => {
  const width = progress * 100; // Convierte la proporción a porcentaje
  const progressText = `${width.toFixed(0)}%`; // Texto del porcentaje

  return (
    <View style={styles.container}>
      <View style={styles.progressBarBackground}>
        <LinearGradient
          colors={["#2FF690", "#21B6D5"]}
          style={[styles.progressBarFill, { width: width + "%" }]}
          start={{ x: 1, y: 1 }}
          end={{ x: 0, y: 0 }}
        />
      </View>
      <Text style={styles.progressText}>{progressText}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row", // Alinea la barra de progreso y el texto horizontalmente
    alignSelf: "center",
  },
  progressBarBackground: {
    height: 10,
    width: "85%",
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    marginTop: 20,
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 10,
  },
  progressText: {
    marginLeft: 10,
    fontSize: 12,
    fontFamily: "conthrax",
    marginTop: 20,
  },
});

export default ProgressBar;
