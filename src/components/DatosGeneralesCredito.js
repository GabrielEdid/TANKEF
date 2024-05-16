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
import { FinanceContext } from "../hooks/FinanceContext";
import { Ionicons } from "@expo/vector-icons";

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

const DatosGeneralesCredito = () => {
  const navigation = useNavigation();
  // Contexto de crédito
  const { finance, setFinance } = useContext(FinanceContext);

  // Componente visual
  return (
    <>
      <Text style={styles.texto}>Información General</Text>
      <View style={[styles.contenedores, { flexDirection: "row" }]}>
        <View style={{ flex: 1 }}>
          <Text style={styles.concepto}>Cargo politico</Text>
          <Text style={styles.valorConcepto}>
            {finance.politico === true ? "Sí" : "No"}
          </Text>
        </View>
        <Ionicons
          name="remove-outline"
          size={30}
          color="#e1e2ebff"
          style={styles.line}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.concepto}>Tipo de domicilio</Text>
          <Text style={styles.valorConcepto}>
            {finance.domicilio === "own" ? "Propio" : "Rentado"}
          </Text>
        </View>
      </View>
      <View
        style={[styles.contenedores, { flexDirection: "row", marginTop: 0 }]}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.concepto}>Tel. Casa</Text>
          <Text style={styles.valorConcepto}>{finance.telCasa}</Text>
        </View>
        <Ionicons
          name="remove-outline"
          size={30}
          color="#e1e2ebff"
          style={styles.line}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.concepto}>Tel. Trabajo</Text>
          <Text style={styles.valorConcepto}>{finance.telTrabajo}</Text>
        </View>
      </View>
      <View
        style={[styles.contenedores, { flexDirection: "row", marginTop: 0 }]}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.concepto}>Celular</Text>
          <Text style={styles.valorConcepto}>{finance.celular}</Text>
        </View>
        <Ionicons
          name="remove-outline"
          size={30}
          color="#e1e2ebff"
          style={styles.line}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.concepto}>Cuenta Bancaria</Text>
          <Text style={styles.valorConcepto}>{finance.alias}</Text>
        </View>
      </View>
      <View style={{ backgroundColor: "white", marginTop: 3 }}>
        <View style={styles.description}>
          <Text
            style={[
              styles.bodyCampo,
              {
                padding: 10,
                marginBottom: 0,
                color: "#060B4D",
              },
            ]}
          >
            {finance.descripcion}
          </Text>
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
  tituloCampo: {
    marginTop: 5,
    paddingLeft: 15,
    marginBottom: 5,
    fontSize: 14,
    color: "#060B4D",
    fontFamily: "opensanssemibold",
  },
  bodyCampo: {
    fontSize: 16,
    color: "#060B4D",
    fontFamily: "opensanssemibold",
    paddingLeft: 15,
    marginBottom: 10,
  },
  texto: {
    marginVertical: 25,
    textAlign: "center",
    fontSize: 18,
    fontFamily: "opensansbold",
    paddingTop: 1,
    color: "#060B4D",
  },
  concepto: {
    fontFamily: "opensans",
    fontSize: 14,
    color: "#060B4D",
    textAlign: "center",
  },
  valorConcepto: {
    fontFamily: "opensansbold",
    fontSize: 16,
    color: "#060B4D",
    textAlign: "center",
  },
  line: {
    transform: [{ rotate: "90deg" }],
  },
  description: {
    borderRadius: 10,
    borderColor: "#afb0c4ff",
    borderWidth: 1,
    backgroundColor: "#E9E9E9",
    flex: 1,
    width: "93%",
    color: "#060B4D",
    alignSelf: "center",
    marginVertical: 10,
  },
  separacion: {
    height: 1,
    width: "100%",
    backgroundColor: "#cecfdbff",
  },
});

export default DatosGeneralesCredito;
