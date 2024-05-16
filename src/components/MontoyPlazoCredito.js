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
import { Ionicons, Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import { UserContext } from "../hooks/UserContext";
import { FinanceContext } from "../hooks/FinanceContext";

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
  const { user } = useContext(UserContext);
  const { finance, setFinance } = useContext(FinanceContext);

  // Function to manage input changes and format text
  const handleChangeText = (inputText) => {
    const cleanedInput = inputText.replace(/[^0-9.]/g, ""); // Remove all non-numeric characters except dot
    if ((cleanedInput.match(/\./g) || []).length > 1) {
      // Ensure only one dot
      cleanedInput = cleanedInput.replace(/\.(?=.*\.)/, "");
    }

    const [integer, decimal] = cleanedInput.split(".");
    const formattedInteger = integer
      .replace(/^0+/, "")
      .replace(/\B(?=(\d{3})+(?!\d))/g, ","); // Format thousands with comma
    const formattedDecimal =
      decimal && decimal.length > 2 ? decimal.substring(0, 2) : decimal; // Limit decimal places to 2

    const formattedText =
      formattedDecimal !== undefined
        ? `${formattedInteger}.${formattedDecimal}`
        : formattedInteger;
    setFinance((prevState) => ({
      ...prevState,
      montoShow: formattedText,
      monto: cleanedInput,
    }));

    // Parse the raw input to a float for numeric validations or calculations
    const numericValue = parseFloat(cleanedInput.replace(/,/g, ""));
    setFinance((prevState) => ({
      ...prevState,
      montoNumeric: numericValue || 0,
    }));
  };

  // Focus and Blur Handlers for the input
  const handleFocus = () => {
    // When focused, remove formatting for editing
    const rawNumericValue = finance.monto.replace(/,/g, "");
    setFinance((prevState) => ({ ...prevState, monto: rawNumericValue }));
  };

  const handleBlur = () => {
    // When input is blurred, apply formatting
    const formattedValue = formatInput(finance.monto);
    setFinance((prevState) => ({ ...prevState, monto: formattedValue }));
  };

  // Helper function to format the numeric input on blur
  const formatInput = (text) => {
    const numericValue = parseFloat(text.replace(/,/g, ""));
    return isNaN(numericValue) ? "" : numericValue.toLocaleString();
  };

  // Formatea un monto a pesos mexicanos
  const formatAmount = (amount) => {
    const number = parseFloat(amount);
    return `${number.toLocaleString("es-MX", {
      style: "currency",
      currency: "MXN",
    })}`;
  };

  // Componente visual
  return (
    <>
      {finance.paso <= 2 && (
        <>
          <View style={[styles.contenedores, { paddingBottom: 0 }]}>
            <Text style={[styles.texto, { fontFamily: "opensansbold" }]}>
              Monto a solicitar
            </Text>
            <View style={styles.inputWrapper}>
              <Text
                style={[
                  styles.dollarSign,
                  { color: finance.monto ? "#060B4D" : "#b3b5c9ff" },
                ]}
              >
                $
              </Text>
              <TextInput
                style={styles.inputMonto}
                value={finance.montoShow}
                keyboardType="numeric"
                maxLength={20}
                placeholderTextColor={"#b3b5c9ff"}
                onChangeText={handleChangeText}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder="10,000.00"
                editable={finance.paso < 2}
              />
              <Text
                style={[
                  styles.dollarSign,
                  {
                    color: finance.monto ? "#060B4D" : "#b3b5c9ff",
                    marginLeft: 5,
                  },
                ]}
              >
                MXN
              </Text>
            </View>
            <View style={styles.separacion} />
            <Text style={[styles.concepto, { marginBottom: 15, fontSize: 12 }]}>
              {`Monto mínimo $10,000.00, valor de la red ${user.valorRed.toLocaleString(
                "es-MX",
                {
                  style: "currency",
                  currency: "MXN",
                }
              )}MXN.`}
            </Text>
          </View>

          <View style={styles.contenedores}>
            <Text style={[styles.texto, { fontFamily: "opensansbold" }]}>
              ¿A quién deseas solicitar tu crédito?
            </Text>
            <TouchableOpacity
              style={styles.buttonFocus}
              onPress={() => [setFinance({ ...finance, focus: "committee" })]}
              disabled={finance.paso > 2}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.texto2}>Comité</Text>
                <Text style={styles.texto3}>
                  El crédito es solicitado a Tankef, requiere revisión en Buró
                  de Crédito.
                </Text>
              </View>
              {finance.focus === "committee" ? (
                <MaterialCommunityIcons
                  name="radiobox-marked"
                  size={32}
                  color="#2FF690"
                  style={{ marginTop: 12, marginLeft: 30, left: 2 }}
                />
              ) : (
                <Entypo
                  name="circle"
                  size={28}
                  color="#060B4D"
                  style={{ marginTop: 13, marginLeft: 30 }}
                />
              )}
            </TouchableOpacity>

            {/* Boton Mis Conexiones */}
            <TouchableOpacity
              style={styles.buttonFocus}
              onPress={() => [setFinance({ ...finance, focus: "network" })]}
              disabled={finance.paso > 2}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.texto2}>Por Red Social</Text>
                <Text style={styles.texto3}>
                  El crédito es solicitado a las personas que selecciones como
                  tus obligados solidarios.
                </Text>
              </View>
              {finance.focus === "network" ? (
                <MaterialCommunityIcons
                  name="radiobox-marked"
                  size={32}
                  color="#2FF690"
                  style={{ marginTop: 12, marginLeft: 30, left: 2 }}
                />
              ) : (
                <Entypo
                  name="circle"
                  size={28}
                  color="#060B4D"
                  style={{ marginTop: 13, marginLeft: 30 }}
                />
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.contenedores}>
            <Text style={[styles.texto, { fontFamily: "opensansbold" }]}>
              ¿A qué plazo quieres pagarlo?
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
                    backgroundColor:
                      finance.plazo === 6 ? "#2FF690" : "#F3F3F3",
                  },
                ]}
                onPress={() => [setFinance({ ...finance, plazo: 6 })]}
                disabled={finance.paso > 2}
              >
                <Text style={styles.textoTab}>6</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.tab,
                  {
                    backgroundColor:
                      finance.plazo === 12 ? "#2FF690" : "#F3F3F3",
                  },
                ]}
                onPress={() => [setFinance({ ...finance, plazo: 12 })]}
                disabled={finance.paso > 2}
              >
                <Text style={styles.textoTab}>12</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.tab,
                  {
                    backgroundColor:
                      finance.plazo === 18 ? "#2FF690" : "#F3F3F3",
                  },
                ]}
                onPress={() => [setFinance({ ...finance, plazo: 18 })]}
                disabled={finance.paso > 2}
              >
                <Text style={styles.textoTab}>18</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.tab,
                  {
                    backgroundColor:
                      finance.plazo === 24 ? "#2FF690" : "#F3F3F3",
                    marginRight: 0,
                  },
                ]}
                onPress={() => [setFinance({ ...finance, plazo: 24 })]}
                disabled={finance.paso > 2}
              >
                <Text style={styles.textoTab}>24</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}

      {finance.paso > 2 && (
        <>
          <View style={[styles.contenedores, { flexDirection: "row" }]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.concepto}>Monto a solicitar</Text>
              <Text style={styles.valorConcepto}>
                {formatAmount(finance.montoNumeric)}
              </Text>
            </View>
            <Ionicons
              name="remove-outline"
              size={30}
              color="#e1e2ebff"
              style={styles.line}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.concepto}>Plazo del crédito</Text>
              <Text style={styles.valorConcepto}>{finance.plazo} meses</Text>
            </View>
          </View>
        </>
      )}
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
    fontFamily: "opensansbold",
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
    paddingHorizontal: 10,
    alignItems: "center",
    alignContent: "center",
  },
  inputMonto: {
    paddingTop: 10,
    fontSize: 30,
    color: "#060B4D",
    marginBottom: 10,
    fontFamily: "opensans",
  },
  dollarSign: {
    color: "#060B4D",
    fontSize: 30,
    fontFamily: "opensans",
  },
  separacion: {
    height: 1,
    marginBottom: 10,
    width: "100%",
    alignSelf: "center",
    backgroundColor: "#cecfdb",
  },
  texto2: {
    marginTop: 2,
    fontSize: 18,
    fontFamily: "opensansbold",
    paddingTop: 1,
    color: "#060B4D",
  },
  texto3: {
    marginTop: 2,
    fontSize: 14,
    paddingTop: 1,
    fontFamily: "opensans",
    color: "#060B4D",
  },
  buttonFocus: {
    flexDirection: "row",
    borderRadius: 20,
    marginVertical: 5,
  },
});

export default MontoyPlazoCredito;

// Diseños viejos
/*<View style={[styles.contenedores, { flexDirection: "row" }]}>
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
      </View>*/

/*<Slider
          style={{ width: "90%" }}
          minimumValue={10000}
          maximumValue={1000000}
          step={100}
          value={finance.montoNumeric}
          onValueChange={handleSliderChange}
          thumbTintColor="#2FF690"
          minimumTrackTintColor="#2FF690"
          maximumTrackTintColor="#F2F2F2"
          //disabled={finance.paso === 1 ? false : true} // Para deshabilitar el slider
          />*/
