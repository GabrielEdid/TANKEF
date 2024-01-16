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
// Importaciones de Componentes
import DropDown from "../../components/DropDown";
import { AntDesign } from "@expo/vector-icons";

const LoginProgresivo2 = ({ navigation }) => {
  // Estados locales
  const { user, setUser } = useContext(UserContext); //Contexo

  // Función para verificar si los campos están completos
  const verificarCampos = () => {
    return user.ocupacion !== "" && user.estadoCivil !== "";
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
      navigation.navigate("PerfilScreen", {
        screen: "PerfilMain",
      });
    }
  };

  // Manejador para volver a la pantalla anterior
  const handleGoBack = () => {
    // Reinicia los valores del usuario
    setUser({
      ...user,
      ocupacion: "",
      estadoCivil: "",
    });
    navigation.navigate("PerfilScreen", {
      screen: "PerfilMain",
    });
  };

  // Componente visual
  return (
    // Cerrar el teclado cuando se toca fuera de un input
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.background}>
        {/*Titulo*/}
        <View style={styles.tituloContainer}>
          <Text style={styles.titulo}>TANKEF</Text>
        </View>
        <TouchableOpacity onPress={() => handleGoBack()}>
          <AntDesign
            name="arrowleft"
            size={40}
            color="#29364d"
            style={styles.back}
          />
        </TouchableOpacity>
        {/* Contenedor principal para los campos de entrada, aquí se incluye la Imagen de Avance */}
        <View style={{ flex: 1 }}>
          <Text style={styles.texto}>
            ¡Solo faltan un par de datos más{" "}
            <Text style={{ fontWeight: "bold" }}>
              para terminar tu registro!
            </Text>
          </Text>
          <View
            style={styles.container}
            automaticallyAdjustKeyboardInsets={true}
          >
            {/* Campos de entrada para datos del usuario */}
            <DropDown
              field="Estado Civil"
              context="estadoCivil"
              dropdown={"civil"}
            />
            {/* Campo de entrada para la ocupación del usuario, se tiene con view para que no se obstruya */}
            <View style={{ zIndex: -1 }}>
              <DropDown
                field="Ocupación"
                context="ocupacion"
                dropdown={"ocupacion"}
              />
            </View>
          </View>
        </View>
        {/* Botón de Continuar */}
        <TouchableOpacity
          style={styles.botonGrande}
          onPress={() => handleSiguiente()}
        >
          <Text style={styles.textoBotonGrande}>GUARDAR</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

// Estilos de la Pantalla
const styles = StyleSheet.create({
  tituloContainer: {
    height: 105,
    backgroundColor: "white",
  },
  background: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
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
    fontSize: 27,
    color: "#29364d",
    marginTop: 70,
    position: "absolute",
  },
  container: {
    padding: 20,
    marginTop: 15,
    alignSelf: "center",
    width: "100%",
    backgroundColor: "white",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.6,
    shadowRadius: 5,
    elevation: 8,
  },
  texto: {
    fontSize: 18,
    textAlign: "center",
    color: "#29364d",
    alignSelf: "center",
  },
  botonGrande: {
    width: "100%",
    height: 60,
    alignSelf: "center",
    justifyContent: "center",
    backgroundColor: "#29364d",
    borderRadius: 25,
    marginBottom: 20,
    zIndex: -10,
  },
  textoBotonGrande: {
    color: "white",
    textAlign: "center",
    fontSize: 20,
    fontFamily: "conthrax",
  },
});

export default LoginProgresivo2;
