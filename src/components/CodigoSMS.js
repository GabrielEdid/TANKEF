import React, { useState, useRef } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

const CodigoSMS = ({ setCode }) => {
  const [digit1, setDigit1] = useState("");
  const [digit2, setDigit2] = useState("");
  const [digit3, setDigit3] = useState("");
  const [digit4, setDigit4] = useState("");
  const [digit5, setDigit5] = useState("");
  const [digit6, setDigit6] = useState("");

  const digit1Ref = useRef(null);
  const digit2Ref = useRef(null);
  const digit3Ref = useRef(null);
  const digit4Ref = useRef(null);
  const digit5Ref = useRef(null);
  const digit6Ref = useRef(null);

  const handlePaste = (text) => {
    // Divide el texto en dígitos individuales
    const digits = text.split("");

    // Asigna los dígitos a cada campo de texto
    if (digits.length === 6) {
      setDigit1(digits[0]);
      setDigit2(digits[1]);
      setDigit3(digits[2]);
      setDigit4(digits[3]);
      setDigit5(digits[4]);
      setDigit6(digits[5]);
      setCode(digits.join(""));
      // Mueve el enfoque al final
      digit6Ref.current.focus();
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        ref={digit1Ref}
        value={digit1}
        onChangeText={(text) => {
          if (text.length === 1) {
            setDigit1(text);
            digit2Ref.current.focus();
          } else if (text.length === 6) {
            handlePaste(text);
          }
        }}
        style={styles.input}
        keyboardType="numeric"
        maxLength={6} // Cambia esto a 6 para permitir pegar el código completo
      />
      <TextInput
        ref={digit2Ref}
        value={digit2}
        onChangeText={(text) => {
          setDigit2(text);
          if (text) digit3Ref.current.focus();
          else digit1Ref.current.focus();
        }}
        style={styles.input}
        keyboardType="numeric"
        maxLength={1}
      />
      <TextInput
        ref={digit3Ref}
        value={digit3}
        onChangeText={(text) => {
          setDigit3(text);
          if (text) digit4Ref.current.focus();
          else digit2Ref.current.focus();
        }}
        style={styles.input}
        keyboardType="numeric"
        maxLength={1}
      />
      <Text style={styles.guion}>-</Text>
      <TextInput
        ref={digit4Ref}
        value={digit4}
        onChangeText={(text) => {
          setDigit4(text);
          if (text) digit5Ref.current.focus();
          else digit3Ref.current.focus();
        }}
        style={styles.input}
        keyboardType="numeric"
        maxLength={1}
      />
      <TextInput
        ref={digit5Ref}
        value={digit5}
        onChangeText={(text) => {
          setDigit5(text);
          if (text) digit6Ref.current.focus();
          else digit4Ref.current.focus();
        }}
        style={styles.input}
        keyboardType="numeric"
        maxLength={1}
      />
      <TextInput
        ref={digit6Ref}
        value={digit6}
        onChangeText={(text) => {
          setDigit6(text);
          setCode(digit1 + digit2 + digit3 + digit4 + digit5 + text);
          if (!text) digit5Ref.current.focus();
        }}
        style={styles.input}
        keyboardType="numeric"
        maxLength={1}
      />
    </View>
  );
};

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
  guion: {
    marginTop: 5,
    fontSize: 40,
  },
});

export default CodigoSMS;
