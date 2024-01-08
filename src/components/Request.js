// Importaciones de React Native y React
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const Request = (props) => {
  // Estados y Contexto
  const [isVisible, setIsVisible] = useState(true);
  const [estado, setEstado] = useState("inicial"); // Estados: "inicial", "solicitarConexion", "solicitudEnviada"
  const [modalVisible, setModalVisible] = useState(false);

  // Para cuando se desee eliminar el Request
  const handleRemove = () => {
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  // Para cuando se envía la solicitud de conexión mostrar que la solicitud fue enviada
  const confirmar = () => {
    setEstado("solicitudEnviada");
  };

  // Componente visual
  return (
    // Contendedor de cada Request
    <View style={styles.container}>
      {/* Imagen y Nombre de la persona */}
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
      {/* Para Mostrar Boton de Solicitud Enviada */}
      {estado === "solicitudEnviada" && (
        <TouchableOpacity
          style={styles.botonConectado}
          onPress={() => setModalVisible(true)}
        >
          <Text style={[styles.textoBoton, { color: "grey" }]}>CONECTADO</Text>
        </TouchableOpacity>
      )}

      {/* Modal para mostrar si se presióna el boton de CONECTADO*/}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.fullScreenButton}
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}
        >
          <View style={styles.modalView}>
            <Text style={{ fontSize: 13 }}>
              Si eliminas las conexión deberás volver a solicitarla.
            </Text>
            <TouchableOpacity
              style={styles.buttonModal}
              onPress={() => handleRemove()}
            >
              <Text style={{ color: "red" }}>Eliminar Conexión</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ marginTop: 10 }}
              onPress={() => setModalVisible(false)}
            >
              <Text>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

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
  botonConectado: {
    height: 31,
    width: 140,
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
  fullScreenButton: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    position: "absolute",
    bottom: 0,
    width: "90%",
    alignSelf: "center",
  },
  buttonModal: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginVertical: 5,
  },
});

export default Request;
