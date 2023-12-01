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
} from "react-native";
import React, { useRef, useState } from 'react'
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { firebaseConfig, auth } from '../../firebaseConfig'
import firebase from 'firebase/compat/app';
import CountryPicker from "react-native-country-picker-modal";
import { AntDesign } from "@expo/vector-icons";

const Registro1 = ({ navigation }) => {
  const [countryCode, setCountryCode] = useState("MX");
  const [callingCode, setCallingCode] = useState("52");
  const [number, setNumber] = useState("");
  const [pickerVisible, setPickerVisible] = useState(false);


  
    
  const [verificationId, setVerificationId] = useState(null);
  const recaptchaVerifier = useRef(null);

  const sendVerification = () => {
      const phoneProvider = new firebase.auth.PhoneAuthProvider();
      phoneProvider
        .verifyPhoneNumber("+"+callingCode+number, recaptchaVerifier.current)
        .then(setVerificationId);
  };

    
  /*const sendOTP = async () => {
    try {
      const appVerifier = new RecaptchaVerifier(auth, "recaptcha", {});
      const confirmation = await signInWithPhoneNumber(
        auth,
        "+525568182757",
        appVerifier
      );
      console.log(confirmation);
    } catch (error) {
      console.error(error);
    }
  };*/

  /* // If null, no SMS has been sent
  const [confirm, setConfirm] = useState(null);

  // verification code (OTP - One-Time-Passcode)
  const [code, setCode] = useState("");

  // Handle login
  function onAuthStateChanged(user) {
    if (user) {
      // Some Android devices can automatically process the verification code (OTP) message, and the user would NOT need to enter the code.
      // Actually, if he/she tries to enter it, he/she will get an error message because the code was already used in the background.
      // In this function, make sure you hide the component(s) for entering the code and/or navigate away from this screen.
      // It is also recommended to display a message to the user informing him/her that he/she has successfully logged in.
    }
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  // Handle the button press
  async function signInWithPhoneNumber(phoneNumber) {
    const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
    setConfirm(confirmation);
  }

  async function confirmCode() {
    try {
      await confirm.confirm(code);
    } catch (error) {
      console.log("Invalid code.");
    }
  }*/

  return (
    //Imagen de Fondo
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <ImageBackground
        source={require("../../assets/images/Fondo.png")}
        style={styles.background}
      >
        {/* Logo, Titulo y Avance */}
        <Image
          source={require("../../assets/images/Logo_Tankef.png")}
          style={styles.imagen}
        />
        <Text style={styles.titulo}>TANKEF</Text>
        <Image
          source={require("../../assets/images/LoginFlow1.png")}
          style={styles.imagenAvance}
        />
        {/* Fin Logo, Titulo y Avance */}
        {/* Contenedor */}
        <View style={styles.container}>
          <FirebaseRecaptchaVerifierModal
                  ref={recaptchaVerifier}
                  firebaseConfig={firebaseConfig}
              />
          <Text style={styles.bienvenida}>Bienvenido a TANKEF</Text>
          {/* Seleccionar Pais */}
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
          {/* Visualizacion de Codigo de Celular y Telefono */}
          <View style={styles.inputContainer}>
            <Text>
              <Text style={{ fontSize: 18, color: "grey" }}>
                +{callingCode}{" "}
              </Text>
              <Text
                style={{ fontSize: 30, color: "#29364d", letterSpacing: 5 }}
              >
                {" "}
                |
              </Text>
            </Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={number}
              placeholder={"55 1234 5678"}
              onChangeText={(text) => setNumber(text)}
            />
          </View>
          {/* Boton Tengo Cuenta */}
          <TouchableOpacity
            style={styles.botonTengoCuenta}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.textoBoton}>Ya tengo una cuenta</Text>
          </TouchableOpacity>
          {/* Boton Craer Cuenta */}
          <TouchableOpacity
            style={styles.boton}
            onPress={() =>
              [sendVerification(),
              navigation.navigate("Registro2", { callingCode, number, verificationId })]
            }
          >
            <Text style={styles.textoBotonCuenta}>CREAR CUENTA</Text>
          </TouchableOpacity>
        </View>
        {/* Fin Contenedor */}
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
};

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
    marginTop: 220,
    position: "absolute",
  },
  container: {
    marginTop: 600,
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
