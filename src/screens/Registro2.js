// Importaciones de React Native y React
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useRef, useState, useContext, useEffect } from "react";
// Importaciones de Firebase
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { firebaseConfig, auth } from "../../firebaseConfig";
import firebase from "firebase/compat/app";
// Importaciones de Componentes y Hooks
import { UserContext } from "../hooks/UserContext";
import CodigoSMS from "../components/CodigoSMS";
import { AntDesign } from "@expo/vector-icons";

const Registro2 = ({ navigation, route }) => {
  // Obteniendo parámetros de la ruta y estado global del context
  const { callingCode, number, verificationId } = route.params;
  const { user, setUser } = useContext(UserContext);

  // Estados locales
  const [code, setCode] = useState("");
  const phoneNumber = "+" + callingCode + " " + number;
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [timer, setTimer] = useState(60);
  const [newVerificationId, setNewVerificationId] = useState("");
  const recaptchaVerifier = useRef(null);

  // Función para enviar código de verificación por si presiona el botón "No recibí el código"
  const sendVerification = () => {
    // Se reinicia el temporizador y se re-deshabilita el botón
    setTimer(60);
    setIsButtonEnabled(false);

    const phoneProvider = new firebase.auth.PhoneAuthProvider();
    phoneProvider
      .verifyPhoneNumber("+" + callingCode + number, recaptchaVerifier.current)
      .then(setNewVerificationId);
  };

  // Función para confirmar código de verificación
  const confirmCode = () => {
    const credential = firebase.auth.PhoneAuthProvider.credential(
      verificationId || newVerificationId,
      code
    );
    firebase
      .auth()
      .signInWithCredential(credential)
      .then((response) => {
        let UID = response.user.uid;
        // Actualizar contexto del usuario con la respuesta de Firebase
        setUser({
          ...user,
          FireBaseUIDTel: UID,
          telefono: callingCode + number,
        });
        setCode("");
        navigation.navigate("Registro3");
      })
      .catch((error) => {
        alert(error);
      });
  };

  // Efecto para el temporizador y habilitación de botón de reenvío de código
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setIsButtonEnabled(true);
    }
  }, [timer]);

  // Componente visual
  return (
    // Cerrar el teclado cuando se toca fuera de un input
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.background}>
        {/* Logo, Titulo, Imagen de Avance y Regresar */}
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
        {/* Contenedor principal */}
        <View style={styles.container}>
          {/* Re-Captcha Verifier con Firebase */}
          <FirebaseRecaptchaVerifierModal
            ref={recaptchaVerifier}
            firebaseConfig={firebaseConfig}
          />
          <Image
            source={require("../../assets/images/LoginFlow2.png")}
            style={styles.imagenAvance}
          />
          <Text style={styles.texto}>
            Introduce el código de 6 dígitos enviado al {phoneNumber}
          </Text>
          {/* Componente para ingresar código SMS */}
          <View style={styles.codigo}>
            <CodigoSMS setCode={setCode} />
          </View>
        </View>
        {/* Botón para reenviar código */}
        <TouchableOpacity
          style={styles.botonChico}
          onPress={() => sendVerification()}
          disabled={!isButtonEnabled}
        >
          {!isButtonEnabled ? (
            <Text
              style={[
                styles.textoBotonChico,
                !isButtonEnabled && { color: "grey" },
              ]}
            >
              No recibí el codigo (Espera {timer} segundos)
            </Text>
          ) : (
            <Text style={styles.textoBotonChico}>No recibí el codigo</Text>
          )}
        </TouchableOpacity>
        {/* Botón para confirmar código o "siguiente" */}
        <TouchableOpacity
          style={styles.botonGrande}
          onPress={() => confirmCode()}
        >
          <Text style={styles.textoBotonGrande}>SIGUIENTE</Text>
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
  imagenAvance: {
    width: 300,
    height: 35,
    alignSelf: "center",
    marginTop: 20,
    position: "absolute",
  },
  container: {
    position: "absolute",
    alignSelf: "center",
    height: 300,
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
    marginTop: 100,
    alignSelf: "center",
    position: "absolute",
  },
  codigo: {
    marginTop: 150,
    alignSelf: "center",
    position: "absolute",
  },
  botonChico: {
    marginTop: 720,
  },
  textoBotonChico: {
    color: "#29364d",
    textAlign: "center",
    fontSize: 14,
    fontWeight: "bold",
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

export default Registro2;
