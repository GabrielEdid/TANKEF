// Importaciones de React Native y React
import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Slider from "@react-native-community/slider";
// Importaciones de Componentes y Contextos
import { Ionicons } from "@expo/vector-icons";
import { CreditContext } from "../hooks/CreditContext";

/**
 * `Conexion` es un componente que muestra información de una conexión específica,
 * como una tarjeta interactuable. Ofrece la funcionalidad para navegar a una vista detallada
 * del perfil asociado y la opción de eliminar esta conexión con confirmación mediante un modal.
 *
 * Props:
 * - `userID`: Identificador único del usuario asociado a la conexión.
 * - `imagen`: Puede ser una URL de imagen o un recurso local para mostrar como avatar del usuario.
 * - `nombre`: Nombre del usuario a mostrar en la tarjeta de conexión.
 * - `mail`: Correo electrónico del usuario asociado a la conexión.
 *
 * Ejemplo de uso (o ver en MiRed.js):
 * <Conexion
 *   userID="123"
 *   imagen="https://ruta/a/imagen.jpg"
 *   nombre="John Doe"
 *   mail="johndoe@gmail.com"
 * />
 */

// Se mide la pantalla para determinar medidas
const screenWidth = Dimensions.get("window").width;
const widthHalf = screenWidth / 2;
const widthFourth = screenWidth / 4 - 15;

const MontoyPlazoCredito = () => {
  const navigation = useNavigation();
  // Contexto de crédito
  const { credit, setCredit } = useContext(CreditContext);

  // Funcion para manejar el cambio de texto en el input de monto
  const handleChangeText = (inputText) => {
    let newText = inputText.replace(/[^0-9.]/g, "");
    if ((newText.match(/\./g) || []).length > 1) {
      newText = newText.replace(/\.(?=.*\.)/, "");
    }

    let [integer, decimal] = newText.split(".");
    integer = integer.replace(/^0+/, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    if (decimal && decimal.length > 2) {
      decimal = decimal.substring(0, 2);
    }

    const formattedText =
      decimal !== undefined ? `${integer}.${decimal}` : integer;
    const numericValue = parseFloat(newText.replace(/,/g, ""));
    setCredit({
      ...credit,
      montoShow: formattedText,
      monto: newText,
      montoNumeric: numericValue || 0,
    });
  };

  // Funcion para manejar el cambio de valor en el slider
  const handleSliderChange = (value) => {
    // Use functional update form to ensure we're working with the most current state
    setCredit((currentCredit) => {
      const formattedValue = value
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return {
        ...currentCredit,
        montoNumeric: value,
        montoShow: formattedValue,
      };
    });
  };

  // Funcion para formatear el input de monto
  const formatInput = (text) => {
    // Elimina comas para el cálculo
    const numericValue = parseInt(text.replace(/,/g, ""), 10);
    if (!isNaN(numericValue)) {
      // Vuelve a formatear con comas
      return numericValue.toLocaleString();
    }
    return "";
  };

  // Funcion para manejar el input de monto al seleccionar
  const handleFocus = () => {
    const numericValue = credit.monto.replace(/,/g, "");
    setCredit({ ...credit, monto: numericValue });
  };

  // Funcion para manejar el input de monto al deseleccionar
  const handleBlur = () => {
    setCredit({ ...credit, montoShow: formatInput(credit.monto) });
  };

  // Componente visual
  return (
    <>
      <View style={[styles.contenedores, { flexDirection: "row" }]}>
        <View style={{ flex: 1 }}>
          <Text style={styles.concepto}>Valor de{"\n"}tu red</Text>
          <Text style={styles.valorConcepto}>$120K</Text>
        </View>
        <Ionicons
          name="remove-outline"
          size={30}
          color="#e1e2ebff"
          style={styles.line}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.concepto}>Monto{"\n"}mínimo</Text>
          <Text style={styles.valorConcepto}>$10K</Text>
        </View>
        <Ionicons
          name="remove-outline"
          size={30}
          color="#e1e2ebff"
          style={styles.line}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.concepto}>Monto{"\n"}máximo</Text>
          <Text style={styles.valorConcepto}>$1M</Text>
        </View>
      </View>
      <View style={styles.contenedores}>
        <Text style={[styles.texto, { fontFamily: "opensansbold" }]}>
          Introduce el monto que deseas solicitar.
        </Text>
        <View style={styles.inputWrapper}>
          <Text style={[styles.dollarSign]}>$</Text>
          <TextInput
            style={styles.inputMonto}
            value={credit.montoShow}
            keyboardType="numeric"
            maxLength={20}
            placeholderTextColor={"#b3b5c9ff"}
            onChangeText={handleChangeText}
            onFocus={handleFocus}
            onBlur={handleBlur}
            //editable={credit.paso === 1} // Para deshabilitar el input
          />
          <Text
            style={[
              styles.dollarSign,
              {
                marginLeft: 5,
              },
            ]}
          >
            MXN
          </Text>
        </View>
        <Slider
          style={{ width: "90%" }}
          minimumValue={10000}
          maximumValue={1000000}
          step={100}
          value={credit.montoNumeric}
          onValueChange={handleSliderChange}
          thumbTintColor="#2FF690"
          minimumTrackTintColor="#2FF690"
          maximumTrackTintColor="#F2F2F2"
          //disabled={credit.paso === 1 ? false : true} // Para deshabilitar el slider
        />
      </View>

      <View style={styles.contenedores}>
        <Text style={[styles.texto, { fontFamily: "opensansbold" }]}>
          Plazo del Crédito
        </Text>
        <View
          style={{
            flexDirection: "row",
            marginLeft: -5,
            alignSelf: "center",
          }}
        >
          <TouchableOpacity
            style={[
              styles.tab,
              {
                backgroundColor: credit.plazo === 6 ? "#2FF690" : "#F3F3F3",
              },
            ]}
            onPress={() => [setCredit({ ...credit, plazo: 6 })]}
            //disabled={credit.paso === 1 ? false : true} // Para deshabilitar el tab
          >
            <Text style={styles.textoTab}>6</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              {
                backgroundColor: credit.plazo === 12 ? "#2FF690" : "#F3F3F3",
              },
            ]}
            onPress={() => [setCredit({ ...credit, plazo: 12 })]}
            //disabled={credit.paso === 1 ? false : true} // Para deshabilitar el tab
          >
            <Text style={styles.textoTab}>12</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              {
                backgroundColor: credit.plazo === 18 ? "#2FF690" : "#F3F3F3",
              },
            ]}
            onPress={() => [setCredit({ ...credit, plazo: 18 })]}
            //disabled={credit.paso === 1 ? false : true} // Para deshabilitar el tab
          >
            <Text style={styles.textoTab}>18</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              {
                backgroundColor: credit.plazo === 24 ? "#2FF690" : "#F3F3F3",
                marginRight: 0,
              },
            ]}
            onPress={() => [setCredit({ ...credit, plazo: 24 })]}
            //disabled={credit.paso === 1 ? false : true} // Para deshabilitar el tab
          >
            <Text style={styles.textoTab}>24</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

// Estilos del componente
const styles = StyleSheet.create({
  contenedores: {
    backgroundColor: "white",
    paddingHorizontal: 12,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 3,
  },
  concepto: {
    fontFamily: "opensans",
    fontSize: 14,
    color: "#060B4D",
    textAlign: "center",
  },
  valorConcepto: {
    fontFamily: "opensanssemibold",
    fontSize: 16,
    color: "#060B4D",
    textAlign: "center",
  },
  line: {
    transform: [{ rotate: "90deg" }],
  },
  tab: {
    marginTop: 10,
    padding: 10,
    width: widthFourth,
    borderRadius: 5,
    marginRight: 10,
  },
  textoTab: {
    textAlign: "center",
    fontFamily: "opensanssemibold",
    fontSize: 18,
  },
  texto: {
    color: "#060B4D",
    textAlign: "center",
    fontFamily: "opensans",
    fontSize: 16,
  },
  inputWrapper: {
    flexDirection: "row",
    marginTop: -10,
    paddingHorizontal: 10,
    alignItems: "center",
    alignContent: "center",
  },
  inputMonto: {
    paddingTop: 10,
    fontSize: 35,
    color: "#060B4D",
    marginBottom: 10,
    fontFamily: "opensanssemibold",
  },
  dollarSign: {
    color: "#060B4D",
    fontSize: 35,
    fontFamily: "opensanssemibold",
  },
});

export default MontoyPlazoCredito;
