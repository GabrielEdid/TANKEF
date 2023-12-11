// Importaciones de React Native y React
import React, { useState, useRef } from "react";
import { View, TextInput, StyleSheet } from "react-native";

const CodigoSMS = ({ setCode }) => {
  const [digits, setDigits] = useState(new Array(6).fill(""));
  const digitRefs = useRef(digits.map(() => React.createRef()));

  const handlePaste = (text) => {
    // Si el texto ingresado tiene 6 caracteres, maneja el pegado
    if (text.length === 6) {
      const pasteDigits = text.split("");
      pasteDigits.forEach((digit, idx) => {
        digitRefs.current[idx].current.setNativeProps({ text: digit });
      });
      setDigits(pasteDigits);
      setCode(pasteDigits.join(""));
      digitRefs.current[5].current.focus();
    }
  };

  const updateDigits = (text, index) => {
    // Verifica si el texto ingresado es un pegado de 6 dígitos
    if (text.length === 6) {
      const pasteDigits = text.split("");
      setDigits(pasteDigits);
      setCode(pasteDigits.join(""));
      // Enfoca el último dígito
      digitRefs.current[5].current.focus();
    } else {
      // Calcula el total de dígitos ingresados, excluyendo el actual
      const totalDigits = digits.reduce(
        (acc, curr, currIndex) => acc + (currIndex !== index ? curr.length : 0),
        0
      );

      // Verifica si ya se han ingresado 6 dígitos
      if (totalDigits >= 5 && text.length > 1) {
        // Limita la entrada al primer dígito si se excede el límite
        text = text[0];
      }

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

  // Función para manejar el evento de presionar una tecla
  const handleKeyPress = (nativeEvent, index) => {
    if (nativeEvent.key === "Backspace") {
      if (index > 0 && digits[index] === "") {
        const newDigits = [...digits];
        // Elimina el último dígito del recuadro anterior
        newDigits[index - 1] = "";
        setDigits(newDigits);
        setCode(newDigits.join(""));
        // Enfoca el recuadro anterior
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
          onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent, index)}
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
