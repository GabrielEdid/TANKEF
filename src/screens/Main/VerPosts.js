// Importaciones de React Native y React
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import MaskedView from "@react-native-masked-view/masked-view";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { LinearGradient } from "expo-linear-gradient";
// Importaciones de Hooks y Componentes
import { UserContext } from "../../hooks/UserContext";
import Comment from "../../components/Comment";
import { APIDelete, APIPost, APIGet } from "../../API/APIService";
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";

const VerPosts = ({ route, navigation }) => {
  const {
    postId,
    tipo,
    nombre,
    tiempo,
    foto,
    body,
    imagen,
    comentarios,
    reacciones,
    personal,
    remove,
  } = route.params;
  // Estados del Componente
  const [imageSize, setImageSize] = useState({ width: 332, height: 200 });
  const [showFullText, setShowFullText] = useState(false);
  const [comentario, setComentario] = useState("");
  const [like, setLike] = useState(false);
  const [comments, setComments] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const { user, setUser } = React.useContext(UserContext);

  // Mapa para cargar todas las imagenes que se necesiten
  const imageMap = {
    Blank: require("../../../assets/images/blankAvatar.jpg"),
    Like: require("../../../assets/images/Like.png"),
    Comment: require("../../../assets/images/Comment.png"),
    Natasha: require("../../../assets/images/Fotos_Personas/Natahsa.png"),
    Quill: require("../../../assets/images/Fotos_Personas/Quill.png"),
    Clint: require("../../../assets/images/Fotos_Personas/Clint.png"),
    Antonio: require("../../../assets/images/Fotos_Personas/Antonio.png"),
    Steve: require("../../../assets/images/Fotos_Personas/Steve.png"),
    // ... más imágenes
  };

  function titleCase(str) {
    return str
      .toLowerCase()
      .split(" ")
      .map(function (word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(" ");
  }

  const fetchComments = async () => {
    const url = `/api/v1/posts/${postId}/comments`;
    const response = await APIGet(url);
    if (response.error) {
      // Manejar el error
      console.error("Error al obtener comentarios:", response.error);
      Alert.alert(
        "Error",
        "No se pudieron obtener los comentarios. Intente nuevamente."
      );
    } else {
      const sortedComments = response.data.data.sort((a, b) => b.id - a.id); // Ordena los posts de más nuevo a más viejo
      setComments(sortedComments); // Guardar los datos de las publicaciones en el estado
      console.log("Comments:", sortedComments);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchComments();
    }, [])
  );

  const postComment = async () => {
    const url = "/api/v1/comments";
    const data = {
      body: comentario,
      commentable_type: "Post",
      commentable_id: postId,
      user_id: user.userID,
    };

    const response = await APIPost(url, data);
    if (response.error) {
      // Manejar el error
      console.error("Error al publicar comentario:", response.error);
      Alert.alert(
        "Error",
        "No se pudo publicar el comentario. Intente nuevamente."
      );
    } else {
      setComentario("");
      fetchComments();
    }
  };

  const postReaction = async () => {
    const url = "/api/v1/reactions";
    const data = {
      reactionable_type: "Post",
      reactionable_id: postId,
    };

    const response = await APIPost(url, data);
    if (response.error) {
      // Manejar el error
      console.error("Error al dar Like:", response.error);
      Alert.alert("Error", "No se pudo dar like. Intente nuevamente.");
    } else {
      setLike(!like);
    }
  };

  const deletePost = async () => {
    const url = `/api/v1/posts/${postId}`;
    const response = await APIDelete(url);
    if (response.error) {
      console.log("Post no eliminado");
    } else {
      setIsVisible(false);
      console.error("Post eliminado" + response);
      remove(true);
      navigation.goBack();
    }
  };

  if (!isVisible) {
    return null;
  }

  // Para manejar las imagenes usadas en las publicaciones
  let imageSource;
  if (typeof imagen === "string") {
    // Assuming it's a URL for a network image
    imageSource = { uri: imagen };
  } else {
    // Assuming it's a local image requiring require()
    imageSource = imagen;
  }

  // Funcion para Obtener un tamaño adaptado para cada imagen
  const onImageLoad = (event) => {
    const { width, height } = event.nativeEvent.source;
    const screenWidth = Dimensions.get("window").width;
    let newWidth, newHeight;

    if (width > height) {
      // Imagen horizontal
      newWidth = screenWidth;
      newHeight = height / (width / screenWidth);
    } else {
      // Imagen vertical
      newHeight = 350; // Altura fija para imágenes verticales
      newWidth = width / (height / newHeight);
    }

    setImageSize({ width: newWidth, height: newHeight });
  };

  // Calculo del porcentaje de la barra de progreso para un Credito
  //const porcentaje =
  //parseFloat(props.contribuidos) / parseFloat(props.solicitado);

  // Funcion para mostrar el texto completo con Ver Más
  const toggleShowFullText = () => {
    setShowFullText(!showFullText);
  };

  // Asegurarse de que body es una cadena de texto
  const bodyText = body || "";

  // Determinar si se necesita el botón "Ver Más"
  const needsMoreButton = bodyText.length > 200 && !showFullText;

  // Texto a mostrar (cortado o completo)
  const displayedText = needsMoreButton
    ? `${bodyText.substring(0, 200)}...`
    : bodyText;

  // Componente visual
  return (
    // Cuadro del Post
    <>
      <View style={styles.tituloContainer}>
        {/* Titulo */}
        <MaskedView
          style={{ flex: 1 }}
          maskElement={<Text style={styles.titulo}>tankef</Text>}
        >
          <LinearGradient
            colors={["#2FF690", "#21B6D5"]}
            start={{ x: 0.4, y: 0.4 }}
            end={{ x: 0, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </MaskedView>
        <TouchableOpacity>
          <Feather
            name="bell"
            size={25}
            color="#060B4D"
            style={{ marginTop: 50 }}
          />
        </TouchableOpacity>
      </View>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAwareScrollView
          resetScrollToCoords={{ x: 0, y: 0 }}
          contentContainerStyle={{ flexGrow: 1 }}
          scrollEnabled={true}
          extraScrollHeight={100}
          enableOnAndroid={true}
          style={styles.scrollV}
        >
          {/* Header del Post, Incluye Foto, Nombre y Tiempo, todos los Posts lo tienen */}
          <View style={styles.header}>
            <Image source={foto} style={styles.fotoPerfil} />
            <View style={styles.headerText}>
              <Text style={styles.textoNombre}>{nombre}</Text>
              <Text style={styles.textoTiempo}>{tiempo}</Text>
            </View>
          </View>

          {/* Cuerpo del Post, Incluye Texto y posibilidad de Foto cuando el tipo de post es Compartir  */}
          {tipo === "compartir" && (
            <>
              <Text style={styles.textoBody}>{displayedText}</Text>
              {needsMoreButton && (
                <TouchableOpacity onPress={toggleShowFullText}>
                  <Text style={styles.verMas}>Ver Más</Text>
                </TouchableOpacity>
              )}
              {/* Se evalua si se necesita el espacio para la imagen */}
              {imagen && (
                <View style={styles.imageContainer}>
                  <Image
                    source={imageSource}
                    style={{
                      width: imageSize.width,
                      height: imageSize.height,
                    }}
                    onLoad={onImageLoad}
                  />
                </View>
              )}
            </>
          )}

          {/* Cuerpo del Post, Incluye Titulo y Texto del Credito, barra de complición y numeros  
      {tipo === "credito" && (
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
      )} */}

          {/* Cuerpo del Post, Incluye Titulo y Texto de la Inversion 
      {tipo === "invertir" && (
        <>
          <Text style={styles.titulo}>¡Realice una Inversión!</Text>
          <Text style={styles.textoBody}>
            Acabo de hacer una inversión en Tankef con un rendimiento de{" "}
            <Text style={{ fontWeight: "bold" }}>{props.body}</Text>
          </Text>
        </>
      )} */}

          {/* Cuadro con boton de Like, Imagen de tu usuario y cuadro de comments, todos los Posts lo tienen  */}
          <View style={styles.interactionContainer}>
            <View style={{ flex: 1, flexDirection: "row" }}>
              <TouchableOpacity onPress={() => postReaction()}>
                <Image
                  source={imageMap["Like"]}
                  style={{
                    width: 28,
                    height: 24,
                    tintColor: !like ? "#060B4D" : "#21B6D5",
                  }}
                />
              </TouchableOpacity>
              <Text
                style={{
                  fontSize: 13,
                  color: "#060B4D",
                  marginLeft: 10,
                  alignSelf: "center",
                  fontFamily: "opensans",
                }}
              >
                {reacciones} reacciones
              </Text>
            </View>
            {/* Boton de Publicar y se evalua para aparecer cuando si hay un texto */}
            <TouchableOpacity>
              <Text
                style={{
                  fontSize: 13,
                  color: "#060B4D",
                  marginRight: 23,
                  fontFamily: "opensans",
                }}
              >
                {comments.length} comentarios
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.linea} />
          <View style={styles.commentContainer}>
            {comments.map((comment, index) => (
              <Comment
                key={index}
                nombre={
                  titleCase(comment.user.name) +
                  " " +
                  titleCase(comment.user.first_last_name) +
                  " " +
                  titleCase(comment.user.second_last_name)
                }
                body={comment.body}
                imagen={comment.user.avatar}
                personal={comment.user.id === user.userID}
              />
            ))}
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Escribe un comentario..."
              placeholderTextColor="#D5D5D5"
              multiline={true}
              onChangeText={(text) => setComentario(text)}
              value={comentario}
              maxLength={300}
            />
            <TouchableOpacity
              style={styles.sendIcon}
              onPress={() => postComment()}
            >
              <Ionicons
                name="send"
                size={24}
                color={comentario ? "#060B4D" : "#D5D5D5"}
              />
            </TouchableOpacity>
          </View>
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
                {personal ? (
                  <TouchableOpacity
                    style={styles.buttonModal}
                    onPress={() => deletePost()}
                  >
                    <Text style={{ color: "red" }}>Eliminar Publicación</Text>
                  </TouchableOpacity>
                ) : null}
                {!personal ? (
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
        </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>
    </>
  );
};

// Estilos del Componente
const styles = StyleSheet.create({
  tituloContainer: {
    paddingHorizontal: 20,
    flexDirection: "row",
    backgroundColor: "white",
    paddingBottom: 10,
  },
  titulo: {
    fontFamily: "montserrat",
    letterSpacing: -4,
    fontSize: 35,
    marginTop: 40,
  },
  scrollV: {
    marginTop: 3,
    width: "100%",
    height: "100%",
    flex: 1,
    paddingTop: 15,
    backgroundColor: "white",
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
    width: 45,
    height: 45,
    marginLeft: 20,
    borderRadius: 203,
  },
  textoNombre: {
    fontSize: 17,
    fontFamily: "opensansbold",
    color: "#060B4D",
    fontWeight: "bold",
  },
  textoTiempo: {
    fontSize: 12,
    fontFamily: "opensans",
    color: "#060B4D",
  },
  textoBody: {
    marginHorizontal: 20,
    fontFamily: "opensans",
    fontSize: 14,
    color: "#060B4D",
  },
  verMas: {
    color: "#21B6D5",
    fontFamily: "opensans",
    marginLeft: 20,
    fontSize: 15,
  },
  imageContainer: {
    marginTop: 10,
    backgroundColor: "black", // Fondo negro para el espacio sobrante
    alignItems: "center", // Centrar la imagen horizontalmente
    justifyContent: "center", // Centrar la imagen verticalmente
    width: "100%", // Ancho total del contenedor
  },
  imagen: {
    alignSelf: "center",
    resizeMode: "contain",
  },
  opciones: {
    position: "absolute",
    right: 10,
    marginTop: 5,
  },
  tresPuntos: {
    fontSize: 20,
    marginTop: 10,
    fontFamily: "opensansbold",
    color: "#060B4D",
    transform: [{ rotate: "90deg" }],
  },
  linea: {
    backgroundColor: "#F2F2F2",
    height: 3,
    width: "100%",
    alignSelf: "center",
    marginTop: 10,
  },
  interactionContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 10,
    paddingLeft: 22,
  },
  commentContainer: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 10,
    marginBottom: 20,
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 12,
    borderRadius: 20,
    borderColor: "#D5D5D5",
    borderWidth: 1.5,
  },
  input: {
    flex: 1,
    fontFamily: "opensans",
    color: "#060B4D",
    fontSize: 15,
    paddingRight: 40,
  },
  sendIcon: {
    position: "absolute",
    right: 20,
    bottom: 10,
  },
  /*  ESTILOS DE LOS OTROS TIPOS DE POST
  textSolicitado: {
    fontSize: 13,
    marginBottom: -10,
    left: 5,
    color: "#060B4D",
    marginTop: 10,
  },
  textContribuidos: {
    fontSize: 13,
    left: 5,
    top: -5,
    color: "#060B4D",
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
  },*/
  // Estilos para el Modal que aparece si se presionan los 3 puntos
  fullScreenButton: {
    position: "absolute",
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

export default VerPosts;
