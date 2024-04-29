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
  Modal,
} from "react-native";
import React, { useState, useContext, useEffect } from "react";
import { ActivityIndicator } from "react-native-paper";
// Importaciones de Hooks y Componentes
import { APIPost } from "../../API/APIService";
import { UserContext } from "../../hooks/UserContext";
import SpecialInput from "../../components/SpecialInput";
import { AntDesign } from "@expo/vector-icons";

const Registro4 = ({ navigation }) => {
  // Estados locales y contexto global
  const { user, setUser } = useContext(UserContext);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [gender, setGender] = useState(""); // Para cambiar el sexo de la persona a como pide el backend

  // useEffect para cambiar el sexo de la persona a como pide el backend
  useEffect(() => {
    if (user.sexo === "Hombre") {
      setGender("male");
    } else if (user.sexo === "Mujer") {
      setGender("female");
    }
  }, [user.sexo]);

  // Función para crear usuario y manejar el registro
  const createUser = async () => {
    setIsLoading(true); // Activar el indicador de carga

    const url = "/api/v1/account/registrations";
    const body = {
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
        gender: gender,
        born_state: user.estadoNacimiento,
      },
    };

    const result = await APIPost(url, body);

    if (result.error) {
      console.error("Error:", result.error);
      // Manejo de errores
      const errorMessages = result.error.errors
        ? Object.values(result.error.errors).flat().join(". ")
        : result.error;
      Alert.alert("Error al Registrarse", errorMessages);
    } else {
      // Éxito en la solicitud
      console.log("Success:", result.data);
      Alert.alert(
        "¡Tu cuenta ha sido creada con éxito!",
        "Checa tu buzon de entrada para confirmar tu correo e inicia sesión.",
        [{ text: "Entendido" }],
        { cancelable: true }
      );
      navigation.navigate("InitialScreen");
    }

    setIsLoading(false); // Finalizar el indicador de carga
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

  // Manejador para volver a la pantalla anterior
  const handleGoBack = () => {
    // Reinicia los valores del usuario
    setUser({
      ...user,
      nombre: "",
      apellidoPaterno: "",
      apellidoMaterno: "",
      CURP: "",
      fechaNacimiento: "",
      sexo: "",
      estadoNacimiento: "",
      email: "",
      password: "",
    });
    navigation.navigate("Registro3");
  };

  // Componente visual
  return (
    // Cerrar el teclado cuando se toca fuera de un input
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.background}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.back}
        >
          <AntDesign name="arrowleft" size={40} color="#29364d" />
        </TouchableOpacity>
        <View>
          <View style={styles.header}>
            <Image
              source={require("../../../assets/images/Logo_Tankef.png")}
              style={styles.logo}
            />
            <Text style={styles.title}>TANKEF</Text>
          </View>
          {/* Contenedor principal para los campos de entrada, aquí se incluye la Imagen de Avance */}
          <View style={styles.formContainer}>
            <Image
              source={require("../../../assets/images/LoginFlow4.png")}
              style={styles.progressImage}
            />
            <View style={styles.inputContainer}>
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
                * La contraseña debe contener al menos 8 caracteres, incluyendo
                una letra mayúscula, una minúscula, un número y un carácter
                especial.
              </Text>
            </View>
            <Modal transparent={true} animationType="fade" visible={isLoading}>
              <View style={styles.overlay}>
                <ActivityIndicator size={75} color="#060B4D" />
              </View>
            </Modal>
          </View>
        </View>
        {/* Boton para Crear Cuenta */}
        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => handleSiguiente()}
        >
          <Text style={styles.nextButtonText}>SIGUIENTE</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

// Estilos de la Pantalla
const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "white",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  back: {
    position: "absolute",
    top: 60,
    left: 20,
    zIndex: 100,
  },
  header: {
    marginTop: 60,
    alignItems: "center",
    width: "100%", // Asegura que el header tome el ancho completo
  },
  logo: {
    width: 90,
    height: 90,
  },
  title: {
    fontFamily: "conthrax",
    fontSize: 25,
    color: "#29364d",
    marginTop: 10,
  },
  formContainer: {
    width: "85%",
    borderRadius: 15,
    padding: 20,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.6,
    shadowRadius: 5,
    elevation: 8,
    alignItems: "center",
    alignSelf: "center",
    marginTop: 20,
  },
  progressImage: {
    width: 300,
    height: 35,
  },
  inputContainer: {
    marginTop: 20,
    width: "100%", // Asegura que tome el ancho completo del formContainer
  },
  texto: {
    color: "grey",
    fontSize: 10.5,
    paddingHorizontal: 20,
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
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
    alignSelf: "center",
    marginBottom: 30,
  },
  nextButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 20,
    fontFamily: "conthrax",
  },
});

export default Registro4;
