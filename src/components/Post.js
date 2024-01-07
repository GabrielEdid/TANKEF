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
} from "react-native";
// Importaciones de Hooks y Componentes
import { AntDesign } from "@expo/vector-icons";

const screenWidth = Dimensions.get("window").width;

const Post = (props) => {
  // Estados del Componente
  const [imageSize, setImageSize] = useState({ width: 332, height: 200 });
  const [showFullText, setShowFullText] = useState(false);
  const [comentario, setComentario] = useState("");
  const [like, setLike] = useState(false);

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
      {/* Header del Post, Incluye Foto, Nombre y Tiempo */}
      <View style={styles.header}>
        <Image source={props.foto} style={styles.fotoPerfil} />
        <View style={styles.headerText}>
          <Text style={styles.textoNombre}>{props.nombre}</Text>
          <Text style={styles.textoTiempo}>Hace {props.tiempo}</Text>
        </View>
      </View>
      {/* Cuerpo del Post, Incluye Texto y posibilidad de Foto */}
      <Text style={styles.textoBody}>{displayedText}</Text>
      {needsMoreButton && (
        <TouchableOpacity onPress={toggleShowFullText}>
          <Text style={styles.verMas}>Ver Más</Text>
        </TouchableOpacity>
      )}
      <Image
        source={props.imagen}
        style={[styles.imagen, imageSize]}
        onLoad={onImageLoad} // Asegúrate de usar onLoad
      />
      <View style={styles.linea}></View>
      <View style={styles.interactionContainer}>
        <TouchableOpacity style={styles.like} onPress={() => setLike(!like)}>
          <AntDesign
            name={like ? "heart" : "hearto"}
            size={27}
            color={like ? "red" : "#29364d"}
          />
        </TouchableOpacity>
        <Image source={props.perfil} style={styles.tuPerfil} />
        <TextInput
          style={styles.input}
          placeholder="Añade un comentario..."
          onChangeText={setComentario}
          value={comentario}
          multiline={true}
          maxLength={80}
        />
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
    width: 352,
    marginLeft: 20,
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
  textoBody: {
    fontSize: 13,
    color: "#29364d",
  },
  verMas: {
    color: "#00A2FF",
    marginTop: 5,
  },
  imagen: {
    marginTop: 20,
    alignSelf: "center",
    borderRadius: 15,
    marginHorizontal: 10,
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
    paddingLeft: 10,
    fontSize: 10,
    color: "#29364d",
  },
  like: {
    padding: 10,
  },
});

export default Post;
