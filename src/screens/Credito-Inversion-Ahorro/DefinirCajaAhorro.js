// Importaciones de React Native y React
import React, { useState, useCallback, useContext, useEffect } from "react";
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
  Modal,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import { useRoute } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import { ActivityIndicator } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";
// Importaciones de Componentes y Hooks
import ModalAmortizacion from "../../components/ModalAmortizacion";
import { useInactivity } from "../../hooks/InactivityContext";
import { FinanceContext } from "../../hooks/FinanceContext";
import { APIGet, APIPost } from "../../API/APIService";
import { Feather, Ionicons } from "@expo/vector-icons";

const screenWidth = Dimensions.get("window").width;
const widthFourth = screenWidth / 4 - 15;

const DefinirCajaAhorro = ({ navigation }) => {
  const route = useRoute();
  const { flujo } = route.params;
  const { resetTimeout } = useInactivity();
  const { finance, setFinance, resetFinance } = useContext(FinanceContext);
  const [retornoNeto, setRetornoNeto] = useState("");
  const [tasa, setTasa] = useState("");
  const [modalAmortizacionVisible, setModalAmortizacionVisible] =
    useState(false);
  const [loading, setLoading] = useState(false);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [dataMonto, setDataMonto] = useState([]);
  const [selectedLabel, setSelectedLabel] = useState("");

  useEffect(() => {
    const fetchCotizacion = async () => {
      const url = `/api/v1/simulator?term=36&type=box_saving&amount=${finance.monto}`;

      try {
        const response = await APIGet(url);
        if (response.error) {
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
    if (finance.monto) fetchCotizacion();
    else if (!finance.monto) {
      setRetornoNeto("");
      setTasa("");
    }
  }, [finance.monto]);

  const handlePress = async () => {
    resetTimeout();
    setLoading(true);
    const url = "/api/v1/box_savings";
    const data = {
      box_saving: {
        name: finance.nombreFinance,
        amount: finance.montoNumeric,
        term: 36,
        condition: finance.condiciones,
      },
    };

    const response = await APIPost(url, data);
    if (response.error) {
      setLoading(false);
      console.error("Error al crear la caja de ahorro:", response.error);
      const errorMessages = response.error.errors
        ? Object.values(response.error.errors).flat().join(". ")
        : response.error;
      Alert.alert("Error al crear la caja de ahorro", errorMessages);
    } else {
      setLoading(false);
      console.log("Caja de ahorro creada exitosamente:", response);
      navigation.navigate("Beneficiarios", {
        flujo: flujo,
        idInversion: response.data.data.id,
      });
    }
  };

  // Funcion para obtener los montos dinamicos de las cajas de ahorro
  const fetchDynamicAmounts = async () => {
    const url = `/api/v1/amounts_saving`;

    const result = await APIGet(url);

    if (result.error) {
      console.error(
        "Error al obtener los montos dinámicos del usuario:",
        result.error
      );
    } else {
      console.log("Montos dinámicos obtenidos:", result.data);
      const transformedData = result.data.data.map((amount) => {
        const formattedAmount = amount.toLocaleString("es-MX", {
          style: "currency",
          currency: "MXN",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });

        return {
          label: formattedAmount,
          value: amount,
        };
      });
      setDataMonto(transformedData);
    }
  };

  const handleCancelar = () => {
    resetTimeout();
    Alert.alert(
      "¿Deseas cancelar la Caja de Ahorro?",
      "Si cancelas la Caja de Ahorro, perderás la información ingresada hasta el momento.",
      [
        {
          text: "Si",
          onPress: () => [navigation.navigate("Inicio"), resetFinance()],
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

  // Efecto para obtener los montos dinámicos al cargar la pantalla
  useFocusEffect(
    useCallback(() => {
      fetchDynamicAmounts();
    }, [])
  );

  // const [dataMonto] = useState([
  //   { label: "$25,000.00 MXN", value: 25000 },
  //   { label: "$50,000.00 MXN", value: 50000 },
  //   { label: "$100,000.00 MXN", value: 100000 },
  // ]);

  const isAcceptable =
    finance.montoNumeric >= 2500 &&
    finance.nombreFinance &&
    finance.condiciones &&
    finance.plazo;

  const isTable = finance.montoNumeric >= 2500 && finance.plazo;

  const handleValueChange = (itemValue, itemIndex) => {
    const selectedItem = dataMonto[itemIndex];
    setSelectedLabel(selectedItem.label);
    setFinance({
      ...finance,
      monto: selectedItem.label,
      montoNumeric: itemValue,
    });
    setPickerVisible(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.tituloContainer}>
        {/* <MaskedView
          style={{ flex: 0.6 }}
          maskElement={<Text style={styles.titulo}>tankef</Text>}
        >
          <LinearGradient
            colors={["#2FF690", "#21B6D5"]}
            start={{ x: 1, y: 1 }}
            end={{ x: 0, y: 0 }}
            style={{ flex: 1 }}
          />
        </MaskedView> */}
        <Text style={styles.tituloPantalla}>Caja de ahorro</Text>
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
          <View style={[styles.contenedores, { paddingHorizontal: 20 }]}>
            <Text
              style={{
                fontFamily: "opensansbold",
                fontSize: 24,
                color: "#060B4D",
                textAlign: "center",
              }}
            >
              Simula tu caja de ahorro
            </Text>
          </View>
          <View style={[styles.contenedores, { marginTop: -10 }]}>
            <Text style={styles.texto}>Nombre de la caja de ahorro</Text>
            <TextInput
              style={styles.inputNombre}
              value={finance.nombreFinance}
              maxLength={20}
              placeholderTextColor={"#b3b5c9ff"}
              placeholder="Mi Caja de Ahorro"
              onChangeText={(text) => [
                setFinance({ ...finance, nombreFinance: text }),
                resetTimeout(),
              ]}
            />
            <View style={styles.separacion} />
          </View>

          <View style={[styles.contenedores, { marginTop: -10 }]}>
            <Text style={styles.texto}>¿Cuánto quieres ahorrar?</Text>
            <TouchableOpacity onPress={() => setPickerVisible(true)}>
              <Text
                style={[
                  styles.inputMonto,
                  { fontSize: finance.monto ? 30 : 20 },
                ]}
              >
                {finance.monto ? finance.monto : "Selecciona el monto"}
              </Text>
            </TouchableOpacity>
            <Modal
              visible={pickerVisible}
              transparent={true}
              animationType="slide"
              onRequestClose={() => setPickerVisible(false)}
            >
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Selecciona el monto</Text>
                  <Picker
                    selectedValue={finance.monto}
                    style={{ width: "100%", marginVertical: -10 }}
                    onValueChange={handleValueChange}
                  >
                    {dataMonto.map((item) => (
                      <Picker.Item
                        key={item.value}
                        label={item.label}
                        value={item.value}
                      />
                    ))}
                  </Picker>
                  <TouchableOpacity
                    style={[
                      styles.botonContinuar,
                      { backgroundColor: "#060B4D" },
                    ]}
                    onPress={() => setPickerVisible(false)}
                  >
                    <Text
                      style={[styles.textoBotonContinuar, { color: "white" }]}
                    >
                      Cerrar
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>

          <View style={[styles.contenedores]}>
            <Text style={styles.texto}>Elige el plazo de tu caja</Text>
            <TouchableOpacity
              style={[
                styles.tab,
                {
                  backgroundColor: finance.plazo === 36 ? "#2FF690" : "#F3F3F3",
                  marginRight: 0,
                },
              ]}
              onPress={() => [
                setFinance({ ...finance, plazo: 36 }),
                resetTimeout(),
              ]}
            >
              <Text style={styles.textoTab}>36</Text>
            </TouchableOpacity>

            <Text style={styles.regla}>
              La tasa de interés es variable y se ajusta según el mercado.
              Referencia la TIIE a 28 días, reportada en el DOF antes de la
              fecha de cálculo. La tasa de impuestos aplicada es la actual y
              puede cambiar.
            </Text>
          </View>

          <View style={[styles.contenedores, { paddingVertical: 10 }]}>
            <Text style={styles.texto}>Resultados</Text>
            <View
              style={[
                styles.contenedores,
                { flexDirection: "row", paddingVertical: 5 },
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
              Cancelar Caja de Ahorro
            </Text>
          </TouchableOpacity>
        </View>
        <ModalAmortizacion
          visible={modalAmortizacionVisible}
          onClose={() => {
            setModalAmortizacionVisible(false);
          }}
          flujo={"box_saving"}
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
    // marginRight: 55, // Descomentar si se regresa el título
    textAlign: "center", // Ajuste para centrar el título, eliminar si se regresa el titulo
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
    width: "100%",
    borderRadius: 5,
    marginRight: 10,
  },
  textoTab: {
    textAlign: "center",
    fontFamily: "opensanssemibold",
    fontSize: 18,
  },
  regla: {
    fontFamily: "opensans",
    fontSize: 12,
    color: "#060B4D",
    marginTop: 15,
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: "#060B4D",
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
    fontFamily: "opensanssemibold",
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: "opensansbold",
    color: "#060B4D",
    marginBottom: 10,
  },
});

export default DefinirCajaAhorro;
