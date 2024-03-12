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
  Image,
} from "react-native";
import React, { useState, useCallback, useContext } from "react";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import { useRoute } from "@react-navigation/native";
// Importaciones de Componentes y Hooks
import { CreditContext } from "../../hooks/CreditContext";
import { Feather, Ionicons } from "@expo/vector-icons";
import { set } from "date-fns";

// Se mide la pantalla para determinar medidas
const screenWidth = Dimensions.get("window").width;
const widthHalf = screenWidth / 2;
const widthFourth = screenWidth / 4 - 15;

const DefinirCredito = ({ navigation }) => {
  const route = useRoute();
  const { flujo } = route.params;
  // Estados y Contexto
  const { credit, setCredit } = useContext(CreditContext);
  const [nombreInversion, setNombreInversion] = useState("");
  const [monto, setMonto] = useState("");
  const [montoNumeric, setMontoNumeric] = useState(0);
  const [montoShow, setMontoShow] = useState("");
  const [focus, setFocus] = useState("Mi Red");
  const [plazo, setPlazo] = useState("");
  const [focusTab, setFocusTab] = useState("");

  const imageMap = {
    "1de5": require("../../../assets/images/1de5.png"),
    "2de5": require("../../../assets/images/2de5.png"),
    "3de5": require("../../../assets/images/3de5.png"),
    "4de5": require("../../../assets/images/4de5.png"),
    "5de5": require("../../../assets/images/5de5.png"),
  };

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

  const isAcceptable = montoNumeric >= 5000 && plazo;

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

  const handleAccept = () => {
    if (credit.paso === 5) {
      navigation.navigate("MiTankef");
    } else {
      setCredit({ ...credit, paso: credit.paso + 1 });
    }
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
              style={StyleSheet.absoluteFill}
            />
          </MaskedView>
          <Text style={styles.tituloPantalla}>Crédito</Text>
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
          onStartShouldSetResponder={() => true}
        >
          <View style={{ flex: 1 }}>
            <View
              style={{
                alignItems: "center",
                paddingHorizontal: 25,
                paddingVertical: 15,
                backgroundColor: "white",
                marginTop: 3,
              }}
            >
              <Text
                style={{
                  fontFamily: "opensansbold",
                  fontSize: 20,
                  color: "#060B4D",
                  textAlign: "center",
                }}
              >
                Selecciona una de nuestras opciones para solicitar un crédito.
              </Text>
            </View>
            {/* Opcion para añadir nombre al crédito */}
            {/*<View
              style={{
                marginTop: 3,
                backgroundColor: "white",
                paddingHorizontal: 15,
                paddingVertical: 5,
              }}
            >
              <Text style={styles.texto}>Nombre de la Inversión</Text>
              <TextInput
                style={styles.inputNombre}
                value={nombreInversion}
                maxLength={20}
                placeholderTextColor={"#b3b5c9ff"}
                placeholder="Introduce el nombre de la inversión"
                onChangeText={(text) => setNombreInversion(text)}
              />
            </View>*/}
            <View style={styles.tabsContainer}>
              {/* Boton Tab Balance */}
              <TouchableOpacity
                style={styles.tabButton}
                onPress={() => setFocus("Mi Red")}
              >
                <Text
                  style={[
                    styles.tabText,
                    {
                      color: focus === "Mi Red" ? "#060B4D" : "#9596AF",
                      fontFamily:
                        focus === "Balance"
                          ? "opensansbold"
                          : "opensanssemibold",
                    },
                  ]}
                >
                  Mi Red
                </Text>
                {focus === "Mi Red" ? <View style={styles.focusLine} /> : null}
              </TouchableOpacity>

              {/* Boton Tab Movimientos */}
              <TouchableOpacity
                style={styles.tabButton}
                onPress={() => setFocus("Comite")}
              >
                <Text
                  style={[
                    styles.tabText,
                    {
                      color: focus === "Comite" ? "#060B4D" : "#9596AF",
                      fontFamily:
                        focus === "Comite"
                          ? "opensansbold"
                          : "opensanssemibold",
                    },
                  ]}
                >
                  Comité
                </Text>
                {focus === "Comite" ? <View style={styles.focusLine} /> : null}
              </TouchableOpacity>
            </View>

            <View
              style={[
                styles.contenedores,
                { flexDirection: "row", justifyContent: "center" },
              ]}
            >
              <Image
                source={imageMap[`${credit.paso}de5`]}
                style={{ height: 50, width: 50 }}
              />
              <Text
                style={[
                  styles.texto,
                  { fontFamily: "opensansbold", marginLeft: 10 },
                ]}
              >
                {focus === "Mi Red"
                  ? "Mi Red con Obligados Solidarios"
                  : "Solicitud de crédito por Comité"}
              </Text>
            </View>
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
                <Text style={styles.valorConcepto}>$10,000.00</Text>
              </View>
              <Ionicons
                name="remove-outline"
                size={30}
                color="#e1e2ebff"
                style={styles.line}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.concepto}>Monto{"\n"}máximo</Text>
                <Text style={styles.valorConcepto}>$1,000,000.00</Text>
              </View>
            </View>
            <View style={styles.contenedores}>
              <Text style={styles.texto}>
                {focus === "Mi Red"
                  ? "Invita a tus amigos a unirse a tu red financiera. Cuantos más se sumen, más respaldo tendrás al solicitar un crédito. ¡Aprovecha el poder de la comunidad para obtener financiamiento!"
                  : "Al solicitar un crédito a través del comité, tu historial crediticio será revisado en buró de crédito y otros aspectos serán evaluados."}
              </Text>
            </View>
            <View style={styles.contenedores}>
              <Text style={styles.texto}>Monto de inversión</Text>
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
              <Text style={styles.subTexto}>
                Monto mínimo de inversión $5,000.00
              </Text>
            </View>

            <View style={styles.contenedores}>
              <Text style={[styles.texto, { fontFamily: "opensanssemibold" }]}>
                Plazo de Inversión
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
                      backgroundColor: focusTab === "6" ? "#2FF690" : "#F3F3F3",
                    },
                  ]}
                  onPress={() => [setFocusTab("6"), setPlazo(6)]}
                >
                  <Text style={styles.textoTab}>6</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.tab,
                    {
                      backgroundColor:
                        focusTab === "12" ? "#2FF690" : "#F3F3F3",
                    },
                  ]}
                  onPress={() => [setFocusTab("12"), setPlazo(12)]}
                >
                  <Text style={styles.textoTab}>12</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.tab,
                    {
                      backgroundColor:
                        focusTab === "18" ? "#2FF690" : "#F3F3F3",
                    },
                  ]}
                  onPress={() => [setFocusTab("18"), setPlazo(18)]}
                >
                  <Text style={styles.textoTab}>18</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.tab,
                    {
                      backgroundColor:
                        focusTab === "24" ? "#2FF690" : "#F3F3F3",
                      marginRight: 0,
                    },
                  ]}
                  onPress={() => [setFocusTab("24"), setPlazo(24)]}
                >
                  <Text style={styles.textoTab}>24</Text>
                </TouchableOpacity>
              </View>
              <Text
                style={[styles.subTexto, { marginTop: 10, color: "#060B4D" }]}
              >
                Esta es una cotización preliminar, la tasa definitiva dependerá
                del análisis completo de tu solicitud.
              </Text>
            </View>
            <View style={styles.contenedores}>
              <Text style={styles.texto}>Retorno de inversión neto</Text>
              <Text
                style={{
                  fontFamily: "opensansbold",
                  fontSize: 30,
                  color: "#060B4D",
                }}
              >
                $0.00 MXN
              </Text>
            </View>
            <View style={[styles.contenedores, { flexDirection: "row" }]}>
              <View style={{ flex: 1 }}>
                <Text style={styles.concepto}>Inversión{"\n"}inicial</Text>
                <Text style={styles.valorConcepto}>$0.00</Text>
              </View>
              <Ionicons
                name="remove-outline"
                size={30}
                color="#e1e2ebff"
                style={styles.line}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.concepto}>Tasa de{"\n"}interés</Text>
                <Text style={styles.valorConcepto}>0%</Text>
              </View>
              <Ionicons
                name="remove-outline"
                size={30}
                color="#e1e2ebff"
                style={styles.line}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.concepto}>Impuesto{"\n"}mensual</Text>
                <Text style={styles.valorConcepto}>$0.00</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.botonContinuar,
              { backgroundColor: isAcceptable ? "#060B4D" : "#D5D5D5" },
            ]}
            onPress={() => {
              handleAccept();
              //navigation.navigate("Beneficiarios", { flujo: flujo });
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
    marginLeft: 15,
    fontSize: 24,
    color: "#060B4D",
    fontFamily: "opensanssemibold",
  },
  tabsContainer: {
    backgroundColor: "white",
    marginTop: 3,
    flexDirection: "row",
    paddingTop: 16,
    justifyContent: "space-between",
  },
  tabButton: {
    alignItems: "center",
    flex: 1,
  },
  tabText: {
    fontFamily: "opensansbold",
    fontSize: 16,
  },
  focusLine: {
    height: 4,
    width: widthHalf,
    marginTop: 12,
    backgroundColor: "#060B4D",
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
    color: "#9E9E9E",
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
    width: widthFourth,
    borderRadius: 5,
    marginRight: 10,
  },
  textoTab: {
    textAlign: "center",
    fontFamily: "opensanssemibold",
    fontSize: 18,
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
    fontFamily: "opensanssemibold",
    fontSize: 16,
    color: "#060B4D",
    textAlign: "center",
  },
  line: {
    transform: [{ rotate: "90deg" }],
  },
});

export default DefinirCredito;
