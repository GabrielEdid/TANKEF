// Importaciones de React Native y React
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
} from "react-native";
// Importaciones de Componentes

const Conexion = (props) => {
  // Estados y Contexto
  const [isVisible, setIsVisible] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  // Para cuando se desee eliminar el Request
  const handleRemove = () => {
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", flex: 1 }}>
        <Image source={props.imagen} style={styles.icon} />
        <Text style={styles.textoNombre}>{props.nombre}</Text>
      </View>
      {/* Para Mostrar Boton de Eliminar */}
      <TouchableOpacity
        style={styles.botonElim}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.tresPuntos}>...</Text>
      </TouchableOpacity>

      {/* Modal para mostrar si se presióna el boton de eliminar */}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    marginTop: 3,
    paddingHorizontal: 20,
    height: 85,
    width: "100%",
    flexDirection: "row",
  },
  textoNombre: {
    fontSize: 20,
    fontFamily: "opensansbold",
    alignSelf: "center",
    color: "#060B4D",
    marginLeft: 10,
  },
  icon: {
    height: 48,
    width: 48,
    borderRadius: 50,
    alignSelf: "center",
  },
  tresPuntos: {
    fontSize: 30,
    marginTop: 20,
    fontFamily: "opensansbold",
    color: "#060B4D",
    transform: [{ rotate: "90deg" }],
  },
  linea: {
    backgroundColor: "#cccccc",
    height: 1,
    width: "100%",
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

export default Conexion;
