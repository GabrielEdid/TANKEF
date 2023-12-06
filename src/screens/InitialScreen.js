import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useState, useContext } from "react";
import { UserContext } from "../hooks/UserContext";
import SpecialInput from "../components/SpecialInput";
import { auth } from "../../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";

const InitialScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Nuevo estado para manejar el proceso de carga
  const { user, setUser } = useContext(UserContext);

  const signIn = async () => {
    /*try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      setUser({ ...user, FireBaseUIDMail: response.user.uid });
      navigation.navigate("SetPinPad");
    } catch (error) {
      console.log(error);
      alert("Sign In Failed: " + error.message);
    }*/
    setIsLoading(true); // Inicia el proceso de carga
    fetch(
      "https://market-web-pr477-x6cn34axca-uc.a.run.app/api/v1/account/sessions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session: {
            email: email,
            password: password,
          },
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        //setUser({ ...user, FireBaseUIDMail: response.user.uid });
        navigation.navigate("SetPinPad");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    setIsLoading(false); // Finaliza el proceso de carga
  };

  return (
    //Imagen de Fondo
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <ImageBackground
        source={require("../../assets/images/Fondo.png")}
        style={styles.background}
      >
        {/* Logo, Titulo */}
        <Image
          source={require("../../assets/images/Logo_Tankef.png")}
          style={styles.imagen}
        />
        <Text style={styles.titulo}>TANKEF</Text>
        {/* Fin Logo, Titulo y Avance */}
        {/* Contenedor */}
        <View style={styles.container}>
          <Text style={styles.welcome}>WELCOME BACK</Text>
          {/* Entradas de Input */}
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
        {/* Boton Craer Cuenta */}
        <TouchableOpacity
          style={[styles.boton, { marginTop: 670, backgroundColor: "white" }]}
          onPress={() => navigation.navigate("Registro1")}
        >
          <Text style={[styles.textoBotonCuenta, { color: "#29364d" }]}>
            CREAR UNA CUENTA
          </Text>
        </TouchableOpacity>
        {/* Boton Iniciar Sesion */}
        <TouchableOpacity
          style={styles.boton}
          onPress={() => [console.log(email), signIn()]}
          disabled={isLoading} // Desactiva el botón cuando isLoading es true
        >
          <Text style={styles.textoBotonCuenta}>INICIAR SESIÓN</Text>
        </TouchableOpacity>
        {/* Fin Contenedor */}
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
};

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
