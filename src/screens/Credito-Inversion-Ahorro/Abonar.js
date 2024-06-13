// Importaciones de React Native y React
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Modal,
  Alert,
  TextInput,
} from "react-native";
import React, { useState, useCallback, useEffect, useContext } from "react";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useFocusEffect, useRoute } from "@react-navigation/native";
// Importaciones de Componentes y Hooks
import { FinanceContext } from "../../hooks/FinanceContext";
import { APIGet } from "../../API/APIService";
import { useInactivity } from "../../hooks/InactivityContext";
import { Feather, MaterialIcons, FontAwesome } from "@expo/vector-icons";

// Se mide la pantalla para determinar medidas
const screenWidth = Dimensions.get("window").width;
const widthHalf = screenWidth / 2;

const Abonar = ({ navigation }) => {
  const route = useRoute();
  const { flujo, idInversion } = route.params;
  // Estados y Contexto
  const { resetTimeout } = useInactivity();
  const { finance, setFinance, resetFinance } = useContext(FinanceContext);
  const [beneficiario, setBeneficiario] = useState(false);
  const [institucion, setInstitucion] = useState(false);
  const [cuentaClabe, setCuentaClabe] = useState(false);
  const [referencia, setReferencia] = useState(false);
  const [monto, setMonto] = useState(false);

  // Obtener la orden de pago del usuario
  const fetchOrden = async () => {
    const url = `/api/v1/investments/${idInversion}`;

    const result = await APIGet(url);

    if (result.error) {
      console.error(
        "Error al obtener la orden de pago del usuario:",
        result.error
      );
      Alert.alert("Error", "Error al obtener la orden de pago.");
    } else {
      console.log(
        "Resultado de la orden de pago del usuario:",
        result.data.data.stp_account
      );
      setBeneficiario(titleCase(result.data.data.stp_account.beneficiary));
      setInstitucion(result.data.data.stp_account.institution);
      setCuentaClabe(result.data.data.stp_account.clabe);
      setReferencia(result.data.data.stp_account.reference);
      setMonto(formatAmount(result.data.data.stp_account.amount));
    }
  };

  // Efecto para obtener las cuentas bancarias del usuario
  useFocusEffect(
    useCallback(() => {
      fetchOrden();
    }, [])
  );

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

  // Función para convertir la primera letra de cada palabra en mayúscula
  function titleCase(str) {
    return str
      .toLowerCase()
      .split(" ")
      .map(function (word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(" ");
  }

  // Formatea un monto a pesos mexicanos
  const formatAmount = (amount) => {
    const number = parseFloat(amount);
    return `${number.toLocaleString("es-MX", {
      style: "currency",
      currency: "MXN",
    })}`;
  };

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
            start={{ x: 0.8, y: 0.8 }}
            end={{ x: 0, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </MaskedView>
        <Text
          style={[
            styles.tituloPantalla,
            {
              fontSize: flujo === "Caja de ahorro" ? 20 : 24,
              marginRight:
                flujo === "Caja de ahorro"
                  ? 55
                  : flujo === "Crédito"
                  ? -20
                  : 10,
            },
          ]}
        >
          {flujo}
        </Text>
      </View>

      <View style={{ flex: 1 }}>
        <KeyboardAwareScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          scrollEnabled={false}
          enableOnAndroid={true}
          style={styles.scrollV}
          keyboardShouldPersistTaps="handled"
          extraScrollHeight={100}
          onScroll={() => resetTimeout()}
          scrollEventThrottle={400}
        >
          <View style={{ flex: 1 }}>
            <View style={styles.seccion}>
              <Text style={styles.tituloSeccion}>Abonar</Text>
              <Text style={styles.bodySeccion}>
                Si deseas abonar a tu cuenta de inversión, puedes hacerlo
                introduciendo los datos solicitados.
              </Text>
            </View>

            {/* Campos para introducir los datos bancarios */}
            <View style={[styles.contenedores]}>
              <Text style={styles.texto}> ¿Cuánto quieres abonar?</Text>
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
          </View>
        </KeyboardAwareScrollView>
        {/* Boton de Aceptar */}
        <TouchableOpacity
          style={styles.botonContinuar}
          onPress={() => [navigation.navigate("MiTankef"), resetTimeout()]}
        >
          <Text style={styles.textoBotonContinuar}>Aceptar</Text>
        </TouchableOpacity>
      </View>
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
  seccion: {
    marginTop: 5,
    backgroundColor: "white",
    alignItems: "center",
    padding: 15,
  },
  tituloSeccion: {
    fontSize: 25,
    color: "#060B4D",
    fontFamily: "opensanssemibold",
  },
  inputWrapper: {
    flexDirection: "row",
    marginTop: -10,
    paddingHorizontal: 70,
    alignItems: "center",
    alignContent: "center",
  },
  contenedores: {
    backgroundColor: "white",
    paddingHorizontal: 12,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 3,
  },
  inputMonto: {
    paddingTop: 10,
    fontSize: 30,
    color: "#060B4D",
    marginBottom: 10,
    fontFamily: "opensans",
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
  bodySeccion: {
    marginTop: 10,
    marginBottom: 10,
    fontSize: 14,
    color: "#060B4D",
    fontFamily: "opensanssemibold",
    textAlign: "center",
  },
  tituloCampo: {
    marginTop: 10,
    paddingLeft: 15,
    marginBottom: 10,
    fontSize: 14,
    color: "#9c9db8",
    fontFamily: "opensanssemibold",
  },
  input: {
    paddingLeft: 15,
    fontSize: 16,
    width: "100%",
    color: "#060B4D",
    marginBottom: 10,
    fontFamily: "opensanssemibold",
  },
  botonContinuar: {
    marginTop: 15,
    marginBottom: 30,
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
  // Estilos del Modal
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)", // Fondo semitransparente
  },
  modalView: {
    width: "80%", // Asegúrate de que el contenedor del modal tenga un ancho definido.
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    fontSize: 30,
    color: "#060B4D",
    fontFamily: "opensanssemibold",
    textAlign: "center",
  },
  modalTextBody: {
    marginTop: 5,
    marginBottom: 5,
    fontSize: 14,
    color: "#060B4D",
    fontFamily: "opensans",
    textAlign: "center",
  },
});

export default Abonar;
