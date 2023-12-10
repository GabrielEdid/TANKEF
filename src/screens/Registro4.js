// Importaciones de React Native y React
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  Modal,
} from "react-native";
import React, { useState, useContext } from "react";
// Importaciones de Firebase
import { auth } from "../../firebaseConfig";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
// Importaciones de Hooks y Componentes
import { UserContext } from "../hooks/UserContext";
import SpecialInput from "../components/SpecialInput";
import { AntDesign } from "@expo/vector-icons";

const Registro4 = ({ navigation }) => {
  // Estados locales y contexto global
  const { user, setUser } = useContext(UserContext);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Función para crear usuario y manejar el registro
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
    setIsLoading(true); // Activar el indicador de carga
    // Llamada a la API para registrar usuario
    fetch(
      "https://market-web-pr477-x6cn34axca-uc.a.run.app/api/v1/account/registrations",
      {
        // Configuración de la solicitud
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // Datos del usuario a registrar proporcionados por el contexto
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
        // Manejo de respuesta de la API
        if (!response.ok) {
          throw response;
        }
        return response.json();
      })
      .then((data) => {
        // Éxito en la solicitud
        console.log("Success:", data);
        Alert.alert(
          "¡Tu cuenta ha sido creada con éxito!",
          "Checa tu buzon de entrada para confirmar tu correo e inicia sesión.",
          [{ text: "Entendido" }],
          { cancelable: true }
        );
        navigation.navigate("InitialScreen");
      })
      .catch((errorResponse) => {
        // Manejo de errores
        errorResponse.json().then((errorData) => {
          console.error("Error:", errorData);
          // Aquí puedes juntar los mensajes de error en un string
          const errorMessages = Object.values(errorData.errors)
            .flat()
            .join(". ");
          Alert.alert("Error al Registrarse", errorMessages);
        });
        //navigation.navigate("Registro4"); //VERIFICAR SI DEJAR ESTA LINEA O NEL
      })
      .finally(() => {
        setIsLoading(false); // Finalizar el indicador de carga
      });
  };

  // Función para verificar si los campos están completos
  const verificarCampos = () => {
    return user.email !== "" && user.password !== "" && confirmPassword !== "";
  };

  // Función para verificar si las contraseñas son iguales
  const verificarContraseñas = () => {
    return user.password === confirmPassword ? true : false;
  };

  // Manejador para el botón Siguiente
  const handleSiguiente = () => {
    if (!verificarCampos()) {
      // Alerta de campos incompletos
      Alert.alert(
        "Campos Incompletos",
        "Introduce todos tus datos para continuar.",
        [{ text: "Entendido" }],
        { cancelable: true }
      );
    } else if (!verificarContraseñas()) {
      // Alerta de contraseñas no coinciden
      Alert.alert(
        "Contraseñas no Coinciden",
        "Las contraseñas deben coincidir.",
        [{ text: "Entendido" }],
        { cancelable: true }
      );
    } else {
      // Llamada a la creación de usuario
      createUser();
    }
  };

  // Componente visual
  return (
    // Cerrar el teclado cuando se toca fuera de un input
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.background}>
        {/* Logo, Titulo y Regresar */}
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
        {/* Contenedor principal para los campos de entrada, aquí se incluye la Imagen de Avance */}
        <View style={styles.container}>
          <Image
            source={require("../../assets/images/LoginFlow4.png")}
            style={styles.imagenAvance}
          />
          {/* Sección para ingreso de datos y requerimientos de contraseña */}
          <View
            style={{
              marginTop: 75,
              height: 100,
            }}
          >
            {/* Campos de entrada para correo y contraseña */}
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
            {/* Texto informativo sobre requisitos de contraseña */}
            <Text style={styles.texto}>
              * La contraseña debe contener al menos 7 caracteres, incluyendo
              una letra mayúscula, una minúscula, un número y un carácter
              especial.
            </Text>
          </View>
          <Modal transparent={true} animationType="fade" visible={isLoading}>
            <View style={styles.overlay}>
              <ActivityIndicator size="large" color="#2ff690" />
            </View>
          </Modal>
        </View>
        {/* Boton para Crear Cuenta */}
        <TouchableOpacity
          style={styles.botonGrande}
          onPress={() => handleSiguiente()}
          disabled={isLoading}
        >
          <Text style={styles.textoBotonGrande}>CREAR CUENTA</Text>
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
    color: "grey",
    fontSize: 10.5,
    paddingHorizontal: 20,
    position: "absolute",
    marginTop: 180,
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)", // Semi-transparent background
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
