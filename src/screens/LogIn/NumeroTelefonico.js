// Importaciones de React Native y React
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Animated,
} from "react-native";
import React, { useRef, useState, useEffect } from "react";
import CountryPicker from "react-native-country-picker-modal";
// Importaciones de Firebase y mas
import { AsYouType } from "libphonenumber-js";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { firebaseConfig, auth } from "../../../firebaseConfig";
import firebase from "firebase/compat/app";
import { AntDesign, Entypo } from "@expo/vector-icons";

const NumeroTelefonico = ({ navigation }) => {
  // Estados para manejar la información del formulario y la animación
  const [countryCode, setCountryCode] = useState("MX");
  const [callingCode, setCallingCode] = useState("52");
  const [number, setNumber] = useState("");
  const [numberShow, setNumberShow] = useState("");
  const [pickerVisible, setPickerVisible] = useState(false);
  const [verificationId, setVerificationId] = useState("");
  const recaptchaVerifier = useRef(null);

  // Efecto para navegar a la siguiente pantalla al obtener un ID de verificación
  useEffect(() => {
    if (verificationId) {
      // Chequea que verificationId tenga un valor válido
      navigation.navigate("ConfirmNumber", {
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

  // Function to format the phone number as user types
  const formatPhoneNumber = (text, country) => {
    const formatter = new AsYouType(country);
    const formatted = formatter.input(text);
    setNumber(text);
    setNumberShow(formatted);
  };

  // Componente visual
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.contentContainer}>
        {/* Logo y Titulo */}
        <View style={{ marginTop: 140 }}>
          <Image
            source={require("../../../assets/images/Logo.png")}
            style={styles.logo}
          />
          <Text style={styles.title}>
            Introduce un número telefónico de 10 dígitos.
          </Text>
        </View>

        {/* Contenedor principal */}
        <View style={styles.formContainer}>
          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <TouchableOpacity onPress={() => setPickerVisible(true)}>
              <Entypo
                name="chevron-thin-down"
                size={20}
                color="#060B4D"
                style={{ marginRight: 5, marginTop: 7.5 }}
              />
            </TouchableOpacity>

            <CountryPicker
              withFilter
              countryCode={countryCode}
              withCallingCode
              withCloseButton
              onSelect={(country) => {
                const { cca2, callingCode } = country;
                setCountryCode(cca2);
                setCallingCode(callingCode[0]);
                setNumber("");
                setNumberShow("");
              }}
              visible={pickerVisible}
              onClose={() => setPickerVisible(false)}
            />
            <Text style={styles.countryCodeText}>
              +{callingCode} {" |"}
            </Text>
          </View>

          <TextInput
            style={styles.input}
            onChangeText={(text) => formatPhoneNumber(text, countryCode)}
            value={numberShow}
            keyboardType="phone-pad"
            placeholder="00-0000-0000"
            maxLength={15}
            editable={true}
          />
        </View>
        {/* Botones de "tengo cuenta" y "siguiente" */}
        <View style={{ marginBottom: 40 }}>
          <TouchableOpacity
            style={styles.accountButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.accountButtonText}>Ya tengo una cuenta</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => sendVerification()}
          >
            <Text style={styles.buttonText}>Siguiente</Text>
          </TouchableOpacity>
          {/* Re-Captcha Verifier con Firebase */}
        </View>
        <View style={{ position: "absolute" }}>
          <FirebaseRecaptchaVerifierModal
            ref={recaptchaVerifier}
            firebaseConfig={firebaseConfig}
            style={{ position: "absolute", bottom: 0 }}
          />
        </View>
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
    width: 175,
    height: 70,
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
  input: {
    fontSize: 20,
    marginTop: 10,
    fontFamily: "opensans",
    alignSelf: "center",
    textAlign: "center",
    color: "#060B4D",
    marginBottom: -5,
  },
  formContainer: {
    marginTop: -350,
    width: "100%",
    alignSelf: "center",
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "transparent",
    borderBottomColor: "#dfdfe8",
  },
  countryCodeText: {
    fontSize: 20,
    color: "grey",
    fontFamily: "opensanssemibold",
    marginRight: 10,
    marginTop: 5,
  },
  accountButton: {
    marginTop: 20,
    alignItems: "center",
  },
  accountButtonText: {
    color: "#060B4D",
    fontSize: 14,
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
    color: "white",
    padding: 10,
    fontFamily: "opensanssemibold",
    fontSize: 16,
  },
});

export default NumeroTelefonico;
