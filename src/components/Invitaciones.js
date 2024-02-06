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
// Importaciones de Componentes
import { APIPost } from "../API/APIService";
import { UserContext } from "../hooks/UserContext";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";

const Invitaciones = (props) => {
  // Estados y Contexto
  const { user, setUser } = useContext(UserContext);
  const [isVisible, setIsVisible] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  // Para cuando se desee eliminar el Request
  const handleRemove = () => {
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  const postAccept = async () => {
    const url = "/api/v1/friendship_request/accept";
    const data = { contact_id: props.userID };

    const response = await APIPost(url, data);
    if (response.error) {
      // Manejar el error
      console.error("Error al aceptar Invitacion:", response.error);
      Alert.alert(
        "Error",
        "No se pudo aceptar la invitacion. Intente nuevamente."
      );
    } else {
      // Continuar en caso de éxito
      handleRemove();
    }
  };

  let imageSource;
  if (typeof props.imagen === "string") {
    // Assuming it's a URL for a network image
    imageSource = { uri: props.imagen };
  } else {
    // Assuming it's a local image requiring require()
    imageSource = props.imagen;
  }

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", flex: 1 }}>
        <Image source={imageSource} style={styles.icon} />
        <Text style={styles.textoNombre}>{props.nombre}</Text>
      </View>
      {/* Para Mostrar Boton de Eliminar */}
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <MaterialIcons
          name="highlight-remove"
          size={42}
          color="#F95C5C"
          style={{ marginTop: 16 }}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => postAccept()}>
        <FontAwesome5
          name="check-circle"
          size={36}
          color="#31CC18"
          style={{ marginTop: 18, marginLeft: 10 }}
        />
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
              Si eliminas la solicitud deberás volver a enviarla.
            </Text>
            <TouchableOpacity
              style={styles.buttonModal}
              onPress={() => handleRemove()}
            >
              <Text style={{ color: "red" }}>Eliminar Solicitud</Text>
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
    height: 75,
    width: "100%",
    flexDirection: "row",
  },
  textoNombre: {
    fontSize: 17,
    alignSelf: "center",
    color: "#060B4D",
    fontFamily: "opensansbold",
    marginLeft: 10,
  },
  icon: {
    height: 45,
    width: 45,
    borderRadius: 50,
    alignSelf: "center",
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

export default Invitaciones;
