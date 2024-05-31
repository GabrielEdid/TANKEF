// Importaciones de React y React Native
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Feather, Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
} from "react-native-reanimated";

/**
 * Componente PinPad: Permite al usuario ingresar un PIN.
 *
 * Props:
 * - id: Booleano que indica si se debe mostrar la opción de autenticación biométrica.
 * - get: Función para obtener el valor actual del PIN.
 * - set: Función para actualizar el valor del PIN.
 * - userPin: PIN correcto para comparación.
 * - onAuthenticationSuccess: Callback para autenticación exitosa.
 * - onIncorrectPin: Callback para PIN incorrecto.
 */

const PinPad = ({
  get,
  set,
  userPin,
  onAuthenticationSuccess,
  onIncorrectPin = () => {},
  id,
}) => {
  const navigation = useNavigation();
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const shakeAnimation = useSharedValue(0);

  const addDigit = (digit) => {
    if (get.length < 6) {
      set((prevPin) => prevPin + digit);
    }
  };

  const removeLastDigit = () => {
    set((prevPin) => prevPin.slice(0, -1));
  };

  const onForgotPin = () => {
    Alert.alert(
      "Recuperación de PIN",
      "Por favor vuelve a iniciar sesión para recuperar tu PIN"
    );
    navigation.navigate("LogIn");
  };

  useEffect(() => {
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricSupported(compatible);
    })();
  }, []);

  const handleAuthentication = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate",
        fallbackLabel: "Enter Password",
      });
      setIsAuthenticated(result.success);
      if (result.success) {
        onAuthenticationSuccess();
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const shakePinIndicators = () => {
    shakeAnimation.value = withSequence(
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(0, { duration: 50 })
    );
  };

  useEffect(() => {
    if (get.length === 6 && userPin && get !== userPin) {
      shakePinIndicators();
      onIncorrectPin();
    }
  }, [get]);

  const renderPinIndicators = () => {
    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ translateX: shakeAnimation.value }],
    }));

    return (
      <Animated.View style={[styles.pinContainer, animatedStyle]}>
        {Array.from({ length: 6 }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.pinIndicator,
              get.length > i && styles.pinIndicatorFilled,
            ]}
          />
        ))}
      </Animated.View>
    );
  };

  return (
    <View style={styles.background}>
      {renderPinIndicators()}
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
          {id ? (
            <Ionicons name="finger-print-outline" size={30} color="#29364d" />
          ) : null}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.keypadButton}
          onPress={() => addDigit("0")}
        >
          <Text style={styles.keypadButtonText}>0</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.keypadButton} onPress={removeLastDigit}>
          <Feather name="delete" size={30} color="#29364d" />
        </TouchableOpacity>
      </View>
      {id && (
        <TouchableOpacity onPress={onForgotPin}>
          <Text style={styles.forgotPinText}>Olvidé mi PIN</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    alignItems: "center",
  },
  pinContainer: {
    flexDirection: "row",
    marginVertical: 40,
  },
  pinIndicator: {
    width: 15,
    height: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#060B4D",
    marginVertical: 15,
    marginHorizontal: 10,
  },
  pinIndicatorFilled: {
    backgroundColor: "#060B4D",
  },
  keypadRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginBottom: 24,
  },
  keypadButton: {
    width: 65,
    height: 65,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
  keypadButtonText: {
    fontSize: 35,
    fontFamily: "opensansbold",
    color: "#060B4D",
  },
  forgotPinText: {
    fontSize: 16,
    color: "#060B4D",
    fontFamily: "opensanssemibold",
    textDecorationLine: "underline",
    marginTop: 24,
  },
});

export default PinPad;
