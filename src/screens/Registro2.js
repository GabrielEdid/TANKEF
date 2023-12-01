import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Alert
} from "react-native";
import React, {useState, useRef} from "react";
import { AntDesign } from "@expo/vector-icons";
import CodigoSMS from "../components/CodigoSMS";
import firebase from 'firebase/compat/app';

const Registro2 = ({ navigation, route }) => {
  const { callingCode, number, verificationId } = route.params;
  const phoneNumber = "+" + callingCode + " " + number;
  const [code, setCode] = useState('');


  const recaptchaVerifier = useRef(null);

  const sendVerification = () => {
      const phoneProvider = new firebase.auth.PhoneAuthProvider();
      phoneProvider
        .verifyPhoneNumber("+"+callingCode+number, recaptchaVerifier.current)
        .then(verificationId);
  };

  const confirmCode = () => {
    const credential = firebase.auth.PhoneAuthProvider.credential(
      verificationId,
      code
    );
    firebase
      .auth()
      .signInWithCredential(credential)
      .then(() => {
        setCode('');
        navigation.navigate("Registro3");
    })
    .catch((error) => {
      // show an alert in case of error
      alert(error);
    })
    
};

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.background}>
        {/* Logo, Titulo y Avance */}
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
        <View style={styles.container}>
          <Image
            source={require("../../assets/images/LoginFlow2.png")}
            style={styles.imagenAvance}
          />
          <Text style={styles.texto}>
            Introduce el código de 6 dígitos enviado al {phoneNumber}
          </Text>
          <View style={styles.codigo}>
            <CodigoSMS />
          </View>
        </View>
        <TouchableOpacity style={styles.botonChico} onPress={()=> sendVerification}>
          <Text style={styles.textoBotonChico}>No recibí el codigo</Text>
        </TouchableOpacity>
        {/* Boton Craer Cuenta */}
        <TouchableOpacity
          style={styles.botonGrande}
          onPress={() =>
            confirmCode()}
        >
          <Text style={styles.textoBotonGrande}>SIGUIENTE</Text>
        </TouchableOpacity>
      </View>
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
