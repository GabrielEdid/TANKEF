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
  TextInput,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
// Importaciones de Componentes y Hooks
import { APIPut } from "../../API/APIService";
import { UserContext } from "../../hooks/UserContext";
import { Feather, FontAwesome } from "@expo/vector-icons";

const EditarPerfil = ({ navigation }) => {
  // Estados locales
  const { user, setUser } = useContext(UserContext); //Contexo
  const [email, setEmail] = useState(user.email);
  const [isLoading, setIsLoading] = useState(false);

  const imageMap = {
    Blank: require("../../../assets/images/blankAvatar.jpg"),
    // ... más imágenes
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.1,
    });

    if (!result.canceled) {
      const selectedImage = result.assets[0];
      await setUser({
        ...user,
        avatarUri: selectedImage.uri, // Accede a la URI a través de assets
      });

      updateUser();
    }
  };

  const updateUser = async (data) => {
    const userData = {
      name: user.nombre,
      last_name_1: user.apellidoPaterno,
      last_name_2: user.apellidoMaterno,
      phone: user.telefono,
      curp: user.CURP,
      avatar: user.avatar,
    };
    setIsLoading(true);
    const url = `/api/v1/users/${user.userID}`;

    try {
      const response = await APIPut(url, userData);
      if (response.error) {
        throw new Error(response.error);
      }

      console.log("Usuario actualizado:", response.data);
      // Maneja aquí la respuesta
      setIsLoading(false);
      /*navigation.navigate("MainFlow", {
        screen: "Perfil",
        params: {
          screen: "PerfilMain",
        },
      });*/
    } catch (error) {
      console.error("Hubo un problema al actualizar el usuario:", error);
      Alert.alert(
        "Hubo un problema al modificar tus datos",
        "Verificalos y vuelve a intentarlo.",
        [{ text: "Entendido" }],
        { cancelable: true }
      );
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
        <View style={styles.tituloContainer}>
          {/* Titulo */}
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

        <View style={{ backgroundColor: "white", marginTop: 3 }}>
          {/* Contenedor Foto de Peril */}
          <View>
            <Image
              style={styles.imagen}
              source={user.avatar ? { uri: user.avatar } : imageMap["Blank"]}
            />
            <View>
              <TouchableOpacity
                style={styles.botonImagen}
                onPress={() => pickImage()}
              >
                <FontAwesome name="camera" size={24} color="#060B4D" />
                <Text style={styles.textoBotonImagen}>Editar Foto</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Contenedor Correo Electrónico */}
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

        {/* Botón de Continuar 
        
        <TouchableOpacity
          style={styles.botonGrande}
          onPress={() => handleSiguiente()}
          disabled={isLoading}
        >
          <Text style={styles.textoBotonGrande}>Guardar</Text>
            </TouchableOpacity>*/}
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
  /* Estilos del botón grande
  botonGrande: {
    width: "%",
    height: 60,
    alignSelf: "center",
    justifyContent: "center",
    backgroundColor: "#2FF690",
    borderRadius: 25,
    marginBottom: 20,
    zIndex: -10,
  },
  textoBotonGrande: {
    color: "#060B4D",
    textAlign: "center",
    fontSize: 20,
    fontFamily: "opensansbold",
  },*/
});

export default EditarPerfil;
