import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useState, useContext } from "react";
import { UserContext } from "../hooks/UserContext";
import AsyncStorage from "../hooks/AsyncStorage";
import { auth } from "../../firebaseConfig";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { AntDesign } from "@expo/vector-icons";
import SpecialInput from "../components/SpecialInput";

const Registro4 = ({ navigation }) => {
  const { user, setUser } = useContext(UserContext);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const createUser = async () => {
    /*setIsLoading(true);
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        user.email,
        user.password
      );
      const newUser = response.user;
      setUser({ ...user, FireBaseUIDMail: newUser.uid });
      sendEmailVerification(newUser);
      Alert.alert(
        "Correo de Confirmación Enviado",
        "Checa tu buzon de entrada para confirmar tu correo.",
        [{ text: "Entendido" }],
        { cancelable: true }
      );
      navigation.navigate("SetPinPad");
    } catch (error) {
      console.log(error);
      alert("Registration Failed: " + error.message);
      navigation.navigate("Registro4");
    }*/
    setIsLoading(true);
    fetch(
      "https://market-web-pr477-x6cn34axca-uc.a.run.app/api/v1/account/registrations",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          account_registration: {
            email: user.email,
            email_confirmation: user.email,
            password: user.password,
            password_confirmation: user.password,
            full_name: user.nombre,
            last_name_1: user.apellidoPaterno,
            last_name_2: user.apellidoMaterno,
            dob: user.fechaNacimiento,
            curp: user.CURP,
            phone: user.telefono,
          },
        }),
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw response;
        }
        return response.json();
      })
      .then((data) => {
        console.log("Success:", data);
        Alert.alert(
          "Correo de Confirmación Enviado",
          "Checa tu buzon de entrada para confirmar tu correo.",
          [{ text: "Entendido" }],
          { cancelable: true }
        );
        navigation.navigate("SetPinPad");
      })
      .catch((errorResponse) => {
        errorResponse.json().then((errorData) => {
          console.error("Error:", errorData);
          // Aquí puedes juntar los mensajes de error en un string
          const errorMessages = Object.values(errorData.errors)
            .flat()
            .join(". ");
          Alert.alert("Error al Registrarse", errorMessages);
        });
        navigation.navigate("Registro4");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const verificarCampos = () => {
    return user.email !== "" && user.password !== "" && confirmPassword !== "";
  };

  const verificarContraseñas = () => {
    return user.password === confirmPassword ? true : false;
  };

  const handleSiguiente = () => {
    if (!verificarCampos()) {
      Alert.alert(
        "Campos Incompletos",
        "Introduce todos tus datos para continuar.",
        [{ text: "Entendido" }],
        { cancelable: true }
      );
    } else if (!verificarContraseñas()) {
      Alert.alert(
        "Contraseñas no Coinciden",
        "Las contraseñas deben coincidir.",
        [{ text: "Entendido" }],
        { cancelable: true }
      );
    } else {
      navigation.navigate("SetPinPad");
      createUser();
    }
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
            source={require("../../assets/images/LoginFlow4.png")}
            style={styles.imagenAvance}
          />
          {/* Entradas de Input */}
          <View
            style={{
              marginTop: 75,
              height: 100,
            }}
          >
            <SpecialInput field="Correo" editable={true} context={"email"} />
            <SpecialInput
              field="Contraseña"
              editable={true}
              password={true}
              context={"password"}
            />
            <SpecialInput
              field="Confirmar Contraseña"
              set={setConfirmPassword}
              editable={true}
              password={true}
              context={"confirmPassword"}
            />
            <Text style={styles.texto}>
              * La contraseña debe contener al menos 7 caracteres, incluyendo
              una letra mayúscula, una minúscula, un número y un carácter
              especial.
            </Text>
          </View>
        </View>
        {/* Boton Craer Cuenta */}
        <TouchableOpacity
          style={styles.botonGrande}
          onPress={() => handleSiguiente()}
          disabled={isLoading}
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
    color: "grey",
    fontSize: 10.5,
    paddingHorizontal: 20,
    position: "absolute",
    marginTop: 180,
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

export default Registro4;
