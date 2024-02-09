// Importaciones de React Native y React
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
// Importaciones de Componentes
import { APIDelete } from "../API/APIService";

const Conexion = (props) => {
  const navigation = useNavigation();
  // Estados y Contexto
  const [isVisible, setIsVisible] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  // Para cuando se desee eliminar una conexión
  const deleteConection = async () => {
    // Solicitar confirmación del usuario antes de proceder
    Alert.alert(
      "Eliminar Conexión",
      "¿Estás seguro de que quieres eliminar esta conexión?",
      [
        {
          text: "Cancelar",
          onPress: () => console.log("Cancelado"),
          style: "cancel",
        },
        {
          text: "Eliminar",
          onPress: async () => {
            const url = `/api/v1/friendship_request/destroy`;
            const data = {
              id: props.userID,
            };

            try {
              const response = await APIDelete(url, data);
              if (!response.error) {
                console.log("Conexión Eliminada:", response.data);
                // Retroalimentación al usuario sobre la acción exitosa
                Alert.alert("Éxito", "La conexión ha sido eliminada.");
                setIsVisible(false); // Actualizar el estado solo después de confirmar la acción
              } else {
                throw new Error("La API respondió con un error.");
              }
            } catch (error) {
              console.error("Error al eliminar la conexión:", error);
              // Retroalimentación al usuario en caso de error
              Alert.alert(
                "Error",
                "No se pudo eliminar la conexión. Por favor, intenta nuevamente."
              );
              setIsVisible(true); // Considera mantener o revertir el elemento visible en caso de error
            }
          },
        },
      ]
    );
  };

  if (!isVisible) {
    return null;
  }

  let imageSource;
  if (typeof props.imagen === "string") {
    // Assuming it's a URL for a network image
    imageSource = { uri: props.imagen };
  } else {
    // Assuming it's a local image requiring require()
    imageSource = props.imagen;
  }

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() =>
        navigation.navigate("VerPerfiles", { userID: props.userID })
      }
    >
      <View style={{ flexDirection: "row", flex: 1 }}>
        <Image source={imageSource} style={styles.icon} />
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
              Si eliminas la conexión deberás volver a solicitarla.
            </Text>
            <TouchableOpacity
              style={styles.buttonModal}
              onPress={() => deleteConection()}
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
  },
  textoNombre: {
    fontSize: 17,
    fontFamily: "opensansbold",
    alignSelf: "center",
    color: "#060B4D",
    marginLeft: 10,
  },
  icon: {
    height: 45,
    width: 45,
    borderRadius: 50,
    alignSelf: "center",
  },
  tresPuntos: {
    fontSize: 25,
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

export default Conexion;
