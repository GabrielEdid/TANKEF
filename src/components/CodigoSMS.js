// Importaciones de React y React Native
import React, { useState } from "react";
import { View, TextInput, Text, StyleSheet } from "react-native";

/*
 * Componente CodigoSMS:
 * Este componente renderiza un input invisible y 6 recuadros en los que aparecen los 6 digitos del usuario.
 *
 * Props:
 * - setCode: un useState o set que se le pasa para que pueda ser guardado en la pantalla en la que se renderizan los recuadros.
 *
 */

const CodigoSMS = ({ setCode }) => {
  // Estado para guardar el código
  const [code, setCodeInternal] = useState("");

  // Función para actualizar el código
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

  // Componente visual
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
    width: 45,
    height: 65,
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
    marginTop: 30,
    borderWidth: 1,
    borderBottomColor: "#6a6d94",
    borderColor: "transparent",
  },
  input: {
    fontSize: 40,
    color: "#060B4D",
    fontFamily: "opensansbold",
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
