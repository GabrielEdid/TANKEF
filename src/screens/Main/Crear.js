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
import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
// Importaciones de Hooks y Componentes
import { EvilIcons } from "@expo/vector-icons";

const Crear = () => {
  // Estados y Contexto
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const textLimit = 500;

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
        {/* Titulo Superior */}
        <Text style={styles.titulo}>TANKEF</Text>
        {/* Opciones para Crear */}
        <Text style={styles.texto}>¡Realiza un Movimiento!</Text>
        {/* Boton de Invertir */}
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
        <TouchableOpacity style={[styles.cuadros, { left: 183 }]}>
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
        {/* Crear una publicación */}
        <Text style={[styles.texto, { marginTop: 300 }]}>
          Comparte algo con tu red
        </Text>
        {/* Input de texto */}
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
          {/* Contador de Caracteres Restantes */}
          <Text
            style={{
              left: 163,
              marginTop: 15,
              marginBottom: 5,
              color: "#cccccc",
            }}
          >
            {textLimit - text.length} caracteres restantes
          </Text>
          {/* Boton para la imagen */}
          <TouchableOpacity style={styles.selectImagen} onPress={pickImage}>
            <EvilIcons
              name="image"
              size={60}
              color="#cccccc"
              style={{ right: 5 }}
            />
          </TouchableOpacity>
          {image && <Image source={{ uri: image }} style={styles.imagen} />}
        </View>
        {/* Boton para publicar */}
        <TouchableOpacity
          style={styles.boton}
          onPress={() => {}}
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
            <Text style={[styles.textoBoton, { color: "grey" }]}>PUBLICAR</Text>
          )}
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

// Estilos de la pantalla
const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "white",
  },
  titulo: {
    fontFamily: "conthrax",
    fontSize: 27,
    color: "#29364d",
    marginTop: 70,
    marginLeft: 20,
    position: "absolute",
  },
  texto: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#29364d",
    marginTop: 115,
    marginLeft: 20,
    position: "absolute",
  },
  cuadros: {
    width: 170,
    height: 130,
    borderRadius: 15,
    marginTop: 155,
    marginLeft: 20,
    position: "absolute",
  },
  gradient: {
    justifyContent: "center",
    alignItems: "center",
    width: 170,
    height: 130,
    alignSelf: "center",
    borderRadius: 15,
  },
  textoAcciones: {
    fontFamily: "conthrax",
    color: "white",
    textAlign: "center",
    fontSize: 21,
  },
  container: {
    padding: 10,
    paddingBottom: 20,
    height: 340,
    width: 353,
    borderColor: "#cccccc",
    borderWidth: 1,
    left: 20,
    marginTop: 350,
    borderRadius: 15,
  },
  input: {
    flex: 1,
    width: 330,
    color: "#29364d",
    fontSize: 18,
  },
  linea: {
    backgroundColor: "#cccccc",
    position: "absolute",
    top: 290,
    height: 1,
    width: 320,
    alignSelf: "center",
  },
  boton: {
    marginTop: 705,
    width: 352,
    height: 50,
    alignSelf: "center",
    justifyContent: "center",
    backgroundColor: "#cccccc",
    borderRadius: 15,
    position: "absolute",
  },
  botonGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
  },
  textoBoton: {
    textAlign: "center",
    fontSize: 20,
    fontFamily: "conthrax",
    color: "white",
  },
  selectImagen: {
    width: 100,
    height: 100,
    position: "absolute",
    marginTop: 290,
    left: 10,
    alignSelf: "center",
  },
  imagen: {
    width: 47,
    height: 35,
    position: "absolute",
    borderRadius: 10,
    top: 296,
    left: 65,
  },
});

export default Crear;
