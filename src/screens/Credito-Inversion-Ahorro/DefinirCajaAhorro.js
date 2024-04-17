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
import React, { useState, useCallback, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import { useRoute } from "@react-navigation/native";
import DropDownPicker from "react-native-dropdown-picker";
import Slider from "@react-native-community/slider";
import ModalAmortizacion from "../../components/ModalAmortizacion";
// Importaciones de Componentes y Hooks
import { APIGet, APIPost } from "../../API/APIService";
import { Feather, Ionicons } from "@expo/vector-icons";

// Se mide la pantalla para determinar medidas
const screenWidth = Dimensions.get("window").width;
const widthFourth = screenWidth / 4 - 15;

const DefinirCajaAhorro = ({ navigation }) => {
  const route = useRoute();
  const { flujo } = route.params;
  // Estados y Contexto
  const [nombreCaja, setNombreCaja] = useState("");
  const [monto, setMonto] = useState("");
  const [montoNumeric, setMontoNumeric] = useState(25000);
  const [open, setOpen] = useState(false);
  const [montoShow, setMontoShow] = useState("25,000");
  const [retornoNeto, setRetornoNeto] = useState("");
  const [tasa, setTasa] = useState("");
  const [condiciones, setCondiciones] = useState(false);
  const [modalAmortizacionVisible, setModalAmortizacionVisible] =
    useState(false);

  /* Funcion para manejar el cambio de texto en el input de monto
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
  };*/

  /* Funcion para manejar el cambio de valor en el slider
  const handleSliderChange = (value) => {
    // Actualiza el valor numérico directamente con el valor del slider
    setMontoNumeric(value);

    // Formatea el valor para mostrarlo adecuadamente en el input
    const formattedValue = value
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    // Actualiza el estado del texto del input con el valor formateado
    setMontoShow(formattedValue);
  };*/

  const isAcceptable = montoNumeric >= 25000 && nombreCaja && condiciones;

  const isTable = montoNumeric >= 25000;

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

  // Función para hacer la cotizacion al API
  useEffect(() => {
    const fetchCotizacion = async () => {
      const url = `/api/v1/simulator?term=36&type=box_saving&amount=${monto}`;

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
          setRetornoNeto(response.data.total);
          setTasa(response.data.rate);
        }
      } catch (error) {
        console.error("Error en la petición de cotización:", error);
        Alert.alert("Error", "Ha ocurrido un error al realizar la cotización.");
      }
    };
    if (monto) fetchCotizacion();
    else if (!monto) {
      setRetornoNeto("");
      setTasa("");
    }
  }, [monto]);

  const handlePress = async () => {
    const url = "/api/v1/box_savings";
    const data = {
      box_saving: {
        name: nombreCaja,
        amount: monto,
        term: 36,
        condition: true,
      },
    };

    const response = await APIPost(url, data);
    if (response.error) {
      // Manejar el error
      console.error("Error al crear la caja de ahorro:", response.error);
      Alert.alert(
        "Error",
        "No se pudo crear la Caja de Ahorro. Intente nuevamente."
      );
    } else {
      console.log("Caja de ahorro creada exitosamente:", response);
      navigation.navigate("Beneficiarios", {
        flujo: flujo,
        idInversion: response.data.data.id,
      });
    }
  };

  const [dataMonto] = useState([
    { label: "$25,000.00 MXN", value: 25000 },
    { label: "$50,000.00 MXN", value: 50000 },
  ]);

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
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <View style={{ flex: 1 }}>
          <View
            style={[
              styles.contenedores,
              { marginTop: 3, paddingHorizontal: 20 },
            ]}
          >
            <Text
              style={{
                fontFamily: "opensansbold",
                fontSize: 24,
                color: "#060B4D",
                textAlign: "center",
              }}
            >
              Ingresa los datos solicitados para iniciar tu caja de ahorro.
            </Text>
          </View>
          <View style={[styles.contenedores, { marginTop: -10 }]}>
            <Text style={styles.texto}>Nombre de la Caja de Ahorro</Text>
            <TextInput
              style={styles.inputNombre}
              value={nombreCaja}
              maxLength={20}
              placeholderTextColor={"#b3b5c9ff"}
              placeholder="Mi Caja de Ahorro"
              onChangeText={(text) => setNombreCaja(text)}
            />
            <View style={styles.separacion} />
          </View>

          <View style={[styles.contenedores, { marginTop: -10 }]}>
            <Text style={styles.texto}>Selecciona el monto a ahorrar</Text>
            <View style={styles.inputWrapper}>
              <DropDownPicker
                open={open}
                value={monto}
                items={dataMonto}
                placeholder="Elige una opción"
                setOpen={setOpen}
                setValue={setMonto}
                listMode="MODAL"
                modalProps={{
                  animationType: "slide",
                }}
                onChangeValue={(value) => setMonto(value)}
                style={styles.DropDownPicker}
                arrowIconStyle={{ tintColor: "#060B4D", width: 25 }}
                placeholderStyle={{
                  color: "#c7c7c9ff",
                  fontFamily: "opensanssemibold",
                  textAlign: "center",
                }}
                dropDownContainerStyle={styles.DropDownContainer}
                labelStyle={styles.selectionStyle}
                textStyle={styles.DropDownText}
              />
            </View>
            <View
              style={{
                backgroundColor: "#2FF690",
                marginTop: 10,
                flex: 1,
                borderRadius: 5,
                padding: 10,
                width: "95%",
              }}
            >
              <Text style={[styles.texto, { fontSize: 14 }]}>
                Por este momento solo contamos con una caja de ahorro de
                $25,000.00 y $50,000.00 a 36 meses.
              </Text>
            </View>
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
                <Text style={styles.concepto}>Tasa de operación</Text>
                <Text style={styles.valorConcepto}>{tasa ? tasa : "0%"}</Text>
              </View>
              <Ionicons
                name="remove-outline"
                size={30}
                color="#e1e2ebff"
                style={styles.line}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.concepto}>Retorno de inversión</Text>
                <Text style={styles.valorConcepto}>
                  {retornoNeto ? `${retornoNeto}` : "$0 MXN"}
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
              onPress={() => setCondiciones(!condiciones)}
            >
              <Feather
                name={condiciones ? "check-square" : "square"}
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
            onPress={() => {}}
          >
            <Text style={[styles.textoBotonContinuar, { color: "#F95C5C" }]}>
              Cancelar Caja de Ahorro
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
    marginRight: 35,
    fontSize: 20,
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
    paddingHorizontal: 10,
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
  DropDownPicker: {
    borderColor: "transparent",
    marginTop: 20,
    backgroundColor: "transparent",
    alignSelf: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#d3d4de",
  },
  DropDownText: {
    fontSize: 20,
    fontFamily: "opensanssemibold",
    color: "#060B4D",
    alignSelf: "center",
    textAlign: "left",
    padding: 5,
  },
  DropDownContainer: {
    marginTop: 10,
    borderColor: "transparent",
  },
  selectionStyle: {
    fontSize: 35,
    textAlign: "center",
    alignSelf: "center",
    paddingLeft: 15,
    color: "#060B4D",
    fontFamily: "opensanssemibold",
  },
});

export default DefinirCajaAhorro;
