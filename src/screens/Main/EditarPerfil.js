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

const EditarPerfil = ({ navigation }) => {
  // Estados locales
  const { user, setUser } = useContext(UserContext); //Contexo
  const [email, setEmail] = useState(user.email);
  const [isLoading, setIsLoading] = useState(false);

  const updateUser = async (userData) => {
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
      navigation.navigate("MainFlow", {
        screen: "Perfil",
        params: {
          screen: "PerfilMain",
        },
      });
    } catch (error) {
      console.error("Hubo un problema al actualizar el usuario:", error);
      Alert.alert(
        "Hubo un problema al modificar tus datos",
        "Verificalos y vuelve a intentarlo.",
        [{ text: "Entendido" }],
        { cancelable: true }
      );
      setIsLoading(false);
      // Maneja aquí los errores
    }
  };

  // Manejador para el botón Siguiente
  const handleSiguiente = async () => {
    console.log("Datos de usuario:", user);
    // Datos de usuario a actualizar
    const userData = {
      avatar: user.avatar,
      name: user.nombre,
      last_name_1: user.apellidoPaterno,
      last_name_2: user.apellidoMaterno,
      phone: user.telefono,
      curp: user.CURP,
    };

    try {
      await updateUser(userData);
    } catch (error) {
      console.error("Error al actualizar:", error);
      // Aquí puedes manejar los errores, por ejemplo, mostrando un alerta
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled) {
      const selectedImage = result.assets[0];
      await setUser({
        ...user,
        avatar: `data:image/jpeg;base64,${selectedImage.base64}`,
      });
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
      <View style={styles.background}>
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
          <Text style={styles.tituloPantalla}>Mi Red</Text>
          <TouchableOpacity>
            <Feather
              name="bell"
              size={25}
              color="#060B4D"
              style={{ marginTop: 50 }}
            />
          </TouchableOpacity>
        </View>

        <View style={{ flex: 1 }}>
          {/* Contenedor Foto de Peril */}
          <View style={{ flexDirection: "row" }}>
            <Image
              style={styles.imagen}
              source={
                user.avatar
                  ? { uri: user.avatar }
                  : require("../../../assets/images/blankAvatar.jpg")
              }
            />
            <View>
              <Text style={styles.texto}>Foto de Perfil</Text>
              <TouchableOpacity
                style={styles.botonImagen}
                onPress={() => pickImage()}
              >
                <Text style={styles.textoBotonImagen}>
                  {user.avatar ? "CAMBIAR IMAGEN" : "ELEGIR IMAGEN"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Contenedor Correo Electrónico */}
          <Text style={[styles.texto, { marginLeft: 0 }]}>
            Correo Electrónico
          </Text>
          <TextInput
            style={styles.input}
            placeholder={user.email}
            onChangeText={setEmail}
          />
        </View>

        {/* Botón de Continuar */}
        <TouchableOpacity
          style={styles.botonGrande}
          onPress={() => handleSiguiente()}
          disabled={isLoading}
        >
          <Text style={styles.textoBotonGrande}>GUARDAR DATOS</Text>
        </TouchableOpacity>
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
    marginLeft: 5,
    fontSize: 24,
    color: "#060B4D",
    fontFamily: "opensanssemibold",
    fontWeight: "bold",
  },
  background: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
  },
  imagen: {
    marginTop: 15,
    width: 130,
    height: 130,
    borderRadius: 65,
  },
  texto: {
    marginTop: 15,
    marginLeft: 15,
    fontSize: 25,
    fontWeight: "bold",
    color: "#29364d",
  },
  botonImagen: {
    marginTop: 15,
    marginLeft: 15,
    paddingHorizontal: 20,
    backgroundColor: "#29364d",
    height: 40,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  textoBotonImagen: {
    color: "white",
    fontFamily: "conthrax",
    fontSize: 16,
    fontWeight: "bold",
  },
  input: {
    marginTop: 15,
    paddingHorizontal: 20,
    backgroundColor: "#f2f2f2",
    height: 40,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    fontSize: 16,
    color: "#29364d",
  },
  botonGrande: {
    width: "100%",
    height: 60,
    alignSelf: "center",
    justifyContent: "center",
    backgroundColor: "#29364d",
    borderRadius: 25,
    marginBottom: 20,
    zIndex: -10,
  },
  textoBotonGrande: {
    color: "white",
    textAlign: "center",
    fontSize: 20,
    fontFamily: "conthrax",
  },
});

export default EditarPerfil;
