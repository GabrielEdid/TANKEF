// Importaciones de React Native y React
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useContext, useState } from "react";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
// Importaciones de Hooks y Componentes
import { UserContext } from "../../hooks/UserContext";
import { EvilIcons } from "@expo/vector-icons";

const Crear = ({ navigation }) => {
  // Estados y Contexto
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const { user, setUser } = useContext(UserContext);
  const textLimit = 500;

  const postData = async () => {
    const url = "https://market-web-pr477-x6cn34axca-uc.a.run.app/api/v1/posts";
    const data = {
      title: "",
      body: text,
      user_id: user.userID,
      post_image: image,
    };

    try {
      const response = await axios.post(url, data);
      console.log("Response:", response.data);
      navigation.navigate("Perfil");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 3,
    });

    // Verifica si la selección fue cancelada
    if (!result.canceled) {
      // Accede a la primera imagen seleccionada del array 'assets'
      const selectedImage = result.assets[0];
      setImage(selectedImage.uri);
    }
  };

  // Componente visual
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.background}>
        {/*Titulo*/}
        <View style={styles.tituloContainer}>
          <Text style={styles.titulo}>TANKEF</Text>
        </View>
        {/* Opciones para Crear */}
        <Text style={styles.texto}>¡Realiza un Movimiento!</Text>
        {/* Boton de Invertir */}
        <View style={styles.containerCuadros}>
          <TouchableOpacity style={styles.cuadros}>
            <LinearGradient
              colors={["#2FF690", "#21B6D5"]}
              start={{ x: 0.2, y: 0.2 }} // Inicio del gradiente
              end={{ x: 1.5, y: 1.5 }} // Fin del gradiente
              style={styles.gradient}
            >
              <Image
                style={{
                  height: 70,
                  width: 90,
                  tintColor: "white",
                  marginBottom: 10,
                }}
                source={require("../../../assets/images/Invertir.png")}
              />
              <Text style={styles.textoAcciones}>INVERTIR</Text>
            </LinearGradient>
          </TouchableOpacity>
          {/* Boton de Crédito */}
          <TouchableOpacity style={[styles.cuadros, { marginRight: 0 }]}>
            <LinearGradient
              colors={["#2FF690", "#21B6D5"]}
              start={{ x: -0.7, y: -0.7 }} // Inicio del gradiente
              end={{ x: 0.9, y: 0.9 }} // Fin del gradiente
              style={styles.gradient}
            >
              <Image
                style={{
                  height: 70,
                  width: 110,
                  tintColor: "white",
                  marginBottom: 10,
                }}
                source={require("../../../assets/images/Credito.png")}
              />
              <Text style={styles.textoAcciones}>CRÉDITO</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        {/* Crear una publicación */}
        <Text style={[styles.texto, { top: 25 }]}>
          Comparte algo con tu red
        </Text>
        {/* Input de texto */}
        <View style={{ flex: 1, justifyContent: "space-between" }}>
          <View style={styles.container}>
            <TextInput
              style={styles.input}
              placeholder="En que estas pensando..."
              onChangeText={setText}
              value={text}
              maxLength={textLimit}
              multiline={true}
            />
            {/* Linea delgada para dividir el TextInput del boton para la imagen */}
            <View style={styles.linea}></View>
            {/* Contenedor horizontal para los elementos bajo la linea */}
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-between",
              }}
            >
              {/* Boton para la imagen e Imagen, contender horizontal para ellos dos, los mantiene juntos y no separados pro el space-between de arriba */}
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                  style={styles.selectImagen}
                  onPress={pickImage}
                >
                  <EvilIcons
                    name="image"
                    size={60}
                    color="#cccccc"
                    style={{ right: 5 }}
                  />
                </TouchableOpacity>
                {image && (
                  <Image source={{ uri: image }} style={styles.imagen} />
                )}
              </View>
              {/* Contador de Caracteres Restantes */}
              <Text
                style={{
                  right: 10,
                  color: "#cccccc",
                }}
              >
                {textLimit - text.length} caracteres restantes
              </Text>
            </View>
          </View>
          {/* Boton para publicar */}
          <TouchableOpacity
            style={styles.boton}
            onPress={() => postData()}
            disabled={!text}
          >
            {/* Se evalua si hay texto y activa el boton con gradiente */}
            {text ? (
              <LinearGradient
                colors={["#2FF690", "#21B6D5"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.botonGradient}
              >
                <Text style={styles.textoBoton}>PUBLICAR</Text>
              </LinearGradient>
            ) : (
              <Text style={[styles.textoBoton, { color: "grey" }]}>
                PUBLICAR
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

// Estilos de la pantalla
const styles = StyleSheet.create({
  tituloContainer: {
    height: 105,
    backgroundColor: "white",
  },
  background: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
  },
  titulo: {
    fontFamily: "conthrax",
    fontSize: 27,
    color: "#29364d",
    marginTop: 70,
  },
  texto: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#29364d",
    top: 10,
  },
  containerCuadros: {
    flexDirection: "row",
    top: 20,
  },
  cuadros: {
    width: "100%",
    flex: 1,
    height: 130,
    marginRight: 10,
    borderRadius: 15,
  },
  gradient: {
    justifyContent: "center",
    alignItems: "center",
    flexGrow: 1,
    height: 130,
    width: "100%",
    borderRadius: 15,
  },
  textoAcciones: {
    fontFamily: "conthrax",
    color: "white",
    textAlign: "center",
    fontSize: 21,
  },
  container: {
    marginTop: 35,
    padding: 10,
    paddingBottom: 0,
    flex: 1,
    width: "100%",
    borderColor: "#cccccc",
    borderWidth: 1,
    borderRadius: 15,
  },
  input: {
    flex: 0.98,
    width: "100%",
    color: "#29364d",
    fontSize: 18,
  },
  linea: {
    backgroundColor: "#cccccc",
    height: 1,
    marginTop: 10,
    marginBottom: 5,
    width: "100%",
    alignSelf: "center",
  },
  botonGradient: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    borderRadius: 15,
  },
  boton: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    backgroundColor: "#cccccc",
    borderRadius: 15,
    marginBottom: 20,
    marginTop: 15,
  },
  textoBoton: {
    textAlign: "center",
    fontSize: 20,
    fontFamily: "conthrax",
    color: "white",
  },
  selectImagen: {
    left: 10,
    alignSelf: "center",
  },
  imagen: {
    width: 47,
    height: 35,
    borderRadius: 10,
    left: 10,
    top: 7,
  },
});

export default Crear;
