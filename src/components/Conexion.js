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
import { AntDesign } from "@expo/vector-icons";

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
      <Image source={props.imagen} style={styles.icon} />
      <Text style={styles.textoNombre}>{props.nombre}</Text>
      {/* Para Mostrar Boton de Eliminar */}
      <TouchableOpacity
        style={styles.botonElim}
        onPress={() => setModalVisible(true)}
      >
        <AntDesign name="deleteuser" size={40} color="#29364d" />
      </TouchableOpacity>

      {/* Modal para mostrar si se presióna el boton de eliminar */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
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
    fontSize: 16,
    top: 20,
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
  botonElim: {
    height: 40,
    width: 45,
    alignItems: "center",
    position: "absolute",
    top: 20,
    left: 300,
  },
  linea: {
    backgroundColor: "#cccccc",
    height: 1,
    width: 550,
    alignSelf: "center",
    position: "absolute",
    top: 80,
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
