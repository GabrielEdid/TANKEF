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
import { APIDelete } from "../API/APIService";

const Comment = (props) => {
  // Estados y Contexto
  const [isVisible, setIsVisible] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  // Para cuando se desee eliminar el Comment
  const deleteComment = async () => {
    setIsVisible(false);
    const url = `/api/v1/comments/${props.commentId}`;

    try {
      const response = await APIDelete(url);
      console.log("Comment Deleted:", response.data);
      setIsVisible(false);
      props.setCount(props.count - 1);
    } catch (error) {
      console.error("Error:", error);
    }
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
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={imageSource} style={styles.icon} />
        <View style={styles.nameAndBodyContainer}>
          <Text style={styles.textoNombre}>{props.nombre}</Text>
          <Text style={styles.textoBody}>{props.body}</Text>
        </View>
        <TouchableOpacity
          style={styles.botonElim}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.tresPuntos}>...</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.linea} />

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
            {props.personal ? (
              <TouchableOpacity
                style={styles.buttonModal}
                onPress={() => {
                  deleteComment();
                }}
              >
                <Text style={{ color: "red" }}>Eliminar Comentario</Text>
              </TouchableOpacity>
            ) : null}
            {!props.personal ? (
              <TouchableOpacity
                style={styles.buttonModal}
                onPress={() => console.log("Implementación de Reportar")}
              >
                <Text style={{ color: "red" }}>Reportar Comentario</Text>
              </TouchableOpacity>
            ) : null}
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
    marginTop: 3,
    paddingHorizontal: 20,
    paddingTop: 5,
    width: "100%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  nameAndBodyContainer: {
    flex: 1,
    marginLeft: 10,
    justifyContent: "center",
  },
  textoNombre: {
    fontSize: 12,
    fontFamily: "opensansbold",
    color: "#060B4D",
  },
  textoBody: {
    fontSize: 12,
    fontFamily: "opensans",
    color: "#060B4D",
  },
  icon: {
    height: 30,
    width: 30,
    borderRadius: 15,
  },
  tresPuntos: {
    fontSize: 18,
    fontFamily: "opensansbold",
    color: "#060B4D",
    marginLeft: 10,
    transform: [{ rotate: "90deg" }],
  },
  linea: {
    backgroundColor: "#cccccc",
    height: 1,
    width: "100%",
    alignSelf: "center",
    marginTop: 10,
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

export default Comment;
