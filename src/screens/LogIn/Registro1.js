// Importaciones de React Native y React
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Animated,
} from "react-native";
import React, { useRef, useState, useEffect } from "react";
import CountryPicker from "react-native-country-picker-modal";
// Importaciones de Firebase y mas
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { firebaseConfig, auth } from "../../../firebaseConfig";
import firebase from "firebase/compat/app";
import { AntDesign } from "@expo/vector-icons";

const Registro1 = ({ navigation }) => {
  // Estados para manejar la información del formulario y la animación
  const [countryCode, setCountryCode] = useState("MX");
  const [callingCode, setCallingCode] = useState("52");
  const [number, setNumber] = useState("");
  const [inputFocused, setInputFocused] = useState(false);
  const animatedHeight = useRef(new Animated.Value(0)).current;
  const [pickerVisible, setPickerVisible] = useState(false);
  const [verificationId, setVerificationId] = useState("");
  const recaptchaVerifier = useRef(null);

  // Funciones para manejar el focus del input y la animación
  const handleFocus = () => {
    setInputFocused(true);
    Animated.timing(animatedHeight, {
      toValue: -150, // Valor final de la animación
      duration: 200, // Duración en milisegundos
      useNativeDriver: true,
    }).start();
  };

  const handleBlur = () => {
    setInputFocused(false);
    Animated.timing(animatedHeight, {
      toValue: 0, // Vuelve a la posición original
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  // Efecto para navegar a la siguiente pantalla al obtener un ID de verificación
  useEffect(() => {
    if (verificationId) {
      // Chequea que verificationId tenga un valor válido
      navigation.navigate("Registro2", {
        callingCode,
        number,
        verificationId,
      });
    }
  }, [verificationId]);

  // Función para enviar la verificación del número de teléfono
  const sendVerification = () => {
    const phoneProvider = new firebase.auth.PhoneAuthProvider();
    phoneProvider
      .verifyPhoneNumber("+" + callingCode + number, recaptchaVerifier.current)
      .then(setVerificationId);
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
          {/* Logo, Titulo e Imagen de Avance */}
          <View style={styles.header}>
            <Image
              source={require("../../../assets/images/Logo_Tankef.png")}
              style={styles.logo}
            />
            <Text style={styles.title}>TANKEF</Text>
            <Image
              source={require("../../../assets/images/LoginFlow1.png")}
              style={styles.progressImage}
            />
          </View>

          {/* Contenedor principal */}
          <Animated.View
            style={[
              styles.formContainer,
              { transform: [{ translateY: animatedHeight }] },
            ]}
          >
            {/* Re-Captcha Verifier con Firebase */}
            <FirebaseRecaptchaVerifierModal
              ref={recaptchaVerifier}
              firebaseConfig={firebaseConfig}
            />
            <Text style={styles.welcomeText}>Bienvenido a TANKEF</Text>

            {/* Boton para Seleccionar Pais */}
            <View style={styles.countryPickerContainer}>
              <TouchableOpacity
                style={styles.countryButton}
                onPress={() => setPickerVisible(true)}
              >
                <AntDesign name="caretdown" size={20} color="grey" />
                <CountryPicker
                  withFilter
                  countryCode={countryCode}
                  withCallingCode
                  withCloseButton
                  onSelect={(country) => {
                    const { cca2, callingCode } = country;
                    setCountryCode(cca2);
                    setCallingCode(callingCode[0]);
                  }}
                  visible={pickerVisible}
                  onClose={() => setPickerVisible(false)}
                />
              </TouchableOpacity>

              {/* Campo de entrada para el número de teléfono */}
              <View style={styles.phoneNumberContainer}>
                <Text style={styles.countryCodeText}>
                  +{callingCode} {" |"}
                </Text>
                <TextInput
                  style={styles.phoneNumberInput}
                  keyboardType="numeric"
                  value={number}
                  placeholder={"55 1234 5678"}
                  onChangeText={(text) => setNumber(text)}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </View>
            </View>

            {/* Botones de "tengo cuenta" y "siguiente" */}
            <TouchableOpacity
              style={styles.accountButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.accountButtonText}>Ya tengo una cuenta</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.nextButton}
              onPress={() => sendVerification()}
            >
              <Text style={styles.nextButtonText}>SIGUIENTE</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
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
  progressImage: {
    width: 300,
    height: 35,
    marginTop: 50,
  },
  formContainer: {
    backgroundColor: "white",
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.37,
    shadowRadius: 5,
    elevation: 8,
    alignItems: "center",
    paddingBottom: 30,
  },
  welcomeText: {
    fontSize: 19,
    fontFamily: "conthrax",
    color: "#29364d",
    textAlign: "center",
  },
  countryPickerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    width: "100%",
  },
  countryButton: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#29364d",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 15,
    padding: 5,
    flex: 1,
    marginRight: "2%",
  },
  countryPicker: {
    backgroundColor: "transparent",
  },
  phoneNumberContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#29364d",
    borderWidth: 1,
    borderRadius: 15,
    padding: 5,
    flex: 3.5,
    marginLeft: 10,
    height: 55,
  },
  countryCodeText: {
    fontSize: 18,
    color: "grey",
    marginRight: 10,
  },
  phoneNumberInput: {
    fontSize: 18,
    color: "#29364d",
    flex: 1,
  },
  accountButton: {
    marginTop: 20,
    alignItems: "center",
  },
  accountButtonText: {
    color: "#29364d",
    fontSize: 14,
    fontWeight: "bold",
  },
  nextButton: {
    marginTop: 10,
    width: "100%", // Usa un ancho del 100% para este botón
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

export default Registro1;
