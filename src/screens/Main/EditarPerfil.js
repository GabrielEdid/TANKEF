// Importaciones de React Native y React
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import { v4 as uuidv4 } from "uuid";
// Importaciones de Componentes y Hooks
import { APIPut } from "../../API/APIService";
import { useInactivity } from "../../hooks/InactivityContext";
import { UserContext } from "../../hooks/UserContext";
import { Feather, FontAwesome } from "@expo/vector-icons";

const EditarPerfil = ({ navigation }) => {
  // Estados locales
  const { resetTimeout } = useInactivity(); // Hook para el tiempo de inactividad
  const { user, setUser } = useContext(UserContext); //Contexo del Usuario
  const [imageUri, setImageUri] = useState(user.avatar);
  const [imageKey, setImageKey] = useState(Date.now());
  const [isLoading, setIsLoading] = useState(false);

  // Mapa para cargar todas las imagenes
  const imageMap = {
    Blank: require("../../../assets/images/blankAvatar.jpg"),
    // ... más imágenes
  };

  // Función para seleccionar una imagen de la galería
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImageUri = result.assets[0].uri;
      setImageUri(selectedImageUri); // Se actualiza directamente imageUri
      setImageKey(Date.now()); // Se actualiza la clave de la imagen para forzar el re-renderizado y asegurar la nueva imagen
    }
  };

  // Efecto para actualizar el perfil cuando imageUri cambia
  useEffect(() => {
    if (imageUri) {
      updateUser(); // Se llama a la función para actualizar el perfil
    }
  }, [imageUri]);

  // Función para actualizar el perfil del usuario en la base de datos
  const updateUser = async () => {
    setIsLoading(true);
    const uniqueFilename = `${uuidv4()}.jpg`; // Genera un nombre de archivo único

    // Se pone toda la información del usuario en un FormData, así pide la API
    const formData = new FormData();
    formData.append("user[avatar]", {
      uri: imageUri,
      type: "image/jpeg",
      name: uniqueFilename,
    });
    formData.append("user[name]", user.nombre);
    formData.append("user[last_name_1]", user.apellidoPaterno);
    formData.append("user[last_name_2]", user.apellidoMaterno);
    formData.append("user[phone]", user.telefono);
    formData.append("user[curp]", user.CURP);

    try {
      const response = await APIPut(`/api/v1/users/${user.userID}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.error) {
        Alert.alert("Error al actualizar el perfil", response.error);
      } else {
        setUser({ ...user, avatar: imageUri });
      }
    } catch (error) {
      Alert.alert("Error al actualizar el perfil", error.toString());
    } finally {
      setIsLoading(false);
    }
  };

  // Manejador para volver a la pantalla anterior
  const handleGoBack = () => {
    // Reinicia los valores del usuario
    setUser({
      ...user,
      ocupacion: "",
      estadoCivil: "",
    });
    navigation.navigate("PerfilScreen", {
      screen: "PerfilMain",
    });
  };

  // Componente visual
  return (
    // Cerrar el teclado cuando se toca fuera de un input
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{ flex: 1 }}>
        {/* Titulo, Nombre de la Pantalla y Notificación */}
        <View style={styles.tituloContainer}>
          <MaskedView
            style={{ flex: 1 }}
            maskElement={<Text style={styles.titulo}>tankef</Text>}
          >
            <LinearGradient
              colors={["#2FF690", "#21B6D5"]}
              start={{ x: 0.8, y: 0.8 }}
              end={{ x: 0, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
          </MaskedView>
          <Text style={styles.tituloPantalla}>Perfil</Text>
          <TouchableOpacity>
            <Feather
              name="bell"
              size={25}
              color="#060B4D"
              style={{ marginTop: 50 }}
            />
          </TouchableOpacity>
        </View>

        {/* Contenedor Foto de Peril y Boton para editarla */}
        <View style={{ backgroundColor: "white", marginTop: 3 }}>
          <View>
            <Image
              style={styles.imagen}
              source={user.avatar ? { uri: user.avatar } : imageMap["Blank"]}
            />
            <View>
              <TouchableOpacity
                style={styles.botonImagen}
                onPress={() => [pickImage(), resetTimeout()]}
              >
                <FontAwesome name="camera" size={24} color="#060B4D" />
                <Text style={styles.textoBotonImagen}>Editar Foto</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Contenedor del Resto de datos del usuario, se obtienen del contexto del usuario */}
        <View
          style={{
            marginTop: 3,
            backgroundColor: "white",
            flex: 1,
            paddingTop: 10,
          }}
        >
          <Text style={styles.tituloDato}>Correo Electrónico</Text>
          <Text style={styles.textoDato}>{user.email}</Text>
          <View style={styles.linea} />
          <Text style={styles.tituloDato}>Nombre(s) y Apellidos</Text>
          <Text style={styles.textoDato}>
            {user.nombre +
              " " +
              user.apellidoPaterno +
              " " +
              user.apellidoMaterno}
          </Text>
          <View style={styles.linea} />
          <Text style={styles.tituloDato}>Fecha de Nacimiento</Text>
          <Text style={styles.textoDato}>{user.fechaNacimiento}</Text>
          <View style={styles.linea} />
          <Text style={styles.tituloDato}>Teléfono</Text>
          <Text style={styles.textoDato}>{user.telefono}</Text>
          <View style={styles.linea} />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

// Estilos de la Pantalla
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
  tituloPantalla: {
    flex: 1,
    marginTop: 47,
    marginLeft: -30,
    fontSize: 24,
    color: "#060B4D",
    fontFamily: "opensanssemibold",
    fontWeight: "bold",
  },
  imagen: {
    marginTop: 15,
    width: 100,
    height: 100,
    alignSelf: "center",
    borderRadius: 65,
  },
  botonImagen: {
    backgroundColor: "#2FF690",
    width: 160,
    paddingHorizontal: 20,
    height: 40,
    borderRadius: 5,
    marginTop: 15,
    marginBottom: 50,
    alignItems: "center",
    alignSelf: "center",
    flexDirection: "row",
  },
  textoBotonImagen: {
    color: "#060B4D",
    fontFamily: "opensanssemibold",
    fontSize: 16,
    marginLeft: 10,
  },
  tituloDato: {
    marginLeft: 15,
    marginBottom: 10,
    fontSize: 16,
    fontFamily: "opensans",
    color: "#9a9cb8ff",
  },
  textoDato: {
    marginBottom: 10,
    marginLeft: 15,
    fontSize: 17,
    fontFamily: "opensanssemibold",
    color: "#060B4D",
  },
  linea: {
    height: 1,
    width: "100%",
    backgroundColor: "#cecfdbff",
    marginBottom: 10,
  },
});

export default EditarPerfil;
