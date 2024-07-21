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

const ConfirmNumber = ({ navigation, route }) => {
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
        navigation.navigate("RegistroDatos");
      })
      .catch((error) => {
        alert(error);
      });
  };

  // Función para enmascarar los dígitos del número de teléfono
  const maskNumber = (str) => {
    if (str.length <= 4) {
      return str;
    }
    const maskedSection = str.slice(0, -4).replace(/./g, "*");
    const visibleSection = str.slice(-4);
    return maskedSection + visibleSection;
  };

  // Function to format time in seconds to "0:MM"
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`; // Pads seconds with a leading zero if needed
  };

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setIsButtonEnabled(true); // Enable button when countdown finishes
    }
  }, [timer]);

  // Componente visual
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.contentContainer}>
        {/* Logo y Titulo */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.back}
        >
          <AntDesign name="arrowleft" size={40} color="#060B4D" />
        </TouchableOpacity>
        <View style={{ marginTop: 140 }}>
          <Image
            source={require("../../../assets/images/Logo.png")}
            style={styles.logo}
          />
          <Text style={styles.title}>
            Introduce el código de 6 dígitos enviado al{" "}
            <Text style={{ fontWeight: "bold" }}>
              {maskNumber(phoneNumber)}
            </Text>
          </Text>
        </View>

        <View style={styles.smsInputContainer}>
          <CodigoSMS setCode={setCode} />
          <Text style={styles.text}>¡No recibí el código!</Text>
          {timer > 0 && <Text style={styles.text}>{formatTime(timer)}</Text>}
          <TouchableOpacity
            style={[
              styles.resendButton,
              { borderColor: !isButtonEnabled ? "#b5b6c9" : "#060B4D" },
            ]}
            onPress={() => sendVerification()}
            disabled={!isButtonEnabled}
          >
            <Text
              style={[
                styles.resendButtonText,
                { color: !isButtonEnabled ? "#b5b6c9" : "#060B4D" },
              ]}
            >
              Reenviar código
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={() => confirmCode()}>
          <Text style={styles.buttonText}>Siguiente</Text>
        </TouchableOpacity>
        <View style={{ position: "absolute" }}>
          <FirebaseRecaptchaVerifierModal
            ref={recaptchaVerifier}
            firebaseConfig={firebaseConfig}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  back: {
    position: "absolute",
    top: 60,
    left: 20,
    zIndex: 10,
  },
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
    marginTop: 60,
    fontSize: 20,
    color: "white",
    fontFamily: "opensans",
    color: "#060B4D",
  },
  smsInputContainer: {
    marginTop: -330,
  },
  resendButton: {
    alignSelf: "center",
    marginTop: 10,
    padding: 10,
    width: 180,
    borderWidth: 2,
    borderRadius: 100,
  },
  resendButtonText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  text: {
    color: "#060B4D",
    fontSize: 16,
    textAlign: "center",
    fontFamily: "opensans",
  },
  button: {
    marginBottom: 40,
    backgroundColor: "#060B4D",
    width: "100%",
    alignSelf: "center",
    borderRadius: 5,
  },
  buttonText: {
    alignSelf: "center",
    color: "white",
    padding: 10,
    fontFamily: "opensanssemibold",
    fontSize: 16,
  },
});

export default ConfirmNumber;
