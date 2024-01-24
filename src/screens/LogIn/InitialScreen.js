// Importaciones de React Native y React
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  Keyboard,
  Alert,
  Modal,
} from "react-native";
import React, { useState, useContext } from "react";
import { ActivityIndicator } from "react-native-paper";
import { UserContext } from "../../hooks/UserContext"; // Contexto para manejar el estado del usuario
import SpecialInput from "../../components/SpecialInput"; // Componente para entradas de texto especializadas
import { token, APIPost } from "../../API/APIService";

// Componente de pantalla inicial
const InitialScreen = ({ navigation }) => {
  const [email, setEmail] = useState(""); // Estado para manejar el email del usuario
  const [password, setPassword] = useState(""); // Estado para manejar la contraseña del usuario
  const [isLoading, setIsLoading] = useState(false); // Estado para manejar el indicador de carga
  const { user, setUser } = useContext(UserContext); // Consumir el contexto del usuario

  // Función para convertir la primera letra de cada palabra en mayúscula
  function titleCase(str) {
    return str
      .toLowerCase()
      .split(" ")
      .map(function (word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(" ");
  }

  // Función para iniciar sesión
  const signIn = async () => {
    setIsLoading(true);
    const url =
      "https://market-web-pr477-x6cn34axca-uc.a.run.app/api/v1/account/sessions";
    const data = {
      session: { email: email, password: password },
    };

    try {
      const response = await APIPost(url, data);
      if (response && response.data) {
        const userData = response.data.data;
        const userToken = response.data.token;

        setUser({
          ...user,
          userID: userData.id,
          telefono: userData.phone,
          nombre: titleCase(userData.name),
          apellidoPaterno: titleCase(userData.last_name_1),
          apellidoMaterno: titleCase(userData.last_name_2),
          CURP: userData.curp,
          email: userData.email,
          userToken: userToken,
        });
        navigation.navigate("SetPinPad");
      } else {
        throw new Error("Respuesta inesperada del servidor");
      }
    } catch (error) {
      console.error("Error:", error);
      const errorMessage =
        error.response && error.response.data
          ? Object.values(error.response.data).flat().join(". ")
          : "Error desconocido";
      Alert.alert("Error de Inicio de Sesión", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Componente visual
  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => Keyboard.dismiss()} // Cerrar el teclado cuando se toca fuera de un input, no funciono touchableWithoutFeedBack
      style={{ flex: 1 }}
    >
      <ImageBackground
        source={require("../../../assets/images/Fondo.png")}
        style={styles.background}
      >
        <View style={styles.contentContainer}>
          {/* Logo y título */}
          <View style={styles.header}>
            <Image
              source={require("../../../assets/images/Logo_Tankef.png")}
              style={styles.logo}
            />
            <Text style={styles.title}>TANKEF</Text>
          </View>

          {/* Contenedor del formulario */}
          <View style={styles.formContainer}>
            <Text style={styles.welcomeText}>WELCOME BACK</Text>
            <SpecialInput field="Correo" editable={true} set={setEmail} />
            <SpecialInput
              field="Contraseña"
              editable={true}
              password={true}
              set={setPassword}
            />
            <TouchableOpacity
              onPress={() => navigation.navigate("OlvideContrasena")}
            >
              <Text style={styles.forgotPasswordText}>
                Olvidé mi Contraseña
              </Text>
            </TouchableOpacity>
          </View>

          {/* Botones */}
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "white" }]}
              onPress={() => navigation.navigate("Registro1")}
            >
              <Text style={[styles.buttonText, { color: "#29364d" }]}>
                CREAR UNA CUENTA
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#29364d" }]}
              onPress={() => signIn()}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>INICIAR SESIÓN</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Modal de carga */}
        <Modal transparent={true} animationType="fade" visible={isLoading}>
          <View style={styles.overlay}>
            <ActivityIndicator size={75} color="white" />
          </View>
        </Modal>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  header: {
    alignItems: "center",
    paddingTop: 60,
  },
  logo: {
    width: 90,
    height: 90,
  },
  title: {
    fontSize: 35,
    color: "white",
    fontFamily: "conthrax",
  },
  formContainer: {
    alignSelf: "center",
    width: "85%",
    backgroundColor: "white",
    borderRadius: 25,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.37,
    shadowRadius: 5,
    elevation: 8,
  },
  welcomeText: {
    fontSize: 22,
    fontFamily: "conthrax",
    color: "#29364d",
    marginBottom: 20,
    textAlign: "center",
  },
  forgotPasswordText: {
    color: "#29364d",
    textAlign: "center",
    fontSize: 15,
    marginTop: 10,
    fontWeight: "bold",
  },
  buttonGroup: {
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  button: {
    height: 60,
    justifyContent: "center",
    borderRadius: 25,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.37,
    shadowRadius: 5,
    elevation: 8,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 20,
    fontFamily: "conthrax",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
});

export default InitialScreen;
