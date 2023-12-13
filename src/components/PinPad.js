// Importaciones de React Native y React
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
// Importacion de Hooks y Componentes
import * as LocalAuthentication from "expo-local-authentication";
import { useNavigation } from "@react-navigation/native";
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";

/**
 * Componente PinPad: Permite al usuario ingresar un PIN.
 *
 * Props:
 * - id: Booleano que indica si se debe mostrar la opción de autenticación biométrica.
 * - get: Función para obtener el valor actual del PIN.
 * - set: Función para actualizar el valor del PIN.
 */

const PinPad = ({ ...props }) => {
  const navigation = useNavigation();

  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Agrega un dígito al PIN actual
  const addDigit = (digit) => {
    if (props.get.length < 6) {
      props.set((prevPin) => prevPin + digit);
    }
  };

  // Elimina el último dígito del PIN actual
  const removeLastDigit = () => {
    props.set((prevPin) => prevPin.slice(0, -1));
  };

  // Navega a la pantalla inicial en caso de olvidar el PIN
  const onForgotPin = () => {
    Alert.alert(
      "Recuperación de PIN",
      "Porfavor vuelve a iniciar sesión para recuperar tu PIN"
    );
    navigation.navigate("InitialScreen");
  };

  // Maneja la autenticación biométrica
  /*const handleAuthentication = async () => {
    try {
      // Checa si el dispositivo es compatible
      const isCompatible = await LocalAuthentication.hasHardwareAsync();

      if (!isCompatible) {
        throw new Error("Tu dispositivo no es compatible.");
      }

      // Checa si el dispositivo tiene huellas o reconocimiento facial
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!isEnrolled) {
        throw new Error("No se han encontrado Caras/Dedos para autenticar.");
      }

      // Autentica al usuario
      await LocalAuthentication.authenticateAsync();

      Alert.alert("Autenticado", "Bienvenido de vuelta!");
      navigation.navigate("Main");
    } catch (error) {
      Alert.alert("Ha ocurrido un error", error?.message);
    }
  };*/

  useEffect(() => {
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricSupported(compatible);
    })();
  });

  function handleAuthentication() {
    const auth = LocalAuthentication.authenticateAsync({
      promptMessage: "Authenticate",
      fallbackLabel: "Enter Password",
    });
    auth.then((result) => {
      setIsAuthenticated(result.success);
      console.log(result);
      if (result.success === true) {
        Alert.alert("Autenticado", "Bienvenido de vuelta!");
        navigation.navigate("Main");
      }
    });
  }

  // Renderiza los indicadores del PIN (las bolitas que se llenan)
  const renderPinIndicators = () => {
    const indicators = [];
    for (let i = 0; i < 6; i++) {
      indicators.push(
        <View
          key={i}
          style={[
            styles.pinIndicator,
            props.get.length > i && styles.pinIndicatorFilled,
          ]}
        />
      );
    }
    return indicators;
  };

  // Renderiza el componente
  return (
    <View style={styles.background}>
      {/* Logo y Titulo */}
      <Image
        source={require("../../assets/images/Logo_Tankef.png")}
        style={styles.imagen}
      />
      <Text style={styles.titulo}>TANKEF</Text>
      {/* Indicadores de PIN */}
      <View style={styles.pinContainer}>{renderPinIndicators()}</View>

      {/* Teclado numérico */}
      {Array.from({ length: 3 }, (_, rowIndex) => (
        <View key={rowIndex} style={styles.keypadRow}>
          {Array.from({ length: 3 }, (_, buttonIndex) => {
            const digit = rowIndex * 3 + buttonIndex + 1;
            return (
              <TouchableOpacity
                key={digit}
                style={styles.keypadButton}
                onPress={() => addDigit(digit.toString())}
              >
                <Text style={styles.keypadButtonText}>{digit}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
      <View style={styles.keypadRow}>
        {/* Botón de autenticación biométrica, solo activada con el prop id */}
        <TouchableOpacity
          style={styles.keypadButton}
          onPress={handleAuthentication}
        >
          {props.id === true ? (
            <Ionicons name="finger-print-outline" size={30} color="#29364d" />
          ) : null}
        </TouchableOpacity>
        {/* Botón para añadir el dígito '0' */}
        <TouchableOpacity
          style={styles.keypadButton}
          onPress={() => addDigit("0")}
        >
          <Text style={styles.keypadButtonText}>0</Text>
        </TouchableOpacity>
        {/* Botón para borrar el último dígito */}
        <TouchableOpacity style={styles.keypadButton} onPress={removeLastDigit}>
          <Feather name="delete" size={30} color="#29364d" />
        </TouchableOpacity>
      </View>
      {/* Opción para recuperar PIN olvidado, solo activada con el prop id */}
      {props.id === true ? (
        <TouchableOpacity onPress={onForgotPin}>
          <Text style={styles.forgotPinText}>Olvidé mi PIN</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

// Estilos del componente
const styles = StyleSheet.create({
  background: {
    alignItems: "center",
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
    fontSize: 30,
    color: "#29364d",
    marginTop: 160,
    alignSelf: "center",
    position: "absolute",
  },
  pinContainer: {
    flexDirection: "row",
    marginTop: 240,
    marginBottom: 48,
  },
  pinIndicator: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    borderWidth: 1,
    borderColor: "#29364d",
    margin: 15,
  },
  pinIndicatorFilled: {
    backgroundColor: "#29364d",
  },
  keypadRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginBottom: 24,
  },
  keypadButton: {
    width: 75,
    height: 75,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
  keypadButtonText: {
    fontSize: 35,
    fontFamily: "conthrax",
    color: "#29364d",
  },
  forgotPinText: {
    fontSize: 16,
    color: "#29364d",
    textDecorationLine: "underline",
    marginTop: 24,
  },
});

export default PinPad;
