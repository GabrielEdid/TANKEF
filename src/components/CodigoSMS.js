import React, { useState } from "react";
import { View, TextInput, Text, StyleSheet } from "react-native";

const CodigoSMS = ({ setCode }) => {
  const [code, setCodeInternal] = useState("");

  const updateCode = (newCode) => {
    if (newCode.length <= 6) {
      setCodeInternal(newCode);
      setCode(newCode);
    }
  };

  // Renderiza los cuadros visuales para cada dígito
  const renderDigits = () => {
    let digits = [];
    for (let i = 0; i < 6; i++) {
      digits.push(
        <View key={i} style={styles.digitContainer}>
          <Text style={styles.input}>{code[i] || ""}</Text>
        </View>
      );
    }
    return digits;
  };

  return (
    <View style={styles.container}>
      <View style={styles.digitsWrapper}>
        {renderDigits()}
        <TextInput
          value={code}
          onChangeText={updateCode}
          style={styles.hiddenInput}
          keyboardType="numeric"
          maxLength={6}
          autoFocus={true}
        />
      </View>
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
  digitsWrapper: {
    flexDirection: "row",
    position: "relative",
  },
  digitContainer: {
    width: 40,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
    borderWidth: 2,
    borderColor: "#29364d",
    borderRadius: 10,
  },
  input: {
    fontSize: 30,
    fontWeight: "bold",
  },
  hiddenInput: {
    position: "absolute",
    width: 290,
    height: 70,
    opacity: 0,
    zIndex: 1,
    left: 6,
  },
});

export default CodigoSMS;
