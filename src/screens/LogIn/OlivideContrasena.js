// Importaciones de React Native y React
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useState } from "react";
import { ActivityIndicator } from "react-native-paper";
// Importaciones de Hooks y Componentes
import { AntDesign } from "@expo/vector-icons";
import { APIPost } from "../../API/APIService";

const OlvideContrasena = ({ navigation }) => {
  // Estados locales y contexto global
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Función para iniciar sesión
  const sendResetPasswordEmail = async () => {
    setIsLoading(true);
    const url = "/api/v1/account/password_resets";
    const data = {
      password_reset: { email: email },
    };

    const response = await APIPost(url, data);

    if (response.error) {
      console.error(
        "Error al enviar correo de recuperacion de contraseña:",
        response.error
      );
      let errorMessage = "Error en la solicitud";
      if (typeof response.error === "object") {
        errorMessage = Object.values(response.error).flat().join(". ");
      }
      Alert.alert("Error al Enviar Correo", errorMessage);
    } else if (response.data) {
      Alert.alert(
        "Correo Enviado",
        "Se ha enviado un correo con las instrucciones para restablecer tu contraseña"
      );
      navigation.goBack();
    } else {
      Alert.alert(
        "Error al Enviar Correo",
        "Respuesta inesperada del servidor"
      );
    }
    setIsLoading(false);
  };

  // Componente visual
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.background}>
        {/* Regresar */}
        <TouchableOpacity
          style={styles.back}
          onPress={() => navigation.goBack()}
        >
          <AntDesign name="arrowleft" size={40} color="#29364d" />
        </TouchableOpacity>
        {/* Contenedor Principal */}

        <View style={styles.container}>
          {/* Texto de Bienvenida a Olvide mi Contraseña */}
          <Text style={styles.titulo}>Restablecer{"\n"}contraseña</Text>
          <Text style={styles.texto}>
            Para restablecer tu contraseña ingresa el correo electrónico con el
            que te registraste.
          </Text>

          {/* Input de Correo al que enviar el correo de restablecimiento */}
          <Text style={styles.campo}>Correo electrónico</Text>
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            placeholder="nombre@correo.com"
            placeholderTextColor={"#b3b5c9"}
            onChangeText={(text) => setEmail(text)}
          />

          {/* Boton de Enviar Correo */}
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: email ? "#060B4D" : "#F3F3F3" },
            ]}
            onPress={() => sendResetPasswordEmail(email)}
            disabled={!email}
          >
            <Text
              style={[styles.buttonText, { color: email ? "white" : "grey" }]}
            >
              Enviar correo
            </Text>
          </TouchableOpacity>
        </View>
        {/* Vista de carga */}
        {isLoading && (
          <View style={styles.overlay}>
            <ActivityIndicator size={75} color="#060B4D" />
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

// Estilos de la Pantalla
const styles = StyleSheet.create({
  back: {
    marginTop: 60,
    marginLeft: 20,
    position: "absolute",
    zIndex: 100,
  },
  background: {
    backgroundColor: "white",
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "space-between",
  },
  container: {
    marginTop: 250,
    alignItems: "center",
  },
  titulo: {
    color: "#060B4D",
    alignSelf: "center",
    textAlign: "center",
    fontSize: 35,
    fontFamily: "opensansbold",
  },
  texto: {
    marginTop: 15,
    fontSize: 16,
    color: "#060B4D",
    alignSelf: "center",
    textAlign: "center",
    fontFamily: "opensans",
  },
  campo: {
    marginTop: 30,
    fontSize: 16,
    color: "#060B4D",
    fontFamily: "opensanssemibold",
    alignSelf: "center",
    textAlign: "center",
  },
  input: {
    width: "100%",
    fontSize: 20,
    marginTop: 10,
    fontFamily: "opensans",
    alignSelf: "center",
    textAlign: "center",
    borderWidth: 1,
    borderColor: "transparent",
    borderBottomColor: "#dfdfe8",
    color: "#060B4D",
  },
  button: {
    marginTop: 40,
    backgroundColor: "#060B4D",
    width: "100%",
    alignSelf: "center",
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    alignSelf: "center",
    padding: 10,
    fontFamily: "opensanssemibold",
    fontSize: 16,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default OlvideContrasena;
