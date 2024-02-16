// Importaciones de React Native y React
import React, {
  useState,
  useContext,
  useEffect,
  useCallback,
  useRef,
} from "react";
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
  Alert,
  RefreshControl,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import MaskedView from "@react-native-masked-view/masked-view";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { LinearGradient } from "expo-linear-gradient";
import { ActivityIndicator } from "react-native-paper";
// Importaciones de Hooks y Componentes
import { UserContext } from "../../hooks/UserContext";
import Comment from "../../components/Comment";
import { APIDelete, APIPost, APIGet } from "../../API/APIService";
import { Feather, Ionicons } from "@expo/vector-icons";

const VerPosts = ({ route, navigation }) => {
  // Variables pasados de la pantalla anterior
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
    liked,
    remove,
  } = route.params;
  // Estados de la pantalla
  const [imageSize, setImageSize] = useState({ width: 332, height: 200 });
  const [showFullText, setShowFullText] = useState(false);
  const [comentario, setComentario] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [like, setLike] = useState(liked);
  const [likeCount, setLikeCount] = useState(reacciones);
  const [comments, setComments] = useState([]);
  const [commentCount, setCommentCount] = useState(comentarios);
  const [modalVisible, setModalVisible] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const { user, setUser } = useContext(UserContext); // Contexto del Usuario

  // Mapa para cargar todas las imagenes que se necesiten
  const imageMap = {
    Blank: require("../../../assets/images/blankAvatar.jpg"),
    Like: require("../../../assets/images/Like.png"),
    Comment: require("../../../assets/images/Comment.png"),
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

  // Funcion para obtener los comentarios de la publicación, maneja la paginación
  const fetchComments = async (currentPage) => {
    const url = `/api/v1/posts/${postId}/comments?page=${currentPage}`;
    console.log("Fetching comments from:", url);
    setIsFetchingMore(true);
    const response = await APIGet(url);
    if (response.error) {
      console.error("Error al obtener comentarios:", response.error);
      Alert.alert(
        "Error",
        "No se pudieron obtener los comentarios. Intente nuevamente."
      );
    } else {
      const newComments = response.data.data;
      // Ordena los comentarios por ID de manera descendente antes de establecer el estado
      const sortedComments = newComments.sort((a, b) => b.id - a.id);
      if (currentPage === 1) {
        setComments(sortedComments); // Si es la primera página, reemplaza los comentarios existentes
      } else {
        setComments((prevComments) => [...prevComments, ...sortedComments]); // Si no, concatena los nuevos comentarios
      }
    }
    setIsLoading(false);
    setIsFetchingMore(false);
  };

  // Funcion para manejar la paginacion de comments
  useEffect(() => {
    setIsLoading(true);
    fetchComments(1);
  }, []);

  // Efecto para manejar el refresco de la pantalla y comments
  useFocusEffect(
    useCallback(() => {
      setPage(1); // Asegura reiniciar la paginación
      fetchComments(1);
    }, [])
  );

  // Funcion para manejar el refresco de la pantalla
  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchComments(1).then(() => {
      setIsRefreshing(false);
      setPage(1); // Reinicia a la primera página
    });
  }, []);

  // Funcion para manejar la carga de más comments
  const handleLoadMore = () => {
    if (!isFetchingMore) {
      setIsFetchingMore(true);
      const nextPage = page + 1;
      setPage(nextPage);
      fetchComments(nextPage);
    }
  };

  // Funcion para determinar si el usuario ha llegado al final de la pantalla
  const isCloseToBottom = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }) => {
    const paddingToBottom = 20; // cuánto espacio en la parte inferior antes de cargar más
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  // Funcion para publicar un comentario
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
      setCommentCount((prevCount) => prevCount + 1);
      fetchComments(page);
    }
  };

  // Referencia para el input de comentarios (para enfocar el input al responder)
  const inputRef = useRef(null);

  // Esta función se llama cuando se presiona "Contestar" en un comentario
  const handleReply = (comment) => {
    setReplyingTo(
      titleCase(comment.user.name + " " + comment.user.first_last_name)
    );
    inputRef.current.focus();
  };

  // Funcion para manejar las reacciones de los usuarios, se verifica si existe la reacción del usuario, si existe se elimina, si no se crea.
  const handleReaction = async () => {
    if (!like) {
      // Intentar dar like
      const urlGiveLike = "/api/v1/reactions";
      const data = {
        reactionable_type: "Post",
        reactionable_id: postId,
      };

      try {
        const response = await APIPost(urlGiveLike, data);
        if (!response.error) {
          setLike(true); // Actualiza el estado para reflejar el like dado
          setLikeCount(likeCount + 1); // Incrementa el contador de likes
        }
      } catch (error) {
        console.error("Error al dar Like:", error);
        Alert.alert("Error", "No se pudo dar like. Intente nuevamente.");
      }
    } else {
      // Intentar quitar like
      const urlGetReactions = `/api/v1/posts/${postId}/reactions`;

      try {
        const response = await APIGet(urlGetReactions);
        if (
          !response.error &&
          response.data &&
          Array.isArray(response.data.data)
        ) {
          // Buscar la reacción del usuario en la lista de reacciones del post
          const userReaction = response.data.data.find(
            (reaction) => reaction.user_id === user.userID
          );

          if (userReaction) {
            const urlRemoveLike = `/api/v1/reactions/${userReaction.id}`;
            const deleteResponse = await APIDelete(urlRemoveLike);
            if (!deleteResponse.error) {
              setLike(false); // Actualiza el estado para reflejar la eliminación del like
              setLikeCount(likeCount - 1); // Decrementa el contador de likes
            }
          }
        }
      } catch (error) {
        console.error("Error al quitar Like:", error);
        Alert.alert("Error", "No se pudo quitar like. Intente nuevamente.");
      }
    }
  };

  // Funcion para eliminar un post
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

  // Si el post fue eliminado, no se muestra nada
  if (!isVisible) {
    return null;
  }

  // Para manejar las imagenes usadas en las publicaciones
  let imageSource;
  if (typeof imagen === "string") {
    imageSource = { uri: imagen };
  } else {
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

  // Funcion para mostrar el texto completo con boton de Ver Más
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
    <>
      {/* Titulo y Boton de Notificaciones */}
      <View style={styles.tituloContainer}>
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

      {/* Scroll View con el contenido de la pantalla, contiene un refresh control */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAwareScrollView
          resetScrollToCoords={{ x: 0, y: 0 }}
          contentContainerStyle={{ flexGrow: 1 }}
          scrollEnabled={true}
          extraScrollHeight={30}
          enableOnAndroid={true}
          style={styles.scrollV}
          keyboardShouldPersistTaps="handled"
          enableAutomaticScroll={true} // Asegura el scroll automático en iOS
          onScroll={({ nativeEvent }) => {
            if (isCloseToBottom(nativeEvent)) {
              handleLoadMore();
            }
          }}
          scrollEventThrottle={400}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              tintColor="#060B4D" // Usado en iOS
              colors={["#060B4D"]} // Usado en Android
            />
          }
        >
          {/* Header del Post, Incluye Foto, Nombre y Tiempo */}
          <View style={styles.header}>
            <Image source={foto} style={styles.fotoPerfil} />
            <View style={styles.headerText}>
              <Text style={styles.textoNombre}>{nombre}</Text>
              <Text style={styles.textoTiempo}>{tiempo}</Text>
            </View>
          </View>

          {/* Cuerpo del Post, Incluye Texto y posibilidad de Foto */}
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

          {/* Cuador con boton de Like, numero de likes y numero de comments */}
          <View style={styles.interactionContainer}>
            {/* Vista sobre Likes */}
            <View style={{ flex: 1, flexDirection: "row" }}>
              <TouchableOpacity onPress={() => handleReaction()}>
                <Image
                  source={imageMap["Like"]}
                  style={{
                    width: 28,
                    height: 24,
                    tintColor: like ? "#21B6D5" : "#060B4D",
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
                {likeCount} reacciones
              </Text>
            </View>

            {/* Vista sobre comments */}
            <View>
              <Text
                style={{
                  fontSize: 13,
                  color: "#060B4D",
                  marginRight: 23,
                  fontFamily: "opensans",
                }}
              >
                {commentCount} comentarios
              </Text>
            </View>
          </View>

          {/* Linea divisoria */}
          <View style={styles.linea} />

          {/* Contender de los cometarios de la publicación, se maneja si no hay comments */}
          <View style={styles.commentContainer}>
            {/* Se mapean los comentarios y se distribuyen en su componente */}
            {comments.length > 0 ? (
              comments.map((comment, index) => (
                <Comment
                  key={index}
                  commentId={comment.id}
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
                  count={commentCount}
                  setCount={setCommentCount}
                  onReply={() => handleReply(comment)}
                />
              ))
            ) : (
              // Si no hay comentarios, se muestra un mensaje
              <View
                style={{
                  marginTop: imagen ? 50 : 150,
                  alignSelf: "center",
                }}
              >
                <Text style={styles.textoMensaje}>
                  Esta publicación no tiene comentarios.{"\n"}¡Se el primero en
                  comentar!
                </Text>
              </View>
            )}
          </View>

          {/* Boton para cargar más comentarios, tambien se muestra un activity indicator */}
          {isFetchingMore ? (
            <ActivityIndicator size="small" color="#060B4D" />
          ) : (
            <TouchableOpacity
              onPress={handleLoadMore}
              style={styles.loadMoreButton}
            >
              <Text
                style={{
                  fontFamily: "opensans",
                  color: "#060B4D",
                  paddingLeft: 15,
                }}
              >
                {comments.length > 0 ? "Cargar más comentarios" : null}
              </Text>
            </TouchableOpacity>
          )}

          {/* Input para escribir un comentario */}
          <View style={styles.inputContainer}>
            <TextInput
              ref={inputRef}
              style={styles.input}
              placeholder={
                replyingTo
                  ? `Respondiendo a ${replyingTo}...`
                  : "Escribe un comentario..."
              }
              placeholderTextColor="#D5D5D5"
              multiline={true}
              onChangeText={(text) => setComentario(text)}
              value={comentario}
              maxLength={300}
              onFocus={() => setIsFetchingMore(false)}
              onBlur={() => [setIsFetchingMore(true), setReplyingTo(null)]}
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
          {/* Modal para eliminar o reportar publicación, se maneja si el post es propio o no */}
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
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
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
    marginTop: 5,
  },
  textoMensaje: {
    textAlign: "center",
    color: "grey",
    width: 300,
    fontSize: 15,
    fontFamily: "opensans",
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
  activityIndicatorContainer: {
    paddingVertical: 20,
  },
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
