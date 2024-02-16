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
        <View style={styles.contentContainer}>
          <View style={styles.nameAndBodyContainer}>
            <Text style={styles.textoNombre}>{props.nombre}</Text>
            <Text style={styles.textoBody}>{props.body}</Text>
            <TouchableOpacity onPress={() => props.onReply(props.nombre)}>
              <Text style={[styles.textoBody, { color: "grey", marginTop: 3 }]}>
                Contestar
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={{ alignItems: "center", justifyContent: "center" }}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.tresPuntos}>...</Text>
          </TouchableOpacity>
        </View>
      </View>

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
    marginVertical: 5,
    paddingHorizontal: 20,
    width: "100%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  contentContainer: {
    marginLeft: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    marginRight: 25,
  },
  nameAndBodyContainer: {
    backgroundColor: "#f0f2f5ff",
    borderRadius: 20,
    padding: 10,
    justifyContent: "center",
    marginRight: 10,
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
    height: 32,
    width: 32,
    borderRadius: 16,
  },
  tresPuntos: {
    fontSize: 18,
    fontFamily: "opensansbold",
    color: "#060B4D",
    marginBottom: 10,
  },
  // Estilos para el Modal
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
