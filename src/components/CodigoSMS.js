// Importaciones de React Native y React
import React, { useState, useRef } from "react";
import { View, TextInput, StyleSheet } from "react-native";

/**
 * Componente `CodigoSMS` para ingresar un código de verificación SMS, muestra 6 recuadros donde va cada caracter.
 *
 * Props:
 * - setCode: Función para actualizar el código completo en el componente padre.
 */

const CodigoSMS = ({ setCode }) => {
  // Estado local para los dígitos
  const [digits, setDigits] = useState(new Array(6).fill(""));
  const digitRefs = useRef(digits.map(() => React.createRef()));

  const updateDigits = (text, index) => {
    // Verifica si el texto ingresado es un pegado de 6 dígitos
    if (text.length === 6) {
      const pasteDigits = text.split("");
      setDigits(pasteDigits);
      setCode(pasteDigits.join(""));
      // Enfoca el último dígito
      digitRefs.current[5].current.focus();
    } else {
      const newDigits = [...digits];
      newDigits[index] = text;
      setDigits(newDigits);
      setCode(newDigits.join(""));
      // Maneja el enfoque del siguiente o anterior TextInput
      if (text && index < 5) {
        digitRefs.current[index + 1].current.focus();
      } else if (!text && index > 0) {
        digitRefs.current[index - 1].current.focus();
      }
    }
  };

  // Renderiza el componente
  return (
    <View style={styles.container}>
      {digits.map((digit, index) => (
        <TextInput
          key={index}
          ref={digitRefs.current[index]}
          value={digit}
          onChangeText={(text) => updateDigits(text, index)}
          style={styles.input}
          keyboardType="numeric"
          maxLength={6}
          onKeyPress={({ nativeEvent }) => {
            if (
              nativeEvent.key === "Backspace" &&
              index > 0 &&
              digits[index] === ""
            ) {
              digitRefs.current[index - 1].current.focus();
            }
          }}
        />
      ))}
    </View>
  );
};

// Estilos del componente
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 20,
  },
  input: {
    width: 40,
    height: 60,
    textAlign: "center",
    margin: 5,
    borderWidth: 2,
    borderColor: "#29364d",
    borderRadius: 10,
    fontSize: 30,
    fontWeight: "bold",
  },
});

export default CodigoSMS;
