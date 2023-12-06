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
import { AntDesign } from "@expo/vector-icons";
import { UserContext } from "../hooks/UserContext";
import { auth } from "../../firebaseConfig";
import { sendPasswordResetEmail } from "firebase/auth";

const OlvideContrasena = ({ navigation }) => {
  const { user, setUser } = useContext(UserContext);
  const [email, setEmail] = useState("");

  const sendResetPasswordEmail = (email) => {
    /*sendPasswordResetEmail(auth, email)
      .then(() => {
        Alert.alert(
          "Correo Enviado",
          "Checa tu buzon de entrada para restablecer tu contraseña.",
          [{ text: "Entendido" }],
          { cancelable: true }
        );
      })
      .catch((error) => {
        alert("No se pudo enviar el correo: " + error.message);
      });*/
    // Aqui se va a tener la logica de Jesus
    Alert.alert(
      "Faltante",
      "Aqui va la logica de Jesus.",
      [{ text: "Entendido" }],
      { cancelable: true }
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.background}>
        {/* Logo, Titulo y Avance */}
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign
            name="arrowleft"
            size={40}
            color="#29364d"
            style={styles.back}
          />
        </TouchableOpacity>
        <Image
          source={require("../../assets/images/Logo_Tankef.png")}
          style={styles.imagen}
        />
        <Text style={styles.titulo}>TANKEF</Text>
        <View style={styles.container}>
          <Text
            style={[
              styles.texto,
              { marginTop: 10, fontSize: 25, fontWeight: "bold" },
            ]}
          >
            ¿Olvidaste tu contraseña?
          </Text>
          <Text style={styles.texto}>
            ¡No te preocupes! Introduce tu correo y se te enviaran instrucciones
            para modificar tu contraseña.
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Ingresa tu correo electrónico"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
        </View>

        {/* Boton Craer Cuenta */}
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
    position: "absolute",
  },
  titulo: {
    fontFamily: "conthrax",
    fontSize: 25,
    color: "#29364d",
    marginTop: 160,
    alignSelf: "center",
    position: "absolute",
  },
  container: {
    position: "absolute",
    alignSelf: "center",
    height: 200,
    width: 330,
    marginTop: 210,
    backgroundColor: "white",
    flex: 1,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.6,
    shadowRadius: 5,
    elevation: 8,
  },
  texto: {
    fontSize: 16,
    color: "#29364d",
    alignSelf: "center",
    position: "absolute",
    marginTop: 55,
    textAlign: "center",
    paddingHorizontal: 12,
  },
  input: {
    marginTop: 130,
    borderColor: "#29364d",
    borderWidth: 2,
    borderRadius: 10,
    alignSelf: "center",
    width: 300,
    height: 40,
    paddingLeft: 10,
    fontSize: 16,
  },
  botonGrande: {
    marginTop: 750,
    width: 350,
    height: 60,
    alignSelf: "center",
    justifyContent: "center",
    backgroundColor: "#29364d",
    borderRadius: 25,
    position: "absolute",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.37,
    shadowRadius: 5,
    elevation: 8,
  },
  textoBotonGrande: {
    color: "white",
    textAlign: "center",
    fontSize: 20,
    fontFamily: "conthrax",
  },
});

export default OlvideContrasena;
