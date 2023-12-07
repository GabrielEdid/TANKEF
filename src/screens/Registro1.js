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
import { firebaseConfig, auth } from "../../firebaseConfig";
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
    // Cerrar el teclado cuando se toca fuera de un input
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      {/* Contenedor del fondo */}
      <ImageBackground
        source={require("../../assets/images/Fondo.png")}
        style={styles.background}
      >
        {/* Logo, Titulo e Imagen de Avance */}
        <Image
          source={require("../../assets/images/Logo_Tankef.png")}
          style={styles.imagen}
        />
        <Text style={styles.titulo}>TANKEF</Text>
        <Image
          source={require("../../assets/images/LoginFlow1.png")}
          style={styles.imagenAvance}
        />
        {/* Contenedor principal */}
        <Animated.View
          style={[
            styles.container,
            { transform: [{ translateY: animatedHeight }] },
          ]}
        >
          {/* Re-Captcha Verifier con Firebase */}
          <FirebaseRecaptchaVerifierModal
            ref={recaptchaVerifier}
            firebaseConfig={firebaseConfig}
          />
          <Text style={styles.bienvenida}>Bienvenido a TANKEF</Text>
          {/* Boton para Seleccionar Pais */}
          <TouchableOpacity
            style={styles.botonPais}
            onPress={() => setPickerVisible(true)}
          >
            <AntDesign
              name="caretdown"
              size={20}
              color="black"
              style={{ position: "absolute", right: 60, top: 12 }}
            />
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
          {/* Botones y campos de entrada para seleccionar el país y el número de teléfono */}
          <View style={styles.inputContainer}>
            {/* Manejo del country code al lado del telefono y la barra "|" */}
            <Text>
              <Text style={{ fontSize: 18, color: "grey" }}>
                +{callingCode}
              </Text>
              <Text
                style={{ fontSize: 30, color: "#29364d", letterSpacing: 5 }}
              >
                {" |"}
              </Text>
            </Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={number}
              placeholder={"55 1234 5678"}
              onChangeText={(text) => setNumber(text)}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </View>
          {/* Botones de "tengo cuenta" y "siguiente" */}
          <TouchableOpacity
            style={styles.botonTengoCuenta}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.textoBoton}>Ya tengo una cuenta</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.boton}
            onPress={() => sendVerification()}
          >
            <Text style={styles.textoBotonCuenta}>SIGUIENTE</Text>
          </TouchableOpacity>
        </Animated.View>
      </ImageBackground>
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
  imagenAvance: {
    width: 300,
    height: 35,
    alignSelf: "center",
    marginTop: 230,
    position: "absolute",
  },
  container: {
    marginTop: 600,
    height: 300,
    backgroundColor: "white",
    flex: 1,
  },
  bienvenida: {
    marginTop: 20,
    fontSize: 19,
    fontFamily: "conthrax",
    color: "#29364d",
    alignSelf: "center",
    position: "absolute",
  },
  botonPais: {
    marginTop: 60,
    left: 22,
    height: 50,
    width: 96,
    alignItems: "center",
    borderColor: "#29364d",
    borderWidth: 1,
    borderRadius: 15,
    position: "absolute",
    paddingTop: 5,
    paddingLeft: 30,
  },
  inputContainer: {
    marginTop: 60,
    left: 135,
    height: 50,
    width: 230,
    borderColor: "#29364d",
    borderWidth: 1,
    borderRadius: 15,
    position: "absolute",
    padding: 3,
    paddingLeft: 6,
  },
  input: {
    fontSize: 18,
    backgroundColor: "white",
    color: "#29364d",
    position: "absolute",
    marginTop: 15,
    marginLeft: 90,
  },
  botonTengoCuenta: {
    marginTop: 120,
  },
  textoBoton: {
    color: "#29364d",
    textAlign: "center",
    fontSize: 14,
    fontWeight: "bold",
  },
  boton: {
    marginTop: 150,
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
});

export default Registro1;
