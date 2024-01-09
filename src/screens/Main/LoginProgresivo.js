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
import React, { useState, useEffect } from "react";
// Importaciones de Componentes
import SpecialInput from "../../components/SpecialInput";
import { AntDesign } from "@expo/vector-icons";

const LoginProgresivo = ({ navigation }) => {
  // Estados locales

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
    // Cerrar el teclado cuando se toca fuera de un input
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.background}>
        {/* Logo, Titulo y Regresar */}
        <TouchableOpacity onPress={() => handleGoBack()}>
          <AntDesign
            name="arrowleft"
            size={40}
            color="#29364d"
            style={styles.back}
          />
        </TouchableOpacity>
        <Image
          source={require("../../../assets/images/Logo_Tankef.png")}
          style={styles.imagen}
        />
        <Text style={styles.titulo}>TANKEF</Text>
        {/* Contenedor principal para los campos de entrada, aquí se incluye la Imagen de Avance */}
        <View style={styles.container}>
          <Image
            source={require("../../../assets/images/LoginFlow3.png")}
            style={styles.imagenAvance}
          />
          {/* Sección de campos de entrada */}
          <View
            style={{
              marginTop: 75,
              height: 100,
            }}
            automaticallyAdjustKeyboardInsets={true}
          >
            {/* Campos de entrada para datos del usuario */}
            <SpecialInput field="Nombre(s)" context="nombre" editable={true} />
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
            {/* Campos de información generados a partir del CURP */}
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
        {/* Botón de Continuar */}
        <TouchableOpacity
          style={styles.botonGrande}
          onPress={() => handleSiguiente()}
        >
          <Text style={styles.textoBotonGrande}>SIGUIENTE</Text>
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
    height: 520,
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

export default LoginProgresivo;
