// Importaciones de React Native y React
import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput,
  Modal,
  Linking,
  Alert,
} from "react-native";
import { parseISO, formatDistanceToNow, set } from "date-fns";
import { es } from "date-fns/locale";
import { useNavigation } from "@react-navigation/native";
// Importaciones de Hooks y Componentes
import { UserContext } from "../hooks/UserContext";
import { APIPost, APIDelete, APIGet } from "../API/APIService";
import { AntDesign, Ionicons } from "@expo/vector-icons";

/**
 * `Post` es un componente que representa una publicación individual dentro de la aplicación.
 * Soporta múltiples tipos de contenido como texto, imágenes, y enlaces. Este componente
 * permite interactuar con la publicación a través de acciones como "me gusta", comentar,
 * y, dependiendo del usuario, eliminar o reportar la publicación.
 *
 * Props:
 * - `postId`: Identificador único de la publicación.
 * - `liked`: Estado inicial del "me gusta" de la publicación por el usuario actual.
 * - `imagen`: URL de la imagen asociada a la publicación, si existe.
 * - `nombre`: Nombre del usuario que realiza la publicación.
 * - `foto`: Imagen de perfil del usuario que realiza la publicación.
 * - `tiempo`: Timestamp de la creación de la publicación.
 * - `body`: Contenido textual de la publicación.
 * - `tipo`: Tipo de publicación, por ejemplo, "compartir", "credito", "invertir".
 * - `comentarios`: Número de comentarios realizados en la publicación.
 * - `reacciones`: Número de reacciones recibidas por la publicación.
 * - `personal`: Indica si la publicación pertenece al usuario actual, permitiendo la opción de eliminar.
 *
 * Ejemplo de uso (o ver en Inicio.js o Perfil.js):
 * <Post
 *   postId="123"
 *   liked={false}
 *   imagen="https://example.com/image.jpg"
 *   nombre="John Doe"
 *   foto={require("../../assets/images/profile.jpg")}
 *   tiempo="2020-01-01T00:00:00.000Z"
 *   body="Este es un ejemplo de publicación en MiTankef."
 *   tipo="compartir"
 *   comentarios={10}
 *   reacciones={5}
 *   personal={true} // Indica que el usuario actual es el autor de la publicación
 * />
 */

const Post = (props) => {
  const navigation = useNavigation();
  // Estados del Componente
  const [imageSize, setImageSize] = useState({ width: 332, height: 200 });
  const [showFullText, setShowFullText] = useState(false);
  const [comentario, setComentario] = useState("");
  const [like, setLike] = useState(props["liked"]);
  const [likes, setLikes] = useState(props["reacciones"]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const { user, setUser } = useContext(UserContext); // Contexto de Usuario

  // Mapa para cargar todas las imagenes que se necesiten
  const imageMap = {
    Blank: require("../../assets/images/blankAvatar.jpg"),
    Like: require("../../assets/images/Like.png"),
    Comment: require("../../assets/images/Comment.png"),
    // ... más imágenes
  };

  // Función para manejar la reacción de "me gusta" en una publicación, la elimina o crea
  const handleReaction = async () => {
    if (!like) {
      // Intentar dar like
      const urlGiveLike = "/api/v1/reactions";
      const data = {
        reactionable_type: "Post",
        reactionable_id: props.postId,
      };

      try {
        const response = await APIPost(urlGiveLike, data);
        if (!response.error) {
          setLike(true); // Actualiza el estado para reflejar el like dado
          setLikes(likes + 1); // Actualiza la cantidad de likes
        }
      } catch (error) {
        console.error("Error al dar Like:", error);
        Alert.alert("Error", "No se pudo dar like. Intente nuevamente.");
      }
    } else {
      // Intentar quitar like
      const urlGetReactions = `/api/v1/posts/${props.postId}/reactions`;

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
            console.log("Intentando quitar like", userReaction.id);
            const urlRemoveLike = `/api/v1/reactions/${userReaction.id}`;
            const deleteResponse = await APIDelete(urlRemoveLike);
            if (!deleteResponse.error) {
              console.log("Like eliminado");
              setLike(false); // Actualiza el estado para reflejar la eliminación del like
              setLikes(likes - 1); // Actualiza la cantidad de likes
            }
          }
        }
      } catch (error) {
        console.error("Error al quitar Like:", error);
        Alert.alert("Error", "No se pudo quitar like. Intente nuevamente.");
      }
    }
  };

  // Función para eliminar una publicación
  const deletePost = async () => {
    const url = `/api/v1/posts/${props.postId}`;
    const response = await APIDelete(url);
    if (response.error) {
      console.log("Post no eliminado");
    } else {
      setIsVisible(false);
      console.error("Post eliminado" + response);
    }
  };

  // Si la publicación no es visible, no se renderiza
  if (!isVisible) {
    return null;
  }

  // Función para obtener el tiempo transcurrido desde la publicación en una notación amigable
  const getTiempo = () => {
    const timestamp = props.tiempo;
    const date = parseISO(timestamp);
    const timeAgo = formatDistanceToNow(date, { addSuffix: true, locale: es });
    return timeAgo;
  };

  // Función para navegar a la pantalla de ver publicación completa, se le pasan todos los props
  const verPost = () => {
    navigation.navigate("VerPosts", {
      postId: props.postId,
      tipo: props.tipo,
      nombre: props.nombre,
      tiempo: getTiempo(),
      foto: props.foto,
      body: parseTextForLinks(displayedText),
      imagen: props.imagen,
      comentarios: props.comentarios,
      reacciones: props.reacciones,
      personal: props.personal,
      liked: props.liked,
      remove: setIsVisible,
    });
  };

  // Componente para manejar los enlaces en el texto
  const Link = (props) => (
    <Text style={{ fontFamily: "opensansbold", color: "#22BAD2", top: 4 }}>
      {props.children}
    </Text>
  );

  // Función para parsear el texto y convertir los enlaces en componentes interactivos
  const parseTextForLinks = (text) => {
    const words = text.split(" ");
    const textComponents = words.map((word, index) => {
      if (word.toLowerCase().includes("http")) {
        return (
          <Text key={`word-${index}`}>
            <TouchableOpacity onPress={() => Linking.openURL(word)}>
              <Link>{word}</Link>
            </TouchableOpacity>{" "}
          </Text>
        );
      } else {
        return `${word} `;
      }
    });

    return textComponents;
  };

  // Para manejar las imagenes usadas en las publicaciones
  let imageSource;
  if (typeof props.imagen === "string") {
    imageSource = { uri: props.imagen };
  } else {
    imageSource = props.imagen;
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
      {/* Header del Post, Incluye Foto, Nombre y Tiempo */}
      <View style={styles.header}>
        <Image source={props.foto} style={styles.fotoPerfil} />
        <View style={styles.headerText}>
          <Text style={styles.textoNombre}>{props.nombre}</Text>
          <Text style={styles.textoTiempo}>{getTiempo()}</Text>
        </View>
      </View>

      {/* Cuerpo del Post, Incluye Texto y posibilidad de Foto */}
      {props.tipo === "compartir" && (
        <>
          <Text style={styles.textoBody}>
            {parseTextForLinks(displayedText)}
          </Text>
          {needsMoreButton && (
            <TouchableOpacity onPress={toggleShowFullText}>
              <Text style={styles.verMas}>Ver Más</Text>
            </TouchableOpacity>
          )}
          {/* Se evalua si se necesita el espacio para la imagen */}
          {props.imagen && (
            <View style={styles.imageContainer}>
              <Image
                source={imageSource}
                style={{ width: imageSize.width, height: imageSize.height }}
                onLoad={onImageLoad}
              />
            </View>
          )}
        </>
      )}

      {/* Cuadro con boton de Like, icono de comments y cantidad de comments */}
      <View style={styles.interactionContainer}>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            paddingHorizontal: 20,
          }}
        >
          <Text
            style={{
              flex: 1,
              fontSize: 12,
              color: like ? "#21B6D5" : "#5f5f61",
              fontFamily: "opensans",
            }}
          >
            {likes} likes
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: "#5f5f61",
              fontFamily: "opensans",
            }}
          >
            {props.comentarios} comentarios
          </Text>
        </View>
        <View style={styles.linea} />

        {/* Boton para dar like a la publicación */}
        <View
          style={{
            flexDirection: "row",
            paddingHorizontal: 20,
          }}
        >
          <View
            style={{
              flex: 1,
            }}
          >
            <TouchableOpacity
              style={{
                alignItems: "center",
                flexDirection: "row",
                width: 80,
              }}
              onPress={() => handleReaction()}
            >
              <AntDesign
                name="like2"
                size={30}
                color={like ? "#21B6D5" : "#5f5f61"}
              />
              <Text
                style={{
                  fontSize: 15,
                  color: like ? "#21B6D5" : "#5f5f61",
                  marginLeft: 5,
                  alignSelf: "center",
                  fontFamily: "opensans",
                }}
              >
                Like
              </Text>
            </TouchableOpacity>
          </View>

          {/* Para navegar a ver la publicación completa al presionar el icono de comments */}
          <TouchableOpacity
            onPress={() => verPost()}
            style={{ flexDirection: "row" }}
          >
            <View style={{ alignItems: "center" }}>
              <Ionicons
                name="chatbubble-outline"
                size={30}
                color="#5f5f61"
                style={{ transform: [{ scaleX: -1 }] }}
              />
            </View>
            <Text
              style={{
                fontSize: 15,
                color: "#5f5f61",
                fontFamily: "opensans",
                alignSelf: "center",
                marginLeft: 5,
              }}
            >
              Comentar
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.postLine} />

      {/* Modal y Tres puntos para eliminar o reportar publicación */}
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
                onPress={() => deletePost()}
              >
                <Text style={{ color: "red" }}>Eliminar Publicación</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.buttonModal}
                onPress={() => console.log("Implementación de Reportar")}
              >
                <Text style={{ color: "red" }}>Reportar Publicación</Text>
              </TouchableOpacity>
            )}
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

// Estilos del Componente
const styles = StyleSheet.create({
  Cuadro: {
    marginTop: 10,
    width: "100%",
    flex: 1,
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
    height: 2,
    marginTop: 7.5,
    marginBottom: 5,
    width: "100%",
    alignSelf: "center",
  },
  postLine: {
    backgroundColor: "#F2F2F2",
    height: 3,
    marginTop: 10,
    width: "100%",
    alignSelf: "center",
  },
  interactionContainer: {
    alignItems: "center",
    paddingTop: 10,
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

export default Post;
