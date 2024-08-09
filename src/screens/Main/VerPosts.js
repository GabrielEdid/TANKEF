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
  KeyboardAvoidingView,
  Platform,
  Alert,
  RefreshControl,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import MaskedView from "@react-native-masked-view/masked-view";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { LinearGradient } from "expo-linear-gradient";
import { ActivityIndicator } from "react-native-paper";
import { parseISO, formatDistanceToNow, set } from "date-fns";
import { es } from "date-fns/locale";
import { BlurView } from "expo-blur";
// Importaciones de Hooks y Componentes
import { UserContext } from "../../hooks/UserContext";
import { useInactivity } from "../../hooks/InactivityContext";
import Comment from "../../components/Comment";
import { APIDelete, APIPost, APIGet } from "../../API/APIService";
import { AntDesign, Ionicons } from "@expo/vector-icons";

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
    postUserID,
    updateLikes,
  } = route.params;
  // Estados de la pantalla
  const { resetTimeout } = useInactivity();
  const [imageSize, setImageSize] = useState({ width: 332, height: 200 });
  const [showFullText, setShowFullText] = useState(false);
  const [comentario, setComentario] = useState("");
  const inputRef = useRef(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyingToId, setReplyingToId] = useState(null);
  const [like, setLike] = useState(liked);
  const [likeCount, setLikeCount] = useState(reacciones);
  const [comments, setComments] = useState([]);
  const [commentCount, setCommentCount] = useState(comentarios);
  const [available, setAvailable] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isImageLoading, setIsImageLoading] = useState(true);
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
    console.log("Fetching comments for:", postId);
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
    resetTimeout();
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
      body: cleanText(comentario),
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

  // Funcion para publicar una respuesta a un comentario
  const postCommentReply = async () => {
    const url = `/api/v1/comments/${replyingToId}/reply`;
    const data = {
      body: comentario,
      user_id: user.userID,
    };

    const response = await APIPost(url, data);
    if (response.error) {
      // Manejar el error
      console.error(
        "Error al publicar respuesta a comentario:",
        response.error
      );
      Alert.alert(
        "Error",
        "No se pudo publicar el comentario. Intente nuevamente."
      );
    } else {
      console.log("Respuesta publicada:", response.data);
      setReplyingTo(null);
      setReplyingToId(null);
      setComentario("");
      //setCommentCount((prevCount) => prevCount + 1);
      fetchComments(page);
    }
  };

  // Esta función se llama cuando se presiona "Contestar" en un comentario
  const handleReply = (comment) => {
    setReplyingTo(
      titleCase(comment.user.name + " " + comment.user.first_last_name)
    );
    setReplyingToId(comment.id);
    inputRef.current.focus();
  };

  // Funcion para manejar las reacciones de los usuarios, se verifica si existe la reacción del usuario, si existe se elimina, si no se crea.
  const handleReaction = async () => {
    if (!available) return;
    setAvailable(false);
    resetTimeout();
    if (!like) {
      const urlGiveLike = "/api/v1/reactions";
      const data = {
        reactionable_type: "Post",
        reactionable_id: postId,
      };

      try {
        const response = await APIPost(urlGiveLike, data);
        if (!response.error) {
          console.log("Like dado");
          setAvailable(true);
          setLike(true);
          setLikeCount(likeCount + 1);
          updateLikes(likeCount + 1, true); // Esta línea es nueva
        }
      } catch (error) {
        console.error("Error al dar Like:", error);
        Alert.alert("Error", "No se pudo dar like. Intente nuevamente.");
        setAvailable(true);
      }
    } else {
      const urlGetReactions = `/api/v1/posts/${postId}/reactions`;

      try {
        const response = await APIGet(urlGetReactions);
        if (
          !response.error &&
          response.data &&
          Array.isArray(response.data.data)
        ) {
          const userReaction = response.data.data.find(
            (reaction) => reaction.user_id === user.userID
          );

          if (userReaction) {
            const urlRemoveLike = `/api/v1/reactions/${userReaction.id}`;
            const deleteResponse = await APIDelete(urlRemoveLike);
            if (!deleteResponse.error) {
              console.log("Like eliminado");
              setAvailable(true);
              setLike(false);
              setLikeCount(likeCount - 1);
              updateLikes(likeCount - 1, false); // Esta línea es nueva
            }
          }
        }
      } catch (error) {
        console.error("Error al quitar Like:", error);
        Alert.alert("Error", "No se pudo quitar like. Intente nuevamente.");
        setAvailable(true);
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

  const reportar = () => {
    Alert.alert(
      "Publicación Reportada",
      "Muchas gracias por tu reporte. Pronto revisaremos la publicación."
    ),
      resetTimeout(),
      setModalVisible(false);
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
    resetTimeout();
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

  // Función para obtener el tiempo transcurrido desde la publicación en una notación amigable
  const getTiempo = (time) => {
    const date = parseISO(time);
    const timeAgo = formatDistanceToNow(date, { addSuffix: true, locale: es });
    return timeAgo;
  };

  // Función para limpiar el texto de espacios en blanco
  const cleanText = (text) => {
    return text.replace(/\s+/g, " ").trim();
  };

  // Componente visual
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      {/* Titulo y Boton de Notificaciones */}
      <View
        style={{
          backgroundColor: "white",
          paddingTop: 40,
          paddingLeft: 20,
          paddingBottom: 20,
        }}
      >
        {/* <MaskedView
          style={{ flex: 1 }}
          maskElement={<Text style={styles.titulo}>tankef</Text>}
        >
          <LinearGradient
            colors={["#2FF690", "#21B6D5"]}
            start={{ x: 0.3, y: 0.3 }}
            end={{ x: 0.0, y: 0.0 }}
            style={StyleSheet.absoluteFill}
          />
        </MaskedView> */}
        <TouchableOpacity
          onPress={() => [navigation.goBack(), resetTimeout()]}
          style={{ top: 10 }}
        >
          <AntDesign name="arrowleft" size={30} color="#060B4D" />
        </TouchableOpacity>
      </View>
      <View style={[styles.linea, { marginTop: 0 }]} />

      {/* Scroll View con el contenido de la pantalla, contiene un refresh control */}
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
          resetTimeout();
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
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => [
              resetTimeout(),
              postUserID !== user.userID
                ? navigation.navigate("Inicio", {
                    screen: "VerPerfiles",
                    params: { userID: postUserID },
                  })
                : navigation.navigate("Perfil"),
            ]}
          >
            <Image source={foto} style={styles.fotoPerfil} />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => [
                resetTimeout(),
                postUserID !== user.userID
                  ? navigation.navigate("Inicio", {
                      screen: "VerPerfiles",
                      params: { userID: postUserID },
                    })
                  : navigation.navigate("Perfil"),
              ]}
            >
              <Text style={styles.textoNombre}>{nombre}</Text>
            </TouchableOpacity>
            <Text style={styles.textoTiempo}>{getTiempo(tiempo)}</Text>
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
              <View
                style={[
                  styles.imageContainer,
                  { backgroundColor: isImageLoading ? "#f0f0f0" : "black" },
                ]}
              >
                <Image
                  source={imageSource}
                  style={{
                    width: imageSize.width,
                    height: imageSize.height,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  imageStyle={{ borderRadius: 10 }}
                  onLoadStart={() => setIsImageLoading(true)}
                  onLoadEnd={() => setIsImageLoading(false)}
                  onLoad={onImageLoad}
                />
                {isLoading && (
                  <BlurView
                    intensity={50}
                    style={{
                      width: "100%",
                      height: "100%",
                      position: "absolute",
                    }}
                  />
                )}
              </View>
            )}
          </>
        )}

        {/* Cuador con boton de Like, numero de likes y numero de comments */}
        <View style={styles.interactionContainer}>
          {/* Vista sobre Likes */}
          <View style={{ flex: 1, flexDirection: "row" }}>
            <TouchableOpacity onPress={() => handleReaction()}>
              <AntDesign
                name="like2"
                size={25}
                color={like ? "#21B6D5" : "#5f5f61"}
              />
            </TouchableOpacity>
            <Text
              style={{
                marginLeft: 5,
                fontSize: 13,
                color: "#5f5f61",
                alignSelf: "center",
                fontFamily: "opensans",
              }}
            >
              {likeCount} likes
            </Text>
          </View>

          {/* Vista sobre comments */}
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons
              name="chatbubble-outline"
              size={25}
              color="#5f5f61"
              style={{ transform: [{ scaleX: -1 }] }}
            />
            <Text
              style={{
                marginLeft: 5,
                fontSize: 13,
                color: "#5f5f61",
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
                replies={comment.replies}
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
        {isFetchingMore && <ActivityIndicator size="small" color="#060B4D" />}

        {/* Modal y Tres puntos para eliminar o reportar publicación  */}
        <TouchableOpacity
          style={styles.opciones}
          onPress={() => [setModalVisible(true), resetTimeout()]}
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
                  onPress={() => [deletePost(), resetTimeout()]}
                >
                  <Text style={{ color: "red", fontFamily: "opensans" }}>
                    Eliminar Publicación
                  </Text>
                </TouchableOpacity>
              ) : null}
              {!personal ? (
                <TouchableOpacity
                  style={styles.buttonModal}
                  onPress={() => reportar()}
                >
                  <Text style={{ color: "red", fontFamily: "opensans" }}>
                    Reportar Publicación
                  </Text>
                </TouchableOpacity>
              ) : null}
              <TouchableOpacity
                style={{ marginTop: 10 }}
                onPress={() => setModalVisible(false)}
              >
                <Text style={{ fontFamily: "opensans", color: "#060B4D" }}>
                  Cancelar
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      </KeyboardAwareScrollView>
      {/* Input para escribir un comentario */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
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
            keyboardType="twitter"
            onChangeText={(text) => setComentario(text)}
            value={comentario}
            maxLength={250}
            onFocus={() => setIsFetchingMore(false)}
            onBlur={() => [
              setIsFetchingMore(true),
              setReplyingTo(null),
              setReplyingToId(null),
            ]}
          />
          <TouchableOpacity
            style={styles.sendIcon}
            onPress={() => [
              replyingTo && replyingToId ? postCommentReply() : postComment(),
              resetTimeout(),
            ]}
          >
            <Ionicons
              name="send"
              size={24}
              color={comentario ? "#060B4D" : "#D5D5D5"}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

// Estilos del Componente
const styles = StyleSheet.create({
  tituloContainer: {
    height: 90,
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
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 10,
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
