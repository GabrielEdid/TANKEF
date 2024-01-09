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
import { firebaseConfig, auth } from "../../../firebaseConfig";
import firebase from "firebase/compat/app";
// Importaciones de Componentes y Hooks
import { UserContext } from "../../hooks/UserContext";
import CodigoSMS from "../../components/CodigoSMS";
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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.background}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.back}
        >
          <AntDesign name="arrowleft" size={40} color="#29364d" />
        </TouchableOpacity>
        <View style={styles.contentContainer}>
          <Image
            source={require("../../../assets/images/Logo_Tankef.png")}
            style={styles.logo}
          />
          <Text style={styles.title}>TANKEF</Text>

          <View style={styles.formContainer}>
            <FirebaseRecaptchaVerifierModal
              ref={recaptchaVerifier}
              firebaseConfig={firebaseConfig}
            />
            <Image
              source={require("../../../assets/images/LoginFlow2.png")}
              style={styles.progressImage}
            />
            <Text style={styles.smsText}>
              Introduce el código de 6 dígitos enviado al{" "}
              <Text style={{ fontWeight: "bold" }}>{phoneNumber}</Text>
            </Text>
            <View style={styles.smsInputContainer}>
              <CodigoSMS setCode={setCode} />
            </View>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.resendButton}
            onPress={() => sendVerification()}
            disabled={!isButtonEnabled}
          >
            <Text
              style={[
                styles.resendButtonText,
                !isButtonEnabled && { color: "grey" },
              ]}
            >
              {!isButtonEnabled
                ? `No recibí el código (Espera ${timer} segundos)`
                : "No recibí el código"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.nextButton}
            onPress={() => confirmCode()}
          >
            <Text style={styles.nextButtonText}>SIGUIENTE</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "space-between",
  },
  back: {
    position: "absolute",
    top: 60,
    left: 20,
    zIndex: 10,
  },
  contentContainer: {
    alignItems: "center",
    marginTop: 60,
  },
  logo: {
    width: 90,
    height: 90,
  },
  title: {
    fontFamily: "conthrax",
    fontSize: 25,
    color: "#29364d",
    marginTop: 20,
  },
  formContainer: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.6,
    shadowRadius: 5,
    elevation: 8,
    alignItems: "center",
    padding: 20,
    marginTop: 20,
  },
  progressImage: {
    width: 300,
    height: 35,
    marginTop: 5,
  },
  smsText: {
    fontSize: 16,
    color: "#29364d",
    marginTop: 40,
  },
  smsInputContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    paddingBottom: 30,
  },
  resendButton: {
    marginBottom: 10,
  },
  resendButtonText: {
    color: "#29364d",
    textAlign: "center",
    fontSize: 14,
    fontWeight: "bold",
  },
  nextButton: {
    width: "85%",
    height: 60,
    justifyContent: "center",
    backgroundColor: "#29364d",
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.37,
    shadowRadius: 5,
    elevation: 8,
  },
  nextButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 20,
    fontFamily: "conthrax",
  },
});

export default Registro2;
