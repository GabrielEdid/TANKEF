// Importaciones de React Native y React
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const Request = (props) => {
  // Estados y Contexto
  const [isVisible, setIsVisible] = useState(true);
  const [estado, setEstado] = useState("inicial"); // Estados: "inicial", "solicitarConexion", "solicitudEnviada"

  // Para cuando se desee eliminar el Request
  const handleRemove = () => {
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  // Para cuando se confirma la conexión ofrecer enviar solicitud
  const confirmar = () => {
    setEstado("solicitarConexion");
  };

  // Para cuando se envía la solicitud de conexión mostrar que la solicitud fue enviada
  const solicitarConexion = () => {
    setEstado("solicitudEnviada");
  };

  return (
    <View style={styles.container}>
      <Image source={props.imagen} style={styles.icon} />
      <Text style={styles.textoNombre}>{props.nombre}</Text>

      {/* Para Mostrar Botones de Confirmar y Eliminar */}
      {estado === "inicial" && (
        <>
          <TouchableOpacity style={styles.botonConf} onPress={confirmar}>
            <LinearGradient
              colors={["#2FF690", "#21B6D5"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.botonGradient}
            >
              <Text style={styles.textoBoton}>CONFIRMAR</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.botonElim}
            onPress={() => handleRemove()}
          >
            <Text
              style={[styles.textoBoton, { color: "#29364d", paddingTop: 7 }]}
            >
              ELIMINAR
            </Text>
          </TouchableOpacity>
        </>
      )}

      {/* Para Mostrar Boton de Solicitar Conexion */}
      {estado === "solicitarConexion" && (
        <TouchableOpacity
          style={styles.botonSolicitar}
          onPress={solicitarConexion}
        >
          <LinearGradient
            colors={["#2FF690", "#21B6D5"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.botonGradient, { width: 200 }]}
          >
            <Text style={styles.textoBoton}>SOLICITAR CONEXIÓN</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}

      {/* Para Mostrar Boton de Solicitud Enviada */}
      {estado === "solicitudEnviada" && (
        <TouchableOpacity
          style={styles.botonSolicitudEnviada}
          onPress={confirmar}
        >
          <Text style={[styles.textoBoton, { color: "grey" }]}>
            SOLICITUD ENVIADA
          </Text>
        </TouchableOpacity>
      )}

      {/* Linea delgada para dividr cada Request */}
      <View style={styles.linea}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 85,
    width: 352,
  },
  textoNombre: {
    fontSize: 14,
    color: "#29364d",
    fontWeight: "bold",
    paddingTop: 10,
    width: 283,
    left: 70,
  },
  icon: {
    height: 57,
    width: 57,
    borderRadius: 50,
    marginTop: 10,
    position: "absolute",
  },
  botonGradient: {
    justifyContent: "center",
    height: 31,
    width: 135,
    alignSelf: "center",
    borderRadius: 8,
  },
  botonConf: {
    height: 31,
    width: 135,
    borderRadius: 8,
    position: "absolute",
    top: 35,
    left: 70,
  },
  botonElim: {
    height: 31,
    width: 135,
    borderRadius: 8,
    backgroundColor: "white",
    borderColor: "#29364d",
    borderWidth: 1,
    position: "absolute",
    top: 35,
    left: 212,
  },
  textoBoton: {
    fontSize: 12,
    fontFamily: "conthrax",
    textAlign: "center",
    paddingTop: 1,
    color: "white",
  },
  botonSolicitar: {
    height: 31,
    width: 200,
    position: "absolute",
    top: 36,
    left: 70,
  },
  botonSolicitudEnviada: {
    height: 31,
    width: 185,
    paddingTop: 7,
    borderRadius: 8,
    backgroundColor: "#D5D5D5",
    position: "absolute",
    top: 36,
    left: 70,
  },
  linea: {
    backgroundColor: "#cccccc",
    height: 1,
    width: 550,
    alignSelf: "center",
    position: "absolute",
    top: 80,
  },
});

export default Request;
