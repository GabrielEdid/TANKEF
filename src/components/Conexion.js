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
import { ActivityIndicator } from "react-native-paper";
// Importaciones de Componentes
import { useInactivity } from "../hooks/InactivityContext";
import { APIDelete } from "../API/APIService";

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

const Conexion = (props) => {
  const navigation = useNavigation();
  // Estados y Contexto
  const { resetTimeout } = useInactivity();
  const [isVisible, setIsVisible] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Para cuando se desee eliminar una conexión
  const deleteConection = async () => {
    resetTimeout();
    setIsLoading(true);
    const url = `/api/v1/friendship_request/destroy`;
    const data = {
      id: props.userID,
    };

    try {
      const response = await APIDelete(url, data);
      console.log("Conection Deleted:", response.data);
      setIsVisible(false);
    } catch (error) {
      console.error("Error:", error);
    }
    setIsLoading(false);
  };

  // Si la conexión no es visible, no se renderiza
  if (!isVisible) {
    return null;
  }

  // Determinar la fuente de la imagen
  let imageSource;
  if (typeof props.imagen === "string") {
    // Assuming it's a URL for a network image
    imageSource = { uri: props.imagen };
  } else {
    // Assuming it's a local image requiring require()
    imageSource = props.imagen;
  }

  // Componente visual
  return (
    // Lo hace un boton
    <TouchableOpacity
      style={styles.container}
      onPress={() => [
        navigation.navigate("VerPerfiles", { userID: props.userID }),
        resetTimeout(),
      ]}
      disabled={isLoading}
    >
      <View style={{ flexDirection: "row", flex: 1 }}>
        <Image source={imageSource} style={styles.icon} />
        <Text style={styles.textoNombre}>{props.nombre}</Text>
      </View>
      {/* Para Mostrar Boton de Eliminar */}
      <TouchableOpacity
        style={styles.botonElim}
        onPress={() => [setModalVisible(true), resetTimeout()]}
      >
        <Text style={styles.tresPuntos}>...</Text>
      </TouchableOpacity>

      {/* Modal para mostrar si se presióna el boton de eliminar */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => [setModalVisible(false), resetTimeout()]}
      >
        <TouchableOpacity
          style={styles.fullScreenButton}
          activeOpacity={1}
          onPress={() => [setModalVisible(false), resetTimeout()]}
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
              onPress={() => [setModalVisible(false), resetTimeout()]}
            >
              <Text>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
      {/* Overlay para mostrar un indicator al eliminar */}
      {isLoading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#060B4D" />
        </View>
      )}
    </TouchableOpacity>
  );
};

// Estilos del componente
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
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Conexion;
