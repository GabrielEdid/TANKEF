import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

const PinPad = ({ navigation }) => {
  const [pin, setPin] = useState("");

  const addDigit = (digit) => {
    if (pin.length < 4) {
      setPin((prevPin) => prevPin + digit);
    }
  };

  const removeLastDigit = () => {
    setPin((prevPin) => prevPin.slice(0, -1));
  };

  const onForgotPin = () => {
    Alert.alert(
      "Recuperación de PIN",
      "Función para recuperar el PIN no implementada."
    );
  };

  const onFullPinEntered = (enteredPin) => {
    // Aquí validarías el PIN
    Alert.alert("PIN Ingresado", `El PIN ingresado es: ${enteredPin}`);
  };

  useEffect(() => {
    if (pin.length === 4) {
      onFullPinEntered(pin);
    }
  }, [pin]);

  const renderPinIndicators = () => {
    const indicators = [];
    for (let i = 0; i < 4; i++) {
      indicators.push(
        <View
          key={i}
          style={[
            styles.pinIndicator,
            pin.length > i && styles.pinIndicatorFilled,
          ]}
        />
      );
    }
    return indicators;
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

        {/* A continuación tu implementación */}
        <View style={styles.pinContainer}>{renderPinIndicators()}</View>

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
          <TouchableOpacity style={styles.keypadButton} onPress={onForgotPin}>
            <Ionicons name="finger-print-outline" size={24} color="#29364d" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.keypadButton}
            onPress={() => addDigit("0")}
          >
            <Text style={styles.keypadButtonText}>0</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.keypadButton}
            onPress={removeLastDigit}
          >
            <Feather name="delete" size={24} color="#29364d" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={onForgotPin}>
          <Text style={styles.forgotPinText}>Olvidé mi PIN</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  // Tus estilos existentes
  back: {
    marginTop: 80,
    marginLeft: -160,
    position: "absolute",
  },
  background: {
    backgroundColor: "white",
    flex: 1,
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

  // Nuevos estilos que agregué
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
    margin: 10,
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
    fontSize: 22,
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
