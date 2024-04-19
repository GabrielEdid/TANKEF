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
} from "react-native";
import React, { useState, useCallback, useContext, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import { useRoute } from "@react-navigation/native";
// Importaciones de Componentes y Hooks
import { InvBoxContext } from "../../hooks/InvBoxContext";
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
  const { invBox, setInvBox } = useContext(InvBoxContext);
  const [totalInversion, setTotalInversion] = useState("");
  const [tasa, setTasa] = useState("");
  const [focusTab, setFocusTab] = useState("");
  const [modalAmortizacionVisible, setModalAmortizacionVisible] =
    useState(false);

  // Función para hacer la cotizacion al API
  useEffect(() => {
    const fetchCotizacion = async () => {
      const url = `/api/v1/simulator?term=${invBox.plazo}&type=investment&amount=${invBox.montoNumeric}`;

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
    if (invBox.montoNumeric >= 5000 && invBox.plazo) fetchCotizacion();
    else if (invBox.montoNumeric < 5000) {
      setTotalInversion("");
      setTasa("");
    }
  }, [invBox.montoNumeric, invBox.plazo]);

  const handlePress = async () => {
    const url = "/api/v1/investments";
    console.log(invBox.nombreInvBox, invBox.montoNumeric, invBox.plazo);
    const data = {
      investment: {
        name: invBox.nombreInvBox,
        amount: invBox.montoNumeric,
        term: invBox.plazo,
        condition: invBox.condiciones,
      },
    };

    const response = await APIPost(url, data);
    if (response.error) {
      console.error("Error al crear la inversión:", response.error);
      Alert.alert(
        "Error",
        "No se pudo crear la Inversión. Intente nuevamente."
      );
    } else {
      console.log("Inversión creada exitosamente:", response);
      navigation.navigate("Beneficiarios", {
        flujo: flujo,
        idInversion: response.data.data.id,
      });
    }
  };

  // Funcion para manejar el boton de cancelar
  const handleCancelar = () => {
    Alert.alert(
      "¿Deseas cancelar la Inversión?",
      "Si cancelas la Inversión, perderás la información ingresada hasta el momento.",
      [
        {
          text: "Cancelar Inversión",
          onPress: () => [navigation.navigate("Inicio")],
          style: "cancel",
        },
        {
          text: "Continuar Inversión",
        },
      ],
      { cancelable: true }
    );
  };

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
    setInvBox((prevState) => ({
      ...prevState,
      montoShow: formattedText,
      monto: cleanedInput,
    }));

    // Parse the raw input to a float for numeric validations or calculations
    const numericValue = parseFloat(cleanedInput.replace(/,/g, ""));
    setInvBox((prevState) => ({
      ...prevState,
      montoNumeric: numericValue || 0,
    }));
  };

  // Focus and Blur Handlers for the input
  const handleFocus = () => {
    // When focused, remove formatting for editing
    const rawNumericValue = invBox.monto.replace(/,/g, "");
    setInvBox((prevState) => ({ ...prevState, monto: rawNumericValue }));
  };

  const handleBlur = () => {
    // When input is blurred, apply formatting
    const formattedValue = formatInput(invBox.monto);
    setInvBox((prevState) => ({ ...prevState, monto: formattedValue }));
  };

  // Helper function to format the numeric input on blur
  const formatInput = (text) => {
    const numericValue = parseFloat(text.replace(/,/g, ""));
    return isNaN(numericValue) ? "" : numericValue.toLocaleString();
  };

  const isAcceptable =
    invBox.montoNumeric >= 5000 &&
    invBox.plazo &&
    invBox.nombreInvBox &&
    invBox.condiciones;

  const isTable = invBox.montoNumeric >= 5000 && invBox.plazo;

  // Componente Visual
  return (
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
        <Text style={styles.tituloPantalla}>Inversión</Text>
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
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
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
              value={invBox.nombreInvBox}
              maxLength={20}
              placeholderTextColor={"#b3b5c9ff"}
              placeholder="Mi inversión"
              onChangeText={(text) =>
                setInvBox({ ...invBox, nombreInvBox: text })
              }
            />
            <View style={styles.separacion} />
          </View>

          <View style={[styles.contenedores, { marginTop: -10 }]}>
            <Text style={styles.texto}>Monto de la inversión</Text>
            <View style={styles.inputWrapper}>
              <Text
                style={[
                  styles.dollarSign,
                  { color: invBox.monto ? "#060B4D" : "#b3b5c9ff" },
                ]}
              >
                $
              </Text>
              <TextInput
                style={styles.inputMonto}
                value={invBox.montoShow}
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
                    color: invBox.monto ? "#060B4D" : "#b3b5c9ff",
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
                  setInvBox({ ...invBox, plazo: 6 }),
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
                  setInvBox({ ...invBox, plazo: 12 }),
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
                  setInvBox({ ...invBox, plazo: 18 }),
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
                  setInvBox({ ...invBox, plazo: 24 }),
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
              onPress={() =>
                setInvBox({ ...invBox, condiciones: !invBox.condiciones })
              }
            >
              <Feather
                name={invBox.condiciones ? "check-square" : "square"}
                size={24}
                color="#060B4D"
              />
            </TouchableOpacity>
            <Text style={styles.subTexto}>
              Al continuar usted está aceptando{" "}
              <Text style={{ fontFamily: "opensansbold" }}>
                Términos y Condiciones
              </Text>
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.botonContinuar,
              { backgroundColor: isTable ? "white" : "#D5D5D5" },
            ]}
            onPress={() => {
              setModalAmortizacionVisible(true);
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
                marginBottom: 20,
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
        />
      </ScrollView>
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
});

export default DefinirInversion;
