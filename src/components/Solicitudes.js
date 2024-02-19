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
import { ActivityIndicator } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
// Importaciones de Componentes
import { FontAwesome } from "@expo/vector-icons";
import { APIDelete } from "../API/APIService";

/**
 * `Solicitudes` es un componente que muestra información de una Solicitud específica enviada por el usuario,
 * como una tarjeta interactuable. Ofrece la funcionalidad para navegar a una vista detallada
 * del perfil asociado y la opción de eliminar la Solicitud enviada con confirmación mediante un modal.
 *
 * Props:
 * - `objectID`: Identificador único del objeto renderizado, se utiliza para eliminar la solicitud.
 * - `userID`: Identificador único del usuario asociado a la solicitud.
 * - `imagen`: Puede ser una URL de imagen o un recurso local para mostrar como avatar del usuario.
 * - `nombre`: Nombre del usuario a mostrar en la tarjeta de solicitud.
 * - `mail`: Correo electrónico del usuario asociado a la solicitud.
 *
 * Ejemplo de uso (o ver en MiRed.js):
 * <Solicitudes
 *   userID="123"
 *   objectID="456"
 *   imagen="https://ruta/a/imagen.jpg"
 *   nombre="John Doe"
 *   mail="johndoe@gmail.com"
 * />
 */

const Solicitudes = (props) => {
  const navigation = useNavigation();
  // Estados y Contexto
  const [isVisible, setIsVisible] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Para cuando se desee eliminar una Solicitud pendiente
  const deleteSolicitud = async () => {
    setIsLoading(true);
    const url = `/api/v1/friendship_request/cancel`;
    const data = {
      id: props.objectID,
    };

    try {
      const response = await APIDelete(url, data);
      console.log("Request Deleted:", response.data);
      setIsVisible(false);
    } catch (error) {
      console.error("Error:", error);
    }
    setIsLoading(false);
  };

  // Si la solicitud ya no es visible, no se renderiza
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
      disabled={isLoading}
      onPress={() =>
        navigation.navigate("VerPerfiles", { userID: props.userID })
      }
    >
      <View style={{ flexDirection: "row", flex: 1 }}>
        <Image source={imageSource} style={styles.icon} />
        <Text style={styles.textoNombre}>{props.nombre}</Text>
      </View>
      {/* Para Mostrar Boton de Eliminar la Solicitud */}
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <FontAwesome
          name="trash-o"
          size={30}
          color="#F95C5C"
          style={{ marginTop: 20 }}
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
              onPress={() => deleteSolicitud()}
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
      {/* Overlay para mostrar un indicator al eliminar */}
      {isLoading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#060B4D" />
        </View>
      )}
    </TouchableOpacity>
  );
};

// Estilos para el componente
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
  linea: {
    backgroundColor: "#cccccc",
    height: 1,
    width: "100%",
    alignSelf: "center",
    position: "absolute",
    top: 80,
  },
  // Estilos para el modal
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

export default Solicitudes;
