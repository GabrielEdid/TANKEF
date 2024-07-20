// Importaciones de React Native y React
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Alert,
  Linking,
} from "react-native";
import React, { useState, useCallback, useContext, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import { ActivityIndicator } from "react-native-paper";
import { useRoute } from "@react-navigation/native";
// Importaciones de Componentes y Hooks
import { useInactivity } from "../../hooks/InactivityContext";
import { FinanceContext } from "../../hooks/FinanceContext";
import { APIGet, APIPost } from "../../API/APIService";
import ModalAmortizacion from "../../components/ModalAmortizacion";
import { Feather, Ionicons } from "@expo/vector-icons";

// Se mide la pantalla para determinar medidas
const screenWidth = Dimensions.get("window").width;
const widthFourth = screenWidth / 4 - 15;

const DefinirInversion = ({ navigation }) => {
  const route = useRoute();
  const { flujo } = route.params;
  // Estados y Contexto
  const { resetTimeout } = useInactivity();
  const { finance, setFinance, resetFinance } = useContext(FinanceContext);
  const [totalInversion, setTotalInversion] = useState("");
  const [tasa, setTasa] = useState("");
  const [focusTab, setFocusTab] = useState("");
  const [modalAmortizacionVisible, setModalAmortizacionVisible] =
    useState(false);
  const [loading, setLoading] = useState(false);

  // Función para hacer la cotizacion al API
  useEffect(() => {
    const fetchCotizacion = async () => {
      const url = `/api/v1/simulator?term=${finance.plazo}&type=investment&amount=${finance.montoNumeric}`;

      try {
        const response = await APIGet(url);
        if (response.error) {
          // Manejar el error
          console.error("Error al cotizar:", response.error);
          Alert.alert(
            "Error",
            "No se pudo hacer la cotización. Intente nuevamente."
          );
        } else {
          setTotalInversion(response.data.total);
          setTasa(response.data.rate);
        }
      } catch (error) {
        console.error("Error en la petición de cotización:", error);
        Alert.alert("Error", "Ha ocurrido un error al realizar la cotización.");
      }
    };
    if (finance.montoNumeric >= 5000 && finance.plazo) fetchCotizacion();
    else if (finance.montoNumeric < 5000) {
      setTotalInversion("");
      setTasa("");
    }
  }, [finance.montoNumeric, finance.plazo]);

  const handlePress = async () => {
    resetTimeout();
    setLoading(true);
    const url = "/api/v1/investments";
    console.log(finance.nombreFinance, finance.montoNumeric, finance.plazo);
    const data = {
      investment: {
        name: finance.nombreFinance,
        amount: finance.montoNumeric,
        term: finance.plazo,
        condition: finance.condiciones,
      },
    };

    const response = await APIPost(url, data);
    if (response.error) {
      setLoading(false);
      console.error("Error al crear la inversión:", response.error);
      const errorMessages = response.error.errors
        ? Object.values(response.error.errors).flat().join(". ")
        : response.error;
      Alert.alert("Error al crear la inversion", errorMessages);
    } else {
      setLoading(false);
      console.log("Inversión creada exitosamente:", response);
      setFocusTab("");
      navigation.navigate("Beneficiarios", {
        flujo: flujo,
        idInversion: response.data.data.id,
      });
    }
  };

  // Funcion para manejar el boton de cancelar
  const handleCancelar = () => {
    resetTimeout();
    Alert.alert(
      "¿Deseas cancelar la Inversión?",
      "Si cancelas la Inversión, perderás la información ingresada hasta el momento.",
      [
        {
          text: "Si",
          onPress: () => [
            navigation.navigate("Inicio"),
            resetFinance(),
            setFocusTab(""),
          ],
          style: "destructive",
        },
        {
          text: "No",
        },
      ],
      { cancelable: true }
    );
  };

  const visitTerms = () => {
    resetTimeout();
    const url = "https://www.google.com";
    Linking.openURL(url).catch((err) =>
      console.error("Couldn't load page", err)
    );
  };

  // Function to manage input changes and format text
  const handleChangeText = (inputText) => {
    resetTimeout();
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

  const isAcceptable =
    finance.montoNumeric >= 5000 &&
    finance.plazo &&
    finance.nombreFinance &&
    finance.condiciones;

  const isTable = finance.montoNumeric >= 5000 && finance.plazo;

  // Componente Visual
  return (
    <View style={{ flex: 1 }}>
      {/* Titulo, Nombre de Pantalla y Campana */}
      <View style={styles.tituloContainer}>
        {/* <MaskedView
          style={{ flex: 0.6 }}
          maskElement={<Text style={styles.titulo}>tankef</Text>}
        >
          <LinearGradient
            colors={["#2FF690", "#21B6D5"]}
            start={{ x: 1, y: 1 }}
            end={{ x: 0, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </MaskedView> */}
        <Text style={styles.tituloPantalla}>Inversión</Text>
      </View>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        onScroll={() => resetTimeout()}
        scrollEventThrottle={400}
      >
        <View style={{ flex: 1 }}>
          <View style={[styles.contenedores, { marginTop: 3 }]}>
            <Text
              style={{
                fontFamily: "opensansbold",
                fontSize: 24,
                color: "#060B4D",
                textAlign: "center",
              }}
            >
              Simula tu inversión
            </Text>
          </View>
          <View style={[styles.contenedores, { marginTop: -10 }]}>
            <Text style={styles.texto}>Nombre de la Inversión</Text>
            <TextInput
              style={styles.inputNombre}
              value={finance.nombreFinance}
              maxLength={20}
              placeholderTextColor={"#b3b5c9ff"}
              placeholder="Mi inversión"
              onChangeText={(text) => [
                setFinance({ ...finance, nombreFinance: text }),
                resetTimeout(),
              ]}
            />
            <View style={styles.separacion} />
          </View>

          <View style={[styles.contenedores, { marginTop: -10 }]}>
            <Text style={styles.texto}>Monto de la inversión</Text>
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
                placeholder="0.00"
                onChangeText={handleChangeText}
                onFocus={handleFocus}
                onBlur={handleBlur}
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
            <View style={[styles.separacion, { marginTop: 0 }]} />
            <Text style={styles.montoMinimo}>Monto mínimo $5,000.00</Text>
          </View>

          <View style={[styles.contenedores, { marginTop: -10 }]}>
            <Text style={styles.texto}>Elige el plazo</Text>
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
                onPress={() => [
                  setFocusTab("6"),
                  setFinance({ ...finance, plazo: 6 }),
                  resetTimeout(),
                ]}
              >
                <Text style={styles.textoTab}>6</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.tab,
                  {
                    backgroundColor: focusTab === "12" ? "#2FF690" : "#F3F3F3",
                  },
                ]}
                onPress={() => [
                  setFocusTab("12"),
                  setFinance({ ...finance, plazo: 12 }),
                  resetTimeout(),
                ]}
              >
                <Text style={styles.textoTab}>12</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.tab,
                  {
                    backgroundColor: focusTab === "18" ? "#2FF690" : "#F3F3F3",
                  },
                ]}
                onPress={() => [
                  setFocusTab("18"),
                  setFinance({ ...finance, plazo: 18 }),
                  resetTimeout(),
                ]}
              >
                <Text style={styles.textoTab}>18</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.tab,
                  {
                    backgroundColor: focusTab === "24" ? "#2FF690" : "#F3F3F3",
                    marginRight: 0,
                  },
                ]}
                onPress={() => [
                  setFocusTab("24"),
                  setFinance({ ...finance, plazo: 24 }),
                  resetTimeout(),
                ]}
              >
                <Text style={styles.textoTab}>24</Text>
              </TouchableOpacity>
            </View>
            <Text style={[styles.subTexto, { marginTop: 10 }]}>
              La tasa de interés es variable y se ajusta según el mercado.
              Referencia la TIIE a 28 días, reportada en el DOF antes de la
              fecha de cálculo. La tasa de impuestos aplicada es la actual y
              puede cambiar.
            </Text>
          </View>
          <View
            style={[styles.contenedores, { marginTop: 3, paddingVertical: 10 }]}
          >
            <Text style={styles.texto}>Resultados</Text>
            <View
              style={[
                styles.contenedores,
                { flexDirection: "row", marginTop: 3, paddingVertical: 5 },
              ]}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.concepto}>Total de inversión</Text>
                <Text style={styles.valorConcepto}>
                  {totalInversion ? `${totalInversion} MXN` : "$ 0 MXN"}
                </Text>
              </View>
              <Ionicons
                name="remove-outline"
                size={30}
                color="#e1e2ebff"
                style={styles.line}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.concepto}>Tasa de interés</Text>
                <Text style={styles.valorConcepto}>
                  {tasa ? `${tasa}` : "0%"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View
          style={{
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            style={[
              styles.botonContinuar,
              { backgroundColor: isAcceptable ? "#060B4D" : "#D5D5D5" },
            ]}
            onPress={() => {
              handlePress();
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

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <TouchableOpacity
              style={{ marginTop: 10, marginRight: 7.5 }}
              onPress={() => [
                setFinance({ ...finance, condiciones: !finance.condiciones }),
                resetTimeout(),
              ]}
            >
              <Feather
                name={finance.condiciones ? "check-square" : "square"}
                size={24}
                color="#060B4D"
              />
            </TouchableOpacity>
            <Text style={styles.textCondiciones}>
              Al continuar usted está aceptando{" "}
              <TouchableOpacity
                style={{ marginTop: -2.5 }}
                onPress={() => visitTerms()}
              >
                <Text
                  style={[
                    styles.textCondiciones,
                    { fontFamily: "opensansbold", marginTop: 0 },
                  ]}
                >
                  Términos y Condiciones
                </Text>
              </TouchableOpacity>
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.botonContinuar,
              { backgroundColor: isTable ? "white" : "#D5D5D5" },
            ]}
            onPress={() => {
              [setModalAmortizacionVisible(true), resetTimeout()];
            }}
            disabled={!isTable}
          >
            <Text
              style={[
                styles.textoBotonContinuar,
                { color: isTable ? "#060B4D" : "grey" },
              ]}
            >
              Tabla de amortización
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.botonContinuar,
              {
                backgroundColor: "white",
                marginBottom: 30,
              },
            ]}
            onPress={() => {
              handleCancelar();
            }}
          >
            <Text style={[styles.textoBotonContinuar, { color: "#F95C5C" }]}>
              Cancelar Inversión
            </Text>
          </TouchableOpacity>
        </View>
        <ModalAmortizacion
          visible={modalAmortizacionVisible}
          onClose={() => {
            setModalAmortizacionVisible(false);
          }}
          flujo={"investment"}
        />
      </ScrollView>
      {loading && (
        <View style={styles.overlay}>
          <ActivityIndicator size={75} color="#060B4D" />
        </View>
      )}
    </View>
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
    fontSize: 24,
    // marginRight: 10, // Descomentar si se regresa el titulo
    textAlign: "center", // Ajuste para centrar el título, eliminar si se regresa el titulo
    color: "#060B4D",
    fontFamily: "opensanssemibold",
    fontWeight: "bold",
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
    fontFamily: "opensansbold",
    fontSize: 16,
  },
  montoMinimo: {
    color: "#cecfdb",
    textAlign: "center",
    fontFamily: "opensans",
    fontSize: 14,
    marginTop: 5,
  },
  subTexto: {
    color: "#060B4D",
    fontFamily: "opensans",
    fontSize: 12,
    marginTop: 10,
  },
  inputWrapper: {
    flexDirection: "row",
    marginTop: -10,
    paddingHorizontal: 70,
    alignItems: "center",
    alignContent: "center",
  },
  inputNombre: {
    marginTop: 5,
    fontSize: 30,
    color: "#060B4D",
    fontFamily: "opensans",
  },
  inputMonto: {
    paddingTop: 10,
    fontSize: 30,
    color: "#060B4D",
    marginBottom: 10,
    fontFamily: "opensans",
  },
  dollarSign: {
    fontSize: 30,
    fontFamily: "opensans",
  },
  separacion: {
    height: 1,
    marginTop: 10,
    width: "100%",
    alignSelf: "center",
    backgroundColor: "#cecfdb",
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
    marginVertical: 5,
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
  textCondiciones: {
    color: "#060B4D",
    fontFamily: "opensans",
    fontSize: 12,
    marginTop: 10,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default DefinirInversion;
