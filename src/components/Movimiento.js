// Importaciones de React Native y React
import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  Alert,
} from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
// Importaciones de Componentes
import { APIPost, APIDelete } from "../API/APIService";
import { UserContext } from "../hooks/UserContext";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";

/**
 * `Movimiento` es un componente que muestra información de un movimiento específico para créditos o inversiones del usuario.
 * permite ver fechas, montos y detalles de los movimientos realizados en la pantalla de MiTankef.
 *
 * Props:
 * - `movimiento`: Nombre del movimiento
 * - `fecha`: Fecha del movimiento
 * - `monto`: Monto del movimiento
 * - `positive`: Si el movimiento es positivo o negativo
 *
 * Ejemplo de uso (o ver en MiTankefInversion.js):
 * <Movimiento
 *  movimiento={"Pago mensual"}
 *  fecha={"10.FEB.2024"}
 *  monto={"$2,174.20 MN"}
 *  positive={false}
 *  />
 */

const Movimiento = (props) => {
  const navigation = useNavigation();
  // Estados y Contexto

  // Componente visual
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
        {/* Ensure alignment and spacing */}
        <AntDesign
          name={props.positive === true ? "arrowup" : "arrowdown"}
          size={24}
          color={props.positive === true ? "#2FF690" : "#F33B45"}
        />
        <View style={{ marginLeft: 10, flex: 1 }}>
          <Text style={styles.textoMovimiento}>{props.movimiento}</Text>
          <Text style={styles.textoFecha}>{props.fecha}</Text>
        </View>
        <Text style={styles.textoMonto}>{props.monto}</Text>
      </View>
      <View style={styles.linea} />
    </View>
  );
};

// Estilos del componente
const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 3,
    width: "100%",
    position: "relative",
  },
  textoMovimiento: {
    fontSize: 16,
    color: "#060B4D",
    fontFamily: "opensansbold",
  },
  textoFecha: {
    fontSize: 14,
    color: "#060B4D",
    fontFamily: "opensans",
  },
  textoMonto: {
    fontSize: 16,
    color: "#060B4D",
    alignSelf: "center",
    fontFamily: "opensansbold",
  },
});

export default Movimiento;
