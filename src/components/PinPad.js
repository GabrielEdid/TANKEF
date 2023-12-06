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
import * as LocalAuthentication from "expo-local-authentication";
import { useNavigation } from "@react-navigation/native";
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";

const PinPad = ({ ...props }) => {
  const navigation = useNavigation();

  const addDigit = (digit) => {
    if (props.get.length < 6) {
      props.set((prevPin) => prevPin + digit);
    }
  };

  const removeLastDigit = () => {
    props.set((prevPin) => prevPin.slice(0, -1));
  };

  const onForgotPin = () => {
    Alert.alert(
      "Recuperación de PIN",
      "Porfavor vuelve a iniciar sesión para recuperar tu PIN"
    );
    navigation.navigate("InitialScreen");
  };

  const handleAuthentication = async () => {
    try {
      // Checking if device is compatible
      const isCompatible = await LocalAuthentication.hasHardwareAsync();

      if (!isCompatible) {
        throw new Error("Your device isn't compatible.");
      }

      // Checking if device has biometrics records
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!isEnrolled) {
        throw new Error("No Faces / Fingers found.");
      }

      // Authenticate user
      await LocalAuthentication.authenticateAsync();

      Alert.alert("Authenticated", "Welcome back !");
    } catch (error) {
      Alert.alert("An error as occured", error?.message);
    }
  };

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

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.background}>
        {/* Logo, Titulo y Avance */}
        <Image
          source={require("../../assets/images/Logo_Tankef.png")}
          style={styles.imagen}
        />
        <Text style={styles.titulo}>TANKEF</Text>

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
          <TouchableOpacity
            style={styles.keypadButton}
            onPress={handleAuthentication}
          >
            {props.id === true ? (
              <Ionicons name="finger-print-outline" size={24} color="#29364d" />
            ) : null}
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
        {props.id === true ? (
          <TouchableOpacity onPress={onForgotPin}>
            <Text style={styles.forgotPinText}>Olvidé mi PIN</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  // Tus estilos existentes
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