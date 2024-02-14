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
// Importaciones de Componentes
import { APIPost, APIDelete } from "../API/APIService";
import { UserContext } from "../hooks/UserContext";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";

const Invitaciones = (props) => {
  // Estados y Contexto
  const { user, setUser } = useContext(UserContext);
  const [isVisible, setIsVisible] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Para cuando se desee eliminar una conexión
  const postReject = async () => {
    setIsLoading(true);
    const url = `/api/v1/friendship_request/reject`;
    const data = {
      invitation_id: props.objectID,
    };

    try {
      const response = await APIPost(url, data);
      if (!response.error) {
        console.log("Invitation Rejected:", response.data);
        setIsVisible(false);
      }
    } catch (error) {
      console.error("Error:", error);
    }
    setIsLoading(false);
  };

  if (!isVisible) {
    return null;
  }

  const postAccept = async () => {
    setIsLoading(true);
    const url = "/api/v1/friendship_request/accept";
    const data = {
      contact_id: props.objectID,
    };

    const response = await APIPost(url, data);
    if (response.error) {
      // Manejar el error
      console.error("Error al aceptar Invitacion:", response.error);
      Alert.alert(
        "Error",
        "No se pudo aceptar la invitacion. Intente nuevamente."
      );
    } else {
      setIsLoading(false);
      setIsVisible(false);
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
    <TouchableOpacity style={styles.container} disabled={isLoading}>
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
              onPress={() => postReject()}
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
      {isLoading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#060B4D" />
        </View>
      )}
    </TouchableOpacity>
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
    position: "relative",
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
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.2)", // Sombreado suave
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Invitaciones;
