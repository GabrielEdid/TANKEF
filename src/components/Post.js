// Importaciones de React Native y React
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput,
  Modal,
} from "react-native";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
// Importaciones de Hooks y Componentes
import { UserContext } from "../hooks/UserContext";
import { APIPost, APIDelete } from "../API/APIService";
import { AntDesign } from "@expo/vector-icons";
import ProgressBar from "./ProgressBar";

const Post = (props) => {
  // Estados del Componente
  const [imageSize, setImageSize] = useState({ width: 332, height: 200 });
  const [showFullText, setShowFullText] = useState(false);
  const [comentario, setComentario] = useState("");
  const [like, setLike] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const { user, setUser } = React.useContext(UserContext);

  // Mapa para cargar todas las imagenes que se necesiten
  const imageMap = {
    Blank: require("../../assets/images/blankAvatar.jpg"),
    // ... más imágenes
  };

  const deletePost = async (postId) => {
    const url = `https://market-web-pr477-x6cn34axca-uc.a.run.app/api/v1/posts/${postId}`;

    try {
      const response = await APIDelete(url);
      console.log("Post Deleted:", response.data);
      setIsVisible(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Para cuando se desee eliminar el Request
  const handleRemove = () => {
    deletePost(props.postId);
  };

  if (!isVisible) {
    return null;
  }

  // Calculo del porcentaje de la barra de progreso para un Credito
  const porcentaje =
    parseFloat(props.contribuidos) / parseFloat(props.solicitado);

  // Funcion para Obtener un tamaño adaptado para cada imagen
  const onImageLoad = (event) => {
    const { width, height } = event.nativeEvent.source;
    const screenWidth = Dimensions.get("window").width;
    const margin = 30; // 10px de margen a cada lado
    const newWidth = screenWidth - 40 - margin; // 40 es el margen total (20 a cada lado) + margen adicional
    const scaleFactor = width / newWidth;
    const imageHeight = height / scaleFactor;

    setImageSize({ width: newWidth, height: imageHeight });
  };

  // Funcion para mostrar el texto completo con Ver Más
  const toggleShowFullText = () => {
    setShowFullText(!showFullText);
  };

  // Asegurarse de que body es una cadena de texto
  const bodyText = props.body || "";

  // Determinar si se necesita el botón "Ver Más"
  const needsMoreButton = bodyText.length > 200 && !showFullText;

  // Texto a mostrar (cortado o completo)
  const displayedText = needsMoreButton
    ? `${bodyText.substring(0, 200)}...`
    : bodyText;

  // Componente visual
  return (
    // Cuadro del Post
    <View style={styles.Cuadro}>
      {/* Header del Post, Incluye Foto, Nombre y Tiempo, todos los Posts lo tienen */}
      <View style={styles.header}>
        <Image source={props.foto} style={styles.fotoPerfil} />
        <View style={styles.headerText}>
          <Text style={styles.textoNombre}>{props.nombre}</Text>
          <Text style={styles.textoTiempo}>Hace {props.tiempo}</Text>
        </View>
      </View>

      {/* Cuerpo del Post, Incluye Texto y posibilidad de Foto cuando el tipo de post es Compartir  */}
      {props.tipo === "compartir" && (
        <>
          <Text style={styles.textoBody}>{displayedText}</Text>
          {needsMoreButton && (
            <TouchableOpacity onPress={toggleShowFullText}>
              <Text style={styles.verMas}>Ver Más</Text>
            </TouchableOpacity>
          )}
          {/* Se evalua si se necesita el espacio para la imagen */}
          {props.imagen ? (
            <Image
              source={props.imagen}
              style={[styles.imagen, imageSize]}
              onLoad={onImageLoad} // Asegúrate de usar onLoad
            />
          ) : null}
        </>
      )}

      {/* Cuerpo del Post, Incluye Titulo y Texto del Credito, barra de complición y numeros  */}
      {props.tipo === "credito" && (
        <>
          <Text style={styles.titulo}>{props.titulo}</Text>
          <Text style={styles.textoBody}>{displayedText}</Text>
          {needsMoreButton && (
            <TouchableOpacity onPress={toggleShowFullText}>
              <Text style={styles.verMas}>Ver Más</Text>
            </TouchableOpacity>
          )}
          <Text style={styles.textSolicitado}>
            Credito Solicitado: ${props.solicitado}
          </Text>
          <ProgressBar progress={porcentaje} />
          <Text style={styles.textContribuidos}>
            Contribuidos: ${props.contribuidos}
          </Text>
          <TouchableOpacity style={styles.cuadroGradient}>
            <LinearGradient
              colors={["#2FF690", "#21B6D5"]}
              start={{ x: 1, y: 1 }} // Inicio del gradiente
              end={{ x: 0, y: 0 }} // Fin del gradiente
              style={styles.gradient}
            >
              <Text
                style={{ fontFamily: "conthrax", color: "white", fontSize: 17 }}
              >
                CONTRIBUIR
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </>
      )}

      {/* Cuerpo del Post, Incluye Titulo y Texto de la Inversion */}
      {props.tipo === "invertir" && (
        <>
          <Text style={styles.titulo}>¡Realice una Inversión!</Text>
          <Text style={styles.textoBody}>
            Acabo de hacer una inversión en Tankef con un rendimiento de{" "}
            <Text style={{ fontWeight: "bold" }}>{props.body}</Text>
          </Text>
        </>
      )}

      {/* Modal y Tres puntos para eliminar o reportar publicación  */}
      <TouchableOpacity
        style={styles.opciones}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.tresPuntos}>...</Text>
      </TouchableOpacity>
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
                onPress={() => handleRemove()}
              >
                <Text style={{ color: "red" }}>Eliminar Publicación</Text>
              </TouchableOpacity>
            ) : null}
            {!props.personal ? (
              <TouchableOpacity
                style={styles.buttonModal}
                onPress={() => console.log("Implementación de Reportar")}
              >
                <Text style={{ color: "red" }}>Reportar Publicación</Text>
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

      {/* Cuadro con boton de Like, Imagen de tu usuario y cuadro de comments, todos los Posts lo tienen  */}
      <View style={styles.linea}></View>
      <View style={styles.interactionContainer}>
        <TouchableOpacity style={styles.like} onPress={() => setLike(!like)}>
          <AntDesign
            name={like ? "heart" : "hearto"}
            size={27}
            color={like ? "red" : "#29364d"}
          />
        </TouchableOpacity>
        <Image
          source={user.avatar ? { uri: user.avatar } : imageMap["Blank"]}
          style={styles.tuPerfil}
        />
        <TextInput
          style={styles.input}
          placeholder="Añade un comentario..."
          onChangeText={setComentario}
          value={comentario}
          multiline={true}
          maxLength={80}
        />
        {/* Boton de Publicar y se evalua para aparecer cuando si hay un texto */}
        {comentario ? (
          <TouchableOpacity style={styles.publicarContainer}>
            <Text style={{ fontSize: 10, color: "#00A2FF", paddingTop: 10 }}>
              Publicar
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

// Estilos del Componente
const styles = StyleSheet.create({
  Cuadro: {
    borderWidth: 1.5,
    borderRadius: 15,
    borderColor: "#D5D5D5",
    width: "100%",
    marginBottom: 10,
    flex: 1,
    padding: 15,
    paddingBottom: 5,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  headerText: {
    justifyContent: "flex-start",
    marginLeft: 10,
  },
  fotoPerfil: {
    width: 57,
    height: 57,
    borderRadius: 50,
  },
  textoNombre: {
    fontSize: 14,
    color: "#29364d",
    fontWeight: "bold",
  },
  textoTiempo: {
    fontSize: 12,
    color: "grey",
  },
  titulo: {
    fontSize: 13,
    color: "#29364d",
    fontWeight: "bold",
    marginBottom: 5,
  },
  textoBody: {
    fontSize: 13,
    color: "#29364d",
  },
  textSolicitado: {
    fontSize: 13,
    marginBottom: -10,
    left: 5,
    color: "#29364d",
    marginTop: 10,
  },
  textContribuidos: {
    fontSize: 13,
    left: 5,
    top: -5,
    color: "#29364d",
    marginTop: 10,
  },
  cuadroGradient: {
    width: 317,
    height: 34,
    alignSelf: "center",
    borderRadius: 15,
    top: 5,
    marginBottom: 5,
  },
  gradient: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    width: 317,
    height: 34,
    borderRadius: 15,
  },
  verMas: {
    color: "#21B6D5",
    marginTop: 5,
  },
  imagen: {
    marginTop: 20,
    alignSelf: "center",
    borderRadius: 15,
    marginHorizontal: 10,
  },
  opciones: {
    position: "absolute",
    right: 20,
    marginTop: 5,
  },
  tresPuntos: {
    fontSize: 25,
    color: "#29364d",
  },
  linea: {
    backgroundColor: "#cccccc",
    height: 1,
    top: 10,
    width: "100%",
    alignSelf: "center",
  },
  interactionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 15,
  },
  tuPerfil: {
    width: 32,
    height: 32,
    borderRadius: 50,
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    paddingTop: 10,
    paddingRight: 7,
    paddingLeft: 3,
    fontSize: 10,
    color: "#29364d",
  },
  like: {
    padding: 10,
  },
  publicarContainer: {
    width: 40,
    height: 32,
    alignItems: "center",
    right: 5,
  },
  // Estilos para el Modal que aparece si se presionan los 3 puntos
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

export default Post;
