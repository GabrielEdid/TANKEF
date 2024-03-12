// Importaciones de React Native y React
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useState, useCallback } from "react";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import { useRoute } from "@react-navigation/native";
import Slider from "@react-native-community/slider";
// Importaciones de Componentes y Hooks
import { Feather, Ionicons } from "@expo/vector-icons";

// Se mide la pantalla para determinar medidas
const screenWidth = Dimensions.get("window").width;
const widthFourth = screenWidth / 4 - 15;

const DefinirCajaAhorro = ({ navigation }) => {
  const route = useRoute();
  const { flujo } = route.params;
  // Estados y Contexto
  const [nombreInversion, setNombreInversion] = useState("");
  const [monto, setMonto] = useState("25000");
  const [montoNumeric, setMontoNumeric] = useState(25000);
  const [montoShow, setMontoShow] = useState("25,000.00");
  const [plazo, setPlazo] = useState("");
  const [focusTab, setFocusTab] = useState("");

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
    setMontoShow(formattedText); // Display value with formatting
    setMonto(newText); // Store raw value for further processing

    // Parse the raw input to a float and update montoNumeric for validation
    const numericValue = parseFloat(newText.replace(/,/g, ""));
    setMontoNumeric(numericValue || 0); // Update numeric value, defaulting to 0 if NaN
  };

  // Funcion para manejar el cambio de valor en el slider
  const handleSliderChange = (value) => {
    // Actualiza el valor numérico directamente con el valor del slider
    setMontoNumeric(value);

    // Formatea el valor para mostrarlo adecuadamente en el input
    const formattedValue = value
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    // Actualiza el estado del texto del input con el valor formateado
    setMontoShow(formattedValue);
  };

  const isAcceptable =
    montoNumeric >= 25000 && montoNumeric <= 35000 && plazo && nombreInversion;

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
    const numericValue = monto.replace(/,/g, "");
    setMonto(numericValue);
  };

  // Funcion para manejar el input de monto al deseleccionar
  const handleBlur = () => {
    setMonto(formatInput(monto));
  };

  // Componente Visual
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{ flex: 1 }}>
        {/* Titulo, Nombre de Pantalla y Campana */}
        <View style={styles.tituloContainer}>
          <MaskedView
            style={{ flex: 0.6 }}
            maskElement={<Text style={styles.titulo}>tankef</Text>}
          >
            <LinearGradient
              colors={["#2FF690", "#21B6D5"]}
              start={{ x: 1, y: 1 }}
              end={{ x: 0, y: 0 }}
              style={{ flex: 1 }}
            />
          </MaskedView>
          <Text style={styles.tituloPantalla}>Caja de ahorro</Text>
          <TouchableOpacity>
            <Feather
              name="bell"
              size={25}
              color="#060B4D"
              style={{ marginTop: 50 }}
            />
          </TouchableOpacity>
        </View>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
          removeClippedSubviews={true}
        >
          <View style={{ flex: 1 }}>
            <View style={[styles.contenedores, { flexDirection: "row" }]}>
              <View style={{ flex: 1 }}>
                <Text style={styles.concepto}>Valor de{"\n"}tu red</Text>
                <Text style={styles.valorConcepto}>$120,000</Text>
              </View>
              <Ionicons
                name="remove-outline"
                size={30}
                color="#e1e2ebff"
                style={styles.line}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.concepto}>Monto{"\n"}mínimo</Text>
                <Text style={styles.valorConcepto}>$25,000.00</Text>
              </View>
              <Ionicons
                name="remove-outline"
                size={30}
                color="#e1e2ebff"
                style={styles.line}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.concepto}>Monto{"\n"}máximo</Text>
                <Text style={styles.valorConcepto}>$35,000.00</Text>
              </View>
            </View>
            <View
              style={{
                marginTop: 3,
                backgroundColor: "white",
                paddingHorizontal: 15,
                paddingVertical: 5,
              }}
            >
              <Text style={styles.texto}>Nombre de la caja de ahorro</Text>
              <TextInput
                style={styles.inputNombre}
                value={nombreInversion}
                maxLength={20}
                placeholderTextColor={"#b3b5c9ff"}
                placeholder="Introduce el nombre de la caja de ahorro"
                onChangeText={(text) => setNombreInversion(text)}
              />
            </View>
            <View style={styles.contenedores}>
              <Text style={[styles.texto, { fontFamily: "opensanssemibold" }]}>
                Introduce el monto que deseas ahorrar
              </Text>
              <View style={styles.inputWrapper}>
                <Text
                  style={[
                    styles.dollarSign,
                    { color: monto ? "#060B4D" : "#b3b5c9ff" },
                  ]}
                >
                  $
                </Text>
                <TextInput
                  style={styles.inputMonto}
                  value={montoShow}
                  keyboardType="numeric"
                  maxLength={20}
                  placeholderTextColor={"#b3b5c9ff"}
                  placeholder="0.00"
                  onChangeText={handleChangeText}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
                <Text
                  style={[
                    styles.dollarSign,
                    { color: monto ? "#060B4D" : "#b3b5c9ff", marginLeft: 5 },
                  ]}
                >
                  MXN
                </Text>
              </View>
              <Slider
                style={{ width: "90%" }}
                minimumValue={25000}
                maximumValue={35000}
                step={25}
                value={montoNumeric}
                onValueChange={handleSliderChange}
                thumbTintColor="#2FF690"
                minimumTrackTintColor="#2FF690"
                maximumTrackTintColor="#F2F2F2"
              />
            </View>

            <View style={styles.contenedores}>
              <Text style={[styles.texto, { fontFamily: "opensanssemibold" }]}>
                Plan mensual de ahorro
              </Text>
              <TouchableOpacity
                style={styles.tab}
                onPress={() => [setFocusTab("6"), setPlazo(6)]}
              >
                <Text style={styles.textoTab}>6</Text>
              </TouchableOpacity>
              <Text style={styles.subTexto}>
                Esta es una cotización preliminar, la tasa definitiva dependerá
                del análisis completo de tu solicitud.
              </Text>
            </View>
            <View style={styles.contenedores}>
              <Text style={styles.concepto}>Tasa de{"\n"}interés</Text>
              <Text style={styles.valorConcepto}>44.26%</Text>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.botonContinuar,
              { backgroundColor: isAcceptable ? "#060B4D" : "#D5D5D5" },
            ]}
            onPress={() => {
              navigation.navigate("Beneficiarios", { flujo: flujo });
            }}
            disabled={!isAcceptable}
          >
            <Text
              style={[
                styles.textoBotonContinuar,
                { color: isAcceptable ? "white" : "grey" },
              ]}
            >
              Aceptar
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
};

// Estilos de la pantalla
const styles = StyleSheet.create({
  tituloContainer: {
    paddingHorizontal: 20,
    flexDirection: "row",
    backgroundColor: "white",
    paddingBottom: 10,
  },
  titulo: {
    fontFamily: "montserrat",
    letterSpacing: -4,
    fontSize: 35,
    marginTop: 40,
  },
  tituloPantalla: {
    flex: 1,
    marginTop: 47,
    marginRight: 35,
    fontSize: 20,
    color: "#060B4D",
    fontFamily: "opensanssemibold",
    fontWeight: "bold",
  },
  botonContinuar: {
    marginBottom: 5,
    backgroundColor: "#060B4D",
    width: "80%",
    alignSelf: "center",
    borderRadius: 5,
  },
  textoBotonContinuar: {
    color: "white",
    alignSelf: "center",
    padding: 10,
    fontFamily: "opensanssemibold",
    fontSize: 16,
  },
  contenedores: {
    backgroundColor: "white",
    paddingHorizontal: 12,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 3,
  },
  texto: {
    color: "#060B4D",
    textAlign: "center",
    fontFamily: "opensans",
    fontSize: 16,
  },
  subTexto: {
    color: "#060B4D",
    marginTop: 10,
    textAlign: "center",
    fontFamily: "opensans",
    fontSize: 14,
  },
  inputWrapper: {
    flexDirection: "row",
    marginTop: -10,
    paddingHorizontal: 10,
    alignItems: "center",
    alignContent: "center",
  },
  inputNombre: {
    marginTop: 5,
    fontSize: 16,
    color: "#060B4D",
    fontFamily: "opensans",
  },
  dollarSign: {
    fontSize: 35,
    fontFamily: "opensanssemibold",
  },
  inputMonto: {
    paddingTop: 10,
    fontSize: 35,
    color: "#060B4D",
    marginBottom: 10,
    fontFamily: "opensanssemibold",
  },
  separacion: {
    height: 1,
    width: "100%",
    backgroundColor: "#cecfdbff",
  },
  tab: {
    marginTop: 10,
    padding: 10,
    width: "90%",
    backgroundColor: "#060B4D",
    borderRadius: 5,
    marginRight: 10,
  },
  textoTab: {
    textAlign: "center",
    fontFamily: "opensanssemibold",
    fontSize: 18,
    color: "white",
  },
  botonContinuar: {
    marginTop: 20,
    marginBottom: 20,
    width: "80%",
    alignSelf: "center",
    borderRadius: 5,
  },
  textoBotonContinuar: {
    alignSelf: "center",
    padding: 10,
    fontFamily: "opensanssemibold",
    fontSize: 16,
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
});

export default DefinirCajaAhorro;
