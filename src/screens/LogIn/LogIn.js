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
  Linking,
} from "react-native";
import React, { useState, useContext } from "react";
import { ActivityIndicator } from "react-native-paper";
import { UserContext } from "../../hooks/UserContext"; // Contexto para manejar el estado del usuario
import { setToken, APIPost } from "../../API/APIService";
import { Feather, Ionicons } from "@expo/vector-icons";

// Componente de pantalla inicial
const LogIn = ({ navigation }) => {
  const { user, setUser } = useContext(UserContext); // Consumir el contexto del usuario
  const [email, setEmail] = useState(""); // Estado para manejar el email del usuario
  const [password, setPassword] = useState(""); // Estado para manejar la contraseña del usuario
  const [isLoading, setIsLoading] = useState(false); // Estado para manejar el indicador de carga
  const [condiciones, setCondiciones] = useState(false); // Estado para manejar la aceptación de términos y condiciones
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // Estado para manejar la visibilidad de la contraseña

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
    const url = "/api/v1/account/sessions";
    const data = {
      session: { email: email, password: password },
    };

    const response = await APIPost(url, data);

    if (response.data && response.data.data) {
      // Continuar en caso de éxito
      const userData = response.data.data;
      setToken(response.data.token);
      console.log("Inicio de sesión exitoso:", userData);
      console.log("Nombre:", titleCase(userData.name));
      setUser({
        ...user,
        userID: userData.id,
        telefono: userData.phone,
        nombre: titleCase(userData.name),
        apellidoPaterno: titleCase(userData.first_last_name),
        apellidoMaterno: titleCase(userData.second_last_name),
        CURP: userData.curp,
        email: userData.email,
        conexiones: userData.count_conections,
        valorRed: userData.network_invested_amount,
      });
      setEmail("");
      setPassword("");
      setCondiciones(false);
      navigation.navigate("SetPinPad");
    } else if (response.error) {
      // Manejar el error
      console.error("Error de inicio de sesión:", response.error);
      let errorMessage = "Error en la solicitud";
      if (typeof response.error === "object") {
        errorMessage = Object.values(response.error).flat().join(". ");
      }
      Alert.alert("Error de Inicio de Sesión", errorMessage);
    } else {
      // Manejar otros casos inesperados
      Alert.alert(
        "Error de Inicio de Sesión",
        "Respuesta inesperada del servidor"
      );
    }
    setIsLoading(false);
  };

  const visitPage = (which) => {
    if (which === "terms") {
      const url = "https://www.google.com";
      Linking.openURL(url).catch((err) =>
        console.error("Couldn't load page", err)
      );
    } else if (which === "privacy") {
      const url = "https://www.google.com";
      Linking.openURL(url).catch((err) =>
        console.error("Couldn't load page", err)
      );
    }
  };

  const disabled = email && password && condiciones;

  // Componente visual
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.contentContainer}>
        {/* Logo y título */}
        <View style={{ marginTop: 140 }}>
          <Image
            source={require("../../../assets/images/Logo.png")}
            style={styles.logo}
          />
          <Text style={styles.title}>
            Inicia sesión ingresando los datos solicitados o regístrate.
          </Text>
        </View>

        {/* Contenedor del formulario */}
        <View style={styles.formContainer}>
          <Text style={styles.campo}>Correo</Text>
          <TextInput
            style={styles.input}
            placeholder="nombre@correo.com"
            autoCapitalize="none"
            placeholderTextColor={"#b3b5c9"}
            onChangeText={(text) => setEmail(text)}
          />

          <Text style={[styles.campo, { marginTop: 20 }]}>Contraseña</Text>
          <View>
            <TextInput
              style={styles.input}
              placeholder="•••••••"
              placeholderTextColor={"#b3b5c9"}
              autoCapitalize="none"
              secureTextEntry={!isPasswordVisible}
              onChangeText={(text) => setPassword(text)}
            />

            {password && (
              <TouchableOpacity
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                style={styles.toggleButton}
              >
                <Ionicons
                  name={isPasswordVisible ? "eye-off" : "eye"}
                  size={24}
                  color={"#060B4D"}
                />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate("OlvideContrasena")}
          >
            <Text style={styles.forgotPasswordText}>
              ¿Olvidaste tu contraseña?{" "}
              <Text style={{ color: "#2ef095" }}>Click aquí</Text>
            </Text>
          </TouchableOpacity>
        </View>

        {/* Botones */}
        <View style={{ marginBottom: 30 }}>
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: !disabled || isLoading ? "#F3F3F3" : "#060B4D",
                marginBottom: 0,
              },
            ]}
            onPress={() => signIn()}
            disabled={isLoading || !disabled}
          >
            <Text
              style={[
                styles.buttonText,
                { color: !disabled || isLoading ? "grey" : "white" },
              ]}
            >
              Iniciar sesión
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#F3F3F3" }]}
            onPress={() => navigation.navigate("NumeroTelefonico")}
          >
            <Text style={[styles.buttonText, { color: "#060B4D" }]}>
              Regístrate
            </Text>
          </TouchableOpacity>
          <View
            style={{
              flexDirection: "row",
              marginTop: 5,
            }}
          >
            <TouchableOpacity
              style={{ marginTop: 10, alignSelf: "center", marginRight: 7.5 }}
              onPress={() => setCondiciones(!condiciones)}
            >
              <Feather
                name={condiciones ? "check-square" : "square"}
                size={24}
                color="#060B4D"
              />
            </TouchableOpacity>
            <Text style={styles.textoTerminos}>
              Al iniciar sesión estás aceptando{" "}
              <TouchableOpacity
                style={{ marginTop: -2.5 }}
                onPress={() => visitPage("terms")}
              >
                <Text
                  style={[
                    styles.textoTerminos,
                    {
                      fontFamily: "opensansbold",
                      color: "#2ef095",
                      marginTop: 0,
                    },
                  ]}
                >
                  Términos y Condiciones
                </Text>
              </TouchableOpacity>
              así como{" "}
              <TouchableOpacity
                style={{ marginTop: -2.5 }}
                onPress={() => visitPage("privacy")}
              >
                <Text
                  style={[
                    styles.textoTerminos,
                    {
                      fontFamily: "opensansbold",
                      color: "#2ef095",
                      marginTop: 0,
                    },
                  ]}
                >
                  Políticas de Privacidad
                </Text>
              </TouchableOpacity>
            </Text>
          </View>
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

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  logo: {
    width: 180,
    height: 122,
    alignSelf: "center",
  },
  title: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 20,
    color: "white",
    fontFamily: "opensans",
    color: "#060B4D",
  },
  formContainer: {
    marginTop: -30,
    alignSelf: "center",
    backgroundColor: "white",
    width: "100%",
  },
  campo: {
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
  toggleButton: {
    position: "absolute",
    right: 25,
    marginTop: 10,
    justifyContent: "center",
  },
  textoTerminos: {
    fontSize: 12,
    color: "#060B4D",
    fontFamily: "opensans",
    marginTop: 10,
    paddingRight: 10,
  },
  forgotPasswordText: {
    color: "#060B4D",
    textAlign: "center",
    fontSize: 15,
    marginTop: 15,
    fontFamily: "opensanssemibold",
  },
  button: {
    marginTop: 15,
    backgroundColor: "#060B4D",
    width: "100%",
    alignSelf: "center",
    borderRadius: 5,
  },
  buttonText: {
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

export default LogIn;
