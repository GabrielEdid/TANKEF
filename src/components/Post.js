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
  Linking,
} from "react-native";
import { parseISO, formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
// Importaciones de Hooks y Componentes
import { UserContext } from "../hooks/UserContext";
import { APIPost, APIDelete } from "../API/APIService";
import { AntDesign } from "@expo/vector-icons";
import ProgressBar from "./Componentes Olvidados/ProgressBar";

const Post = (props) => {
  const navigation = useNavigation();
  // Estados del Componente
  const [imageSize, setImageSize] = useState({ width: 332, height: 200 });
  const [showFullText, setShowFullText] = useState(false);
  const [comentario, setComentario] = useState("");
  const [like, setLike] = useState(props["liked"]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const { user, setUser } = React.useContext(UserContext);

  // Mapa para cargar todas las imagenes que se necesiten
  const imageMap = {
    Blank: require("../../assets/images/blankAvatar.jpg"),
    Like: require("../../assets/images/Like.png"),
    Comment: require("../../assets/images/Comment.png"),
    // ... más imágenes
  };

  const postReaction = async () => {
    const url = "/api/v1/reactions";
    const data = {
      reactionable_type: "Post",
      reactionable_id: props.postId,
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
    const url = `/api/v1/posts/${props.postId}`;
    const response = await APIDelete(url);
    if (response.error) {
      console.log("Post no eliminado");
    } else {
      setIsVisible(false);
      console.error("Post eliminado" + response);
    }
  };

  if (!isVisible) {
    return null;
  }

  const getTiempo = () => {
    const timestamp = props.tiempo;
    const date = parseISO(timestamp);
    const timeAgo = formatDistanceToNow(date, { addSuffix: true, locale: es });
    return timeAgo;
  };

  const Link = (props) => (
    <Text style={{ fontFamily: "opensansbold", color: "#22BAD2", top: 4 }}>
      {props.children}
    </Text>
  );

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
    // Assuming it's a URL for a network image
    imageSource = { uri: props.imagen };
  } else {
    // Assuming it's a local image requiring require()
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

  // Calculo del porcentaje de la barra de progreso para un Credito
  const porcentaje =
    parseFloat(props.contribuidos) / parseFloat(props.solicitado);

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
          <Text style={styles.textoTiempo}>{getTiempo()}</Text>
        </View>
      </View>

      {/* Cuerpo del Post, Incluye Texto y posibilidad de Foto cuando el tipo de post es Compartir  */}
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

      {/* Cuerpo del Post, Incluye Titulo y Texto del Credito, barra de complición y numeros  
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
      )} */}

      {/* Cuerpo del Post, Incluye Titulo y Texto de la Inversion 
      {props.tipo === "invertir" && (
        <>
          <Text style={styles.titulo}>¡Realice una Inversión!</Text>
          <Text style={styles.textoBody}>
            Acabo de hacer una inversión en Tankef con un rendimiento de{" "}
            <Text style={{ fontWeight: "bold" }}>{props.body}</Text>
          </Text>
        </>
      )} */}

      {/* Cuadro con boton de Like, Imagen de tu usuario y cuadro de comments, todos los Posts lo tienen  */}
      <View style={styles.linea}></View>
      <View style={styles.interactionContainer}>
        <View style={{ flex: 1, flexDirection: "row" }}>
          <TouchableOpacity onPress={() => postReaction()}>
            <Image
              source={imageMap["Like"]}
              style={{
                width: 28,
                height: 24,
                tintColor: like ? "#21B6D5" : "#060B4D",
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ marginLeft: 10 }}
            onPress={() =>
              navigation.navigate("VerPosts", {
                key: props.key,
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
              })
            }
          >
            <Image
              source={imageMap["Comment"]}
              style={{
                width: 28,
                height: 23,
                tintColor: "#060B4D",
              }}
            />
          </TouchableOpacity>
        </View>
        {/* Boton de Publicar y se evalua para aparecer cuando si hay un texto */}
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("VerPosts", {
              key: props.key,
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
            })
          }
        >
          <Text
            style={{
              fontSize: 13,
              color: "#060B4D",
              marginRight: 23,
              fontFamily: "opensans",
            }}
          >
            {props.comentarios} comentarios
          </Text>
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
            {props.personal ? (
              <TouchableOpacity
                style={styles.buttonModal}
                onPress={() => deletePost()}
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
    </View>
  );
};

// Estilos del Componente
const styles = StyleSheet.create({
  Cuadro: {
    width: "100%",
    marginBottom: 10,
    flex: 1,
    paddingVertical: 15,
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
    top: 60,
    width: "100%",
    alignSelf: "center",
  },
  interactionContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 10,
    paddingLeft: 22,
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
