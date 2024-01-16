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
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
// Importaciones de Hooks
import { UserContext } from "../../hooks/UserContext";
import { ChecarCURP } from "../../hooks/ChecarCURP";
// Importaciones de Componentes
import SpecialInput from "../../components/SpecialInput";
import { AntDesign } from "@expo/vector-icons";

const Registro3 = ({ navigation }) => {
  // Estados locales y contexto global
  const { user, setUser } = useContext(UserContext);
  const [isCurpVerified, setIsCurpVerified] = useState(false);

  // Función para verificar si los campos están completos
  const verificarCampos = () => {
    return (
      user.nombre !== "" &&
      user.apellidoPaterno !== "" &&
      user.apellidoMaterno !== "" &&
      user.CURP !== "" &&
      user.CURP !== "CURP Invalido" &&
      user.fechaNacimiento !== "" &&
      user.fechaNacimiento !== "CURP Invalido" &&
      user.estadoNacimiento !== "" &&
      user.estadoNacimiento !== "CURP incorrecto" &&
      user.sexo !== "" &&
      user.sexo !== "CURP Invalido"
    );
  };

  // Manejador para el botón Siguiente
  const handleSiguiente = () => {
    if (!verificarCampos()) {
      Alert.alert(
        "Campos Incompletos",
        "Introduce todos tus datos para continuar.",
        [{ text: "Entendido" }],
        { cancelable: true }
      );
    } else {
      navigation.navigate("Registro4");
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
    });
    navigation.navigate("Registro1");
  };

  // Efecto para verificar el CURP y actualizar el estado en el contexto global
  useEffect(() => {
    if (user.CURP && user.CURP.length === 18) {
      const { fechaNacimiento, sexo, estadoNacimiento } = ChecarCURP(user.CURP);
      setUser({
        ...user,
        fechaNacimiento,
        sexo,
        estadoNacimiento,
      });
      setIsCurpVerified(true);
    } else if (isCurpVerified && user.CURP && user.CURP.length !== 18) {
      setUser({
        ...user,
        fechaNacimiento: "CURP Invalido",
        sexo: "CURP Invalido",
        estadoNacimiento: "CURP Invalido",
      });
    }
  }, [user.CURP, setUser]);

  // Componente visual
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.background}>
        <TouchableOpacity onPress={() => handleGoBack()} style={styles.back}>
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
          <View style={styles.formContainer}>
            <Image
              source={require("../../../assets/images/LoginFlow3.png")}
              style={styles.progressImage}
            />
            <View style={styles.inputContainer}>
              <SpecialInput
                field="Nombre(s)"
                context="nombre"
                editable={true}
              />
              <SpecialInput
                field="Apellido Paterno"
                context="apellidoPaterno"
                editable={true}
              />
              <SpecialInput
                field="Apellido Materno"
                context="apellidoMaterno"
                editable={true}
              />
              <SpecialInput field="CURP" context="CURP" editable={true} />
              <SpecialInput
                field="Fecha de Nacimiento"
                context="fechaNacimiento"
                editable={false}
              />
              <SpecialInput
                field="Estado de Nacimiento"
                context="estadoNacimiento"
                editable={false}
              />
              <SpecialInput field="Sexo" context="sexo" editable={false} />
            </View>
          </View>
        </View>

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

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "white",
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

export default Registro3;
