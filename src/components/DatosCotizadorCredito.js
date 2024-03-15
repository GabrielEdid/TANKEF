// Importaciones de React Native y React
import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
// Importaciones de Componentes y Contextos
import { Ionicons } from "@expo/vector-icons";
import { CreditContext } from "../hooks/CreditContext";

/**
 * `Conexion` es un componente que muestra información de una conexión específica,
 * como una tarjeta interactuable. Ofrece la funcionalidad para navegar a una vista detallada
 * del perfil asociado y la opción de eliminar esta conexión con confirmación mediante un modal.
 *
 * Props:
 * - `userID`: Identificador único del usuario asociado a la conexión.
 * - `imagen`: Puede ser una URL de imagen o un recurso local para mostrar como avatar del usuario.
 * - `nombre`: Nombre del usuario a mostrar en la tarjeta de conexión.
 * - `mail`: Correo electrónico del usuario asociado a la conexión.
 *
 * Ejemplo de uso (o ver en MiRed.js):
 * <Conexion
 *   userID="123"
 *   imagen="https://ruta/a/imagen.jpg"
 *   nombre="John Doe"
 *   mail="johndoe@gmail.com"
 * />
 */

const DatosCotizadorCredito = () => {
  const navigation = useNavigation();
  // Contexto de crédito
  const { credit, setCredit } = useContext(CreditContext);

  // Componente visual
  return (
    <>
      <View style={styles.contenedores}>
        <Text style={[styles.texto, { fontFamily: "opensansbold" }]}>
          Total a pagar
        </Text>
        <Text style={styles.monto}>{credit.total_a_pagar}</Text>
      </View>
      <View style={[styles.contenedores, { flexDirection: "row" }]}>
        <View style={{ flex: 1 }}>
          <Text style={styles.concepto}>Comisión por{"\n"}apertura</Text>
          <Text style={styles.valorConcepto}>
            {credit.comision_por_apertura}
          </Text>
        </View>
        <Ionicons
          name="remove-outline"
          size={30}
          color="#e1e2ebff"
          style={styles.line}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.concepto}>Tasa de{"\n"}operación</Text>
          <Text style={styles.valorConcepto}>{credit.tasa_de_operacion}</Text>
        </View>
        <Ionicons
          name="remove-outline"
          size={30}
          color="#e1e2ebff"
          style={styles.line}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.concepto}>Pago{"\n"}mensual</Text>
          <Text style={styles.valorConcepto}>{credit.pago_mensual}</Text>
        </View>
      </View>
    </>
  );
};

// Estilos del componente
const styles = StyleSheet.create({
  contenedores: {
    backgroundColor: "white",
    paddingHorizontal: 12,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 3,
  },
  concepto: {
    fontFamily: "opensans",
    fontSize: 14,
    color: "#060B4D",
    textAlign: "center",
  },
  monto: {
    paddingTop: 10,
    fontSize: 35,
    color: "#060B4D",
    marginTop: -10,
    marginBottom: 10,
    fontFamily: "opensanssemibold",
  },
  valorConcepto: {
    fontFamily: "opensanssemibold",
    fontSize: 16,
    color: "#060B4D",
    textAlign: "center",
  },
  separacion: {
    height: 1,
    width: "100%",
    backgroundColor: "#cecfdbff",
  },
  texto: {
    color: "#060B4D",
    textAlign: "center",
    fontFamily: "opensans",
    fontSize: 16,
  },
  line: {
    transform: [{ rotate: "90deg" }],
  },
});

export default DatosCotizadorCredito;
