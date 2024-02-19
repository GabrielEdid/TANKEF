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

/**
 * `Comment` es un componente que muestra un comentario individual, con la opción
 * de eliminarlo si el usuario tiene permisos. Soporta respuestas anidadas y ofrece
 * una interfaz para interactuar, como contestar o reportar comentarios.
 *
 * Props:
 * - `imagen`: Puede ser una URL o un recurso local para la imagen del usuario que hizo el comentario.
 * - `nombre`: Nombre del usuario que hizo el comentario.
 * - `body`: El contenido del comentario.
 * - `replies`: Un arreglo de respuestas al comentario.
 * - `commentId`: Identificador único del comentario.
 * - `setCount`: Función para actualizar el contador de comentarios tras una eliminación.
 * - `onReply`: Función invocada cuando se presiona el botón de contestar.
 * - `personal`: Booleano que indica si el comentario pertenece al usuario actual, permitiendo la opción de eliminar.
 *
 * Ejemplo de uso (o ver en VerPosts.js):
 * <Comment
 *   imagen="https://ruta/a/la/imagen.jpg"
 *   nombre="John Doe"
 *   body="Este es un comentario de ejemplo"
 *   replies={[{ user: { avatar: "https://ruta/a/avatar.jpg", full_name: "Jane Doe" }, body: "Una respuesta" }]}
 *   commentId="123"
 *   setCount={actualizarContador}
 *   onReply={manejadorRespuesta}
 *   personal={true}
 * />
 */

const Comment = (props) => {
  // Estados y Contexto
  const [isVisible, setIsVisible] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Mapa de imágenes para avatares
  const imageMap = {
    Blank: require("../../assets/images/blankAvatar.jpg"),
    // ... más imágenes
  };

  // Funcion para convertir la primera letra de cada palabra en mayúscula
  function titleCase(str) {
    return str
      .toLowerCase()
      .split(" ")
      .map(function (word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(" ");
  }

  // Para cuando se desee eliminar el Comment
  const deleteComment = async () => {
    setIsVisible(false);
    const url = `/api/v1/comments/${deleteId}`;

    try {
      const response = await APIDelete(url);
      console.log("Comment Deleted:", response.data);
      setIsVisible(false);
      setDeleteId(null);
      props.setCount(props.count - 1);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Si el comentario no es visible, no lo renderiza
  if (!isVisible) {
    return null;
  }

  // Determina la fuente de la imagen del usuario
  let imageSource;
  if (typeof props.imagen === "string") {
    // Assuming it's a URL for a network image
    imageSource = { uri: props.imagen };
  } else {
    // Assuming it's a local image requiring require()
    imageSource = props.imagen;
  }

  // Renderiza las respuestas al comentario
  const renderReplies = (replies) => {
    return replies.map((reply) => {
      // Verifica la fuene de la imagen del usuario
      let replyImageSource = reply.user.avatar
        ? { uri: reply.user.avatar }
        : imageMap["Blank"]; // Usa el avatar del usuario de la respuesta
      // Se renderizan los replies
      return (
        <View style={[styles.container, { marginLeft: 20 }]}>
          <View style={[styles.header]}>
            <Image source={replyImageSource} style={styles.icon} />
            <View style={styles.contentContainer}>
              <View style={styles.nameAndBodyContainer}>
                <Text style={styles.textoNombre}>
                  {titleCase(reply.user.full_name)}
                </Text>
                <Text style={styles.textoBody}>{reply.body}</Text>
              </View>
              <TouchableOpacity
                style={{ alignItems: "center", justifyContent: "center" }}
                onPress={() => [setModalVisible(true), setDeleteId(reply.id)]}
              >
                <Text style={styles.tresPuntos}>...</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    });
  };

  // Componente Visual
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={imageSource} style={styles.icon} />
        <View style={styles.contentContainer}>
          <View style={styles.nameAndBodyContainer}>
            <Text style={styles.textoNombre}>{props.nombre}</Text>
            <Text style={styles.textoBody}>{props.body}</Text>
          </View>
          <TouchableOpacity
            style={{ alignItems: "center", justifyContent: "center" }}
            onPress={() => [
              setModalVisible(true),
              setDeleteId(props.commentId),
            ]}
          >
            <Text style={styles.tresPuntos}>...</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ marginLeft: 50 }}>
        <TouchableOpacity onPress={() => props.onReply(props.nombre)}>
          <Text style={[styles.textoBody, { color: "grey", marginTop: 3 }]}>
            Contestar
          </Text>
        </TouchableOpacity>
      </View>
      {props.replies &&
        props.replies.length > 0 &&
        renderReplies(props.replies)}

      {/* Modal para mostrar si se presiónan los 3 puntos */}
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

// Estilos para el componente
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
