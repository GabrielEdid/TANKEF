// Importaciones de React Native y React
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  Alert,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useState, useContext } from "react";
// Importaciones de Hooks y Componentes
import { UserContext } from "../../hooks/UserContext";
import { AntDesign } from "@expo/vector-icons";

const OlvideContrasena = ({ navigation }) => {
  // Estados locales y contexto global
  const { user, setUser } = useContext(UserContext);
  const [email, setEmail] = useState("");

  // Función para enviar el correo de restablecimiento de contraseña
  const sendResetPasswordEmail = async (email) => {
    fetch(
      "https://market-web-pr477-x6cn34axca-uc.a.run.app/api/v1/account/password_resets",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password_reset: {
            email: email,
          },
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        navigation.navigate("InitialScreen");
        Alert.alert(
          "Correo Enviado",
          "Checa tu buzon de entrada para restablecer tu contraseña.",
          [{ text: "Entendido" }],
          { cancelable: true }
        );
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  // Componente visual
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.background}>
        {/* Logo, Titulo y Imagen de Avance y Regresar */}
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign
            name="arrowleft"
            size={40}
            color="#29364d"
            style={styles.back}
          />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Image
            source={require("../../../assets/images/Logo_Tankef.png")}
            style={styles.imagen}
          />
          <Text style={styles.header}>TANKEF</Text>
          {/* Contenedor Principal */}
          <View style={styles.container}>
            {/* Texto de Bienvenida a Olvide mi Contraseña */}
            <Text style={styles.titulo}>¿Olvidaste tu contraseña?</Text>
            <Text style={styles.texto}>
              ¡No te preocupes! Introduce tu correo y se te enviaran
              instrucciones para modificar tu contraseña.
            </Text>
            {/* Input de Correo al que enviar el correo de restablecimiento */}
            <TextInput
              style={styles.input}
              placeholder="Ingresa tu correo electrónico"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
            />
          </View>
        </View>
        {/* Boton de Enviar Correo */}
        <TouchableOpacity
          style={styles.botonGrande}
          onPress={() => sendResetPasswordEmail(email)}
        >
          <Text style={styles.textoBotonGrande}>ENVIAR CORREO</Text>
        </TouchableOpacity>
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
  },
  background: {
    backgroundColor: "white",
    flex: 1,
  },
  imagen: {
    width: 90,
    height: 90,
    alignSelf: "center",
    marginTop: 60,
  },
  header: {
    fontFamily: "conthrax",
    fontSize: 25,
    color: "#29364d",
    marginTop: 10,
    alignSelf: "center",
  },
  container: {
    marginTop: 25,
    alignSelf: "center",
    backgroundColor: "white",
    width: "90%",
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.6,
    shadowRadius: 5,
    elevation: 8,
  },
  titulo: {
    fontSize: 16,
    color: "#29364d",
    alignSelf: "center",
    textAlign: "center",
    fontSize: 25,
    fontWeight: "bold",
  },
  texto: {
    top: 10,
    fontSize: 16,
    color: "#29364d",
    alignSelf: "center",
    textAlign: "center",
    marginBottom: 25,
  },
  input: {
    borderColor: "#29364d",
    borderWidth: 2,
    borderRadius: 10,
    alignSelf: "center",
    width: "95%",
    height: 40,
    paddingLeft: 10,
    fontSize: 16,
  },
  botonGrande: {
    width: "85%",
    height: 60,
    alignSelf: "center",
    justifyContent: "center",
    backgroundColor: "#29364d",
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.37,
    shadowRadius: 5,
    elevation: 8,
    marginBottom: 30,
  },
  textoBotonGrande: {
    color: "white",
    textAlign: "center",
    fontSize: 20,
    fontFamily: "conthrax",
  },
});

export default OlvideContrasena;
