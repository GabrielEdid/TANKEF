// Importaciones de React Native y React
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import React, { useState, useContext } from "react";
import { UserContext } from "../hooks/UserContext"; // Contexto para manejar el estado del usuario
import SpecialInput from "../components/SpecialInput"; // Componente para entradas de texto especializadas
import { auth } from "../../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth"; // Método para autenticación con Firebase

// Componente de pantalla inicial
const InitialScreen = ({ navigation }) => {
  const [email, setEmail] = useState(""); // Estado para manejar el email del usuario
  const [password, setPassword] = useState(""); // Estado para manejar la contraseña del usuario
  const [isLoading, setIsLoading] = useState(false); // Estado para manejar el indicador de carga
  const { user, setUser } = useContext(UserContext); // Consumir el contexto del usuario

  // Función para iniciar sesión
  const signIn = async () => {
    /*try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      setUser({ ...user, FireBaseUIDMail: response.user.uid });
      navigation.navigate("SetPinPad");
    } catch (error) {
      console.log(error);
      alert("Sign In Failed: " + error.message);
    }*/
    setIsLoading(true); // Activar el indicador de carga

    // Petición al servidor para iniciar sesión
    fetch(
      "https://market-web-pr477-x6cn34axca-uc.a.run.app/api/v1/account/sessions",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session: { email: email, password: password } }),
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw response; // Lanzar un error si la respuesta no es exitosa
        }
        return response.json();
      })
      .then((data) => {
        console.log("Success:", data);
        navigation.navigate("SetPinPad"); // Navegar a la siguiente pantalla en caso de éxito
      })
      .catch((errorResponse) => {
        // Manejar los errores de la petición
        errorResponse.json().then((errorData) => {
          console.error("Error:", errorData);
          const errorMessages = Object.values(errorData).flat().join(". ");
          Alert.alert("Error de Inicio de Sesión", errorMessages); // Mostrar alerta de error
        });
      })
      .finally(() => setIsLoading(false)); // Finalizar el indicador de carga
  };

  // Componente visual
  return (
    // Cerrar el teclado cuando se toca fuera de un input
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      {/* Contenedor del fondo */}
      <ImageBackground
        source={require("../../assets/images/Fondo.png")}
        style={styles.background}
      >
        {/* Logo y título de la aplicación */}
        <Image
          source={require("../../assets/images/Logo_Tankef.png")}
          style={styles.imagen}
        />
        <Text style={styles.titulo}>TANKEF</Text>

        {/* Contenedor con campos de entrada y botones */}
        <View style={styles.container}>
          <Text style={styles.welcome}>WELCOME BACK</Text>

          {/* Campos de entrada para correo y contraseña */}
          <View style={styles.input}>
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
              <Text style={styles.textoOlvideContraseña}>
                Olvide mi Contraseña
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Botones para crear cuenta e iniciar sesión */}
        <TouchableOpacity
          style={[styles.boton, { marginTop: 670, backgroundColor: "white" }]}
          onPress={() => navigation.navigate("Registro1")}
        >
          <Text style={[styles.textoBotonCuenta, { color: "#29364d" }]}>
            CREAR UNA CUENTA
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.boton}
          onPress={() => signIn()}
          disabled={isLoading}
        >
          <Text style={styles.textoBotonCuenta}>INICIAR SESIÓN</Text>
        </TouchableOpacity>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
};

// Estilos de la Pantalla
const styles = StyleSheet.create({
  background: {
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
    fontSize: 35,
    color: "white",
    marginTop: 160,
    alignSelf: "center",
    position: "absolute",
  },
  container: {
    height: 250,
    width: 350,
    marginTop: 280,
    backgroundColor: "white",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.37,
    shadowRadius: 5,
    elevation: 8,
    borderRadius: 25,
  },
  welcome: {
    marginTop: 30,
    fontSize: 22,
    fontFamily: "conthrax",
    color: "#29364d",
    alignSelf: "center",
    position: "absolute",
  },
  input: {
    marginTop: 80,
  },
  boton: {
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
  textoBotonCuenta: {
    color: "white",
    textAlign: "center",
    fontSize: 20,
    fontFamily: "conthrax",
  },
  textoOlvideContraseña: {
    color: "#29364d",
    textAlign: "center",
    fontSize: 15,
    marginTop: 10,
    fontWeight: "bold",
  },
});

export default InitialScreen;
