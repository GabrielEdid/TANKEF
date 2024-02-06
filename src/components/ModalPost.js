// Importaciones de React Native y React
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  ScrollView,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
} from "react-native";
import React, { useState, useContext, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
// Importaciones de Hooks y Componentes
import { APIPost } from "../API/APIService";
import { UserContext } from "../hooks/UserContext";
import {
  Entypo,
  MaterialIcons,
  MaterialCommunityIcons,
  FontAwesome,
} from "@expo/vector-icons";

const ModalPost = ({ isModalVisible, setIsModalVisible }) => {
  // Estados y Contexto
  const { user, setUser } = useContext(UserContext);
  const [text, setText] = useState("");
  const [modalQuien, setModalQuien] = useState(false);
  const [quien, setQuien] = useState("Mis Conexiones");
  const [image, setImage] = useState(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [enabled, setEnabled] = useState(true);

  // Mapa para cargar todas las imagenes
  const imageMap = {
    Blank: require("../../assets/images/blankAvatar.jpg"),
    MiRed: require("../../assets/images/MiRed.png"),
    // ... más imágenes
  };

  const postData = async () => {
    setEnabled(false);
    const url = "/api/v1/posts";

    const formData = new FormData();
    // Añadir la imagen al FormData
    formData.append("post[post_image]", {
      uri: image,
      type: "image/jpeg",
      name: "image.jpg",
    });
    formData.append("post[title]", "");
    formData.append("post[body]", text.trim());
    formData.append("post[user_id]", user.userID);
    formData.append(
      "post[scope_post]",
      quien === "Mis Conexiones" ? "friends" : "all_network"
    );

    const response = await APIPost(url, formData);
    if (response.error) {
      // Manejar el error
      console.error("Error al publicar:", response.error);
      Alert.alert("Error", "No se pudo publicar. Intente nuevamente.");
    } else {
      // Continuar en caso de éxito
      setText("");
      setImage(null);
      handleModalClose();
    }
    setEnabled(true);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.2,
    });

    if (!result.canceled) {
      const selectedImage = result.assets[0];
      setImage(selectedImage.uri);
      setImageSize({
        width: selectedImage.width,
        height: selectedImage.height,
      });
    }
  };

  const windowWidth = Dimensions.get("window").width;
  const scaledHeight = imageSize.height
    ? (imageSize.height / imageSize.width) * windowWidth
    : 0;

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  // Componente visual
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isModalVisible}
      onRequestClose={handleModalClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.modalView}>
          <View style={styles.headers}>
            <TouchableOpacity
              style={{
                flex: 1,
                justifyContent: "center",
              }}
              onPress={() => handleModalClose()}
            >
              <Entypo name="cross" size={35} color="#060B4D" />
            </TouchableOpacity>
            <Text
              style={{
                flex: 1,
                fontSize: 24,
                color: "#060B4D",
                fontFamily: "opensanssemibold",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Post
            </Text>
            <TouchableOpacity
              style={[
                { backgroundColor: text ? "#060B4D" : "#D5D5D5" },
                styles.botonCompartir,
              ]} // Adjusted for centering the text
              onPress={() => postData()}
              disabled={!enabled && !text}
            >
              <Text
                style={{
                  fontSize: 15,
                  color: text ? "white" : "grey",
                  textAlign: "center",
                  fontFamily: "opensans",
                }}
              >
                Compartir
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: "row",
              paddingTop: 20,
              marginBottom: 0,
              backgroundColor: "white",
            }}
          >
            <Image
              style={styles.fotoPerfilModal}
              source={user.avatar ? { uri: user.avatar } : imageMap["Blank"]}
            />
            <View>
              <Text style={styles.textoNombre}>
                {user.nombre +
                  " " +
                  user.apellidoPaterno +
                  " " +
                  user.apellidoMaterno}
              </Text>
              <Text
                style={[
                  styles.textoNombre,
                  { fontSize: 12, fontFamily: "opensans" },
                ]}
              >
                5 conexiones
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => setModalQuien(true)}
            style={{
              paddingVertical: 10,
              backgroundColor: "white",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <Text
              style={{
                color: "#060B4D",
                fontSize: 15,
                fontFamily: "opensans",
                marginLeft: 20,
              }}
            >
              Compartir a{" "}
            </Text>
            <View
              style={{
                flexDirection: "row",
                backgroundColor: "#2FF690",
                paddingVertical: 5,
                paddingHorizontal: 10,
                borderRadius: 5,
                marginLeft: 5,
                alignItems: "center",
              }}
            >
              {quien === "Toda la Red" ? (
                <Entypo name="globe" size={20} color="#060B4D" />
              ) : (
                <Image
                  style={{ width: 22, height: 18 }}
                  source={imageMap["MiRed"]}
                />
              )}
              <Text
                style={{
                  marginLeft: 5,
                  fontFamily: "opensansbold",
                  fontSize: 12,
                }}
              >
                {quien}
              </Text>
              <MaterialIcons
                name="keyboard-arrow-down"
                size={24}
                color="#060B4D"
                style={{ marginLeft: 0 }}
              />
            </View>
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder=" ¿De que quieres hablar?"
            placeholderTextColor="#9B9DB6"
            onChangeText={setText}
            multiline={true}
            value={text}
            maxLength={500}
          />
          {image && (
            <Image
              source={{ uri: image }}
              style={[
                styles.imagen,
                { width: windowWidth, height: scaledHeight },
              ]}
            />
          )}
          {!image ? (
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                alignSelf: "stretch",
                justifyContent: "center",
                marginTop: 3,
                paddingTop: 20,
                paddingBottom: 30,
                backgroundColor: "white",
              }}
              onPress={() => pickImage()}
            >
              <FontAwesome name="image" size={30} color="#060B4D" />
              <Text style={styles.textoImagen}>Agregar Imagen</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                alignSelf: "center",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
              onPress={() => setImage(null)}
            >
              <FontAwesome name="trash-o" size={30} color="#F95C5C" />
              <Text style={styles.textoImagen}>Eliminar Imagen</Text>
            </TouchableOpacity>
          )}
          {/* Modal de Quien puede ver el post */}
          <Modal animationType="slide" transparent={true} visible={modalQuien}>
            <TouchableOpacity
              style={styles.fullScreenButton}
              activeOpacity={1}
              onPress={() => setModalQuien(false)}
            >
              <View style={styles.modalQuienView}>
                <TouchableOpacity onPress={() => setModalQuien(false)}>
                  <View
                    style={{
                      height: 10,
                      backgroundColor: "#F0F0F0",
                      width: 150,
                      borderRadius: 10,
                      alignSelf: "center",
                    }}
                  ></View>
                </TouchableOpacity>
                {/* Boton Toda la Red */}
                <TouchableOpacity
                  style={styles.buttonModal}
                  onPress={() => [
                    setModalQuien(false),
                    setQuien("Toda la Red"),
                  ]}
                >
                  <Entypo name="globe" size={35} color="#060B4D" />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.texto}>Toda la Red</Text>
                    <Text style={styles.texto2}>
                      El post lo podrá ver toda la comunidad Tankef.
                    </Text>
                  </View>
                  {quien === "Toda la Red" ? (
                    <MaterialCommunityIcons
                      name="radiobox-marked"
                      size={32}
                      color="#060B4D"
                      style={{ marginTop: 12 }}
                    />
                  ) : (
                    <Entypo
                      name="circle"
                      size={28}
                      color="#060B4D"
                      style={{ marginTop: 13 }}
                    />
                  )}
                </TouchableOpacity>

                {/* Boton Mis Conexiones */}
                <TouchableOpacity
                  style={styles.buttonModal}
                  onPress={() => [
                    setModalQuien(false),
                    setQuien("Mis Conexiones"),
                  ]}
                >
                  <Image style={styles.miRed} source={imageMap["MiRed"]} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.texto}>Mis Conexiones</Text>
                    <Text style={styles.texto2}>
                      Solo tus conexiones verán el post.
                    </Text>
                  </View>
                  {quien === "Mis Conexiones" ? (
                    <MaterialCommunityIcons
                      name="radiobox-marked"
                      size={32}
                      color="#060B4D"
                      style={{ marginTop: 12 }}
                    />
                  ) : (
                    <Entypo
                      name="circle"
                      size={28}
                      color="#060B4D"
                      style={{ marginTop: 13 }}
                    />
                  )}
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Modal>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

// Estilos de la pantalla
const styles = StyleSheet.create({
  modalView: {
    marginTop: 60,
    flex: 1,
    backgroundColor: "white",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    backgroundColor: "#f5f5f5",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  headers: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 3,
    backgroundColor: "white",
  },
  botonCompartir: {
    paddingVertical: 7,
    padding: 10,
    borderRadius: 5,
    flex: 0.9,
    justifyContent: "center",
    alignItems: "center",
  },
  fotoPerfilModal: {
    width: 57,
    height: 57,
    borderRadius: 30,
    marginLeft: 20,
  },
  textoNombre: {
    fontSize: 18,
    color: "#060B4D",
    marginLeft: 10,
    fontFamily: "opensansbold",
  },
  input: {
    paddingHorizontal: 20,
    paddingTop: 20,
    marginTop: 3,
    fontSize: 18,
    flex: 1,
    width: "100%",
    height: "100%",
    textAlignVertical: "top",
    backgroundColor: "white",
    fontFamily: "opensans",
  },
  imagen: {
    marginTop: 5,
    marginBottom: 10,
    resizeMode: "contain",
  },
  textoImagen: {
    fontSize: 15,
    fontFamily: "opensans",
    color: "#060B4D",
    marginLeft: 10,
  },
  modalQuienView: {
    width: "100%",
    height: 250,
    backgroundColor: "white",
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    position: "absolute", // Posición absoluta
    bottom: 0, // En la parte inferior de la pantalla
    justifyContent: "flex-end", // Alinea los hijos al final
  },
  buttonModal: {
    flexDirection: "row",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginVertical: 5,
  },
  texto: {
    marginLeft: 15,
    marginTop: 2,
    fontSize: 24,
    fontFamily: "opensansbold",
    paddingTop: 1,
    color: "#060B4D",
  },
  texto2: {
    marginLeft: 15,
    marginTop: 2,
    fontSize: 15,
    paddingTop: 1,
    width: 250,
    fontFamily: "opensans",
    color: "#060B4D",
  },
  fullScreenButton: {
    height: "100%",
    width: "100%",
    position: "absolute",
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0)",
  },
  miRed: {
    width: 37,
    height: 30,
  },
});

export default ModalPost;
