// Importaciones de React Native y React
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

/**
 * `ProgressBar` es un componente visual que muestra una barra de progreso lineal.
 * Utiliza un gradiente de colores para representar visualmente el progreso hacia un objetivo.
 * Este componente es ideal para mostrar progresos de carga, avances en tareas, porcentajes
 * de completitud de perfiles, entre otros.
 *
 * Props:
 * - `progress`: Un número entre 0 y 1 que representa la fracción del progreso completado.
 *               Por ejemplo, 0.5 representa un 50% de progreso.
 *
 * Ejemplo de uso (o ver en Perfil.js):
 * <ProgressBar progress={0.75} />
 */

const ProgressBar = ({ progress }) => {
  // Calcula el ancho de la barra de progreso
  const width = progress * 100; // Convierte la proporción a porcentaje
  const progressText = `${width.toFixed(0)}%`; // Texto del porcentaje

  // Componente visual
  return (
    //Contenedor de la barra de progreso
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

// Estilos del componente
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
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
    fontSize: 14,
    fontFamily: "opensansbold",
    marginTop: 15,
  },
});

export default ProgressBar;
