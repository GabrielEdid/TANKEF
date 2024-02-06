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
          <View style={styles.buttonContainer}>
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
          </View>
        </>
      )}
      {/* Para Mostrar Boton de Solicitud Enviada */}
      {estado === "solicitudEnviada" && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.botonConectado}
            onPress={() => setModalVisible(true)}
          >
            <Text style={[styles.textoBoton, { color: "grey" }]}>
              CONECTADO
            </Text>
          </TouchableOpacity>
        </View>
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
    flex: 1,
    height: 85,
  },
  textoNombre: {
    fontSize: 14,
    color: "#29364d",
    fontWeight: "bold",
    paddingTop: 10,
    left: 65,
  },
  icon: {
    height: 57,
    width: 57,
    borderRadius: 50,
    position: "absolute",
    marginTop: 10,
  },
  buttonContainer: {
    top: 10,
    width: "100%",
    flexDirection: "row",
    left: 60,
    paddingRight: 70,
  },
  botonGradient: {
    flex: 1,
    width: "95%",
    justifyContent: "center",
    height: 31,
    alignSelf: "center",
    borderRadius: 8,
  },
  botonConf: {
    width: "95%",
    height: 31,
    flex: 1,
    borderRadius: 8,
  },
  botonElim: {
    flex: 1,
    width: "95%",
    height: 31,
    borderRadius: 8,
    backgroundColor: "white",
    borderColor: "#29364d",
    borderWidth: 1,
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
    width: "100%",
    paddingTop: 7,
    left: 2.5,
    borderRadius: 8,
    backgroundColor: "#D5D5D5",
  },
  linea: {
    backgroundColor: "#cccccc",
    height: 1,
    width: "100%",
    alignSelf: "center",
    position: "absolute",
    top: 80,
  },
  // Estilos para el Modal que aparece si se elimina una conexión
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
    paddingBottom: 30,
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
    width: "100%",
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
