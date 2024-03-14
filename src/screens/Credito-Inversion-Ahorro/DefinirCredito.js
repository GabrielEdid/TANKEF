// Importaciones de React Native y React
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Modal,
  Image,
} from "react-native";
import React, { useState, useCallback, useContext } from "react";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import { useRoute } from "@react-navigation/native";
import Slider from "@react-native-community/slider";
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
  const [modalVisible, setModalVisible] = useState(false);
  const [focus, setFocus] = useState("Mi Red");

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
    // Actualiza el valor numérico directamente con el valor del slider
    setCredit({ ...credit, montoNumeric: value });

    // Formatea el valor para mostrarlo adecuadamente en el input
    const formattedValue = value
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    // Actualiza el estado del texto del input con el valor formateado
    setCredit({ ...credit, montoShow: formattedValue });
  };

  const isAcceptable = credit.montoNumeric >= 10000 && credit.plazo;

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

  const handleAccept = () => {
    if (credit.paso === 5) {
      navigation.navigate("MiTankef");
    } else if (credit.paso === 1) {
      setModalVisible(true);
    } else if (credit.paso === 2) {
      setCredit({
        ...credit,
        paso: credit.paso + 1,
      });
      navigation.navigate("InfoGeneral", { flujo: flujo });
    } else {
      setCredit({
        ...credit,
        paso: credit.paso + 1,
      });
    }
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
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
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
                      focus === "Mi Red" ? "opensansbold" : "opensanssemibold",
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
                      focus === "Comite" ? "opensansbold" : "opensanssemibold",
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
                editable={credit.paso === 1}
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
              disabled={credit.paso === 1 ? false : true}
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
                disabled={credit.paso === 1 ? false : true}
              >
                <Text style={styles.textoTab}>6</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.tab,
                  {
                    backgroundColor:
                      credit.plazo === 12 ? "#2FF690" : "#F3F3F3",
                  },
                ]}
                onPress={() => [setCredit({ ...credit, plazo: 12 })]}
                disabled={credit.paso === 1 ? false : true}
              >
                <Text style={styles.textoTab}>12</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.tab,
                  {
                    backgroundColor:
                      credit.plazo === 18 ? "#2FF690" : "#F3F3F3",
                  },
                ]}
                onPress={() => [setCredit({ ...credit, plazo: 18 })]}
                disabled={credit.paso === 1 ? false : true}
              >
                <Text style={styles.textoTab}>18</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.tab,
                  {
                    backgroundColor:
                      credit.plazo === 24 ? "#2FF690" : "#F3F3F3",
                    marginRight: 0,
                  },
                ]}
                onPress={() => [setCredit({ ...credit, plazo: 24 })]}
                disabled={credit.paso === 1 ? false : true}
              >
                <Text style={styles.textoTab}>24</Text>
              </TouchableOpacity>
            </View>
          </View>
          {credit.paso === 1 && (
            <View style={styles.contenedores}>
              <Text style={styles.texto}>
                {focus === "Mi Red"
                  ? "Invita a tus amigos a unirse a tu red financiera. Cuantos más se sumen, más respaldo tendrás al solicitar un crédito. ¡Aprovecha el poder de la comunidad para obtener financiamiento!"
                  : "Al solicitar un crédito a través del comité, tu historial crediticio será revisado en buró de crédito y otros aspectos serán evaluados."}
              </Text>
            </View>
          )}
        </View>

        {credit.paso === 2 && (
          <>
            <View style={styles.contenedores}>
              <Text style={[styles.texto, { fontFamily: "opensansbold" }]}>
                Total a pagar
              </Text>
              <Text style={[styles.inputMonto, { marginTop: -10 }]}>
                {credit.total_a_pagar}
              </Text>
            </View>
            <View style={[styles.contenedores, { flexDirection: "row" }]}>
              <View style={{ flex: 1 }}>
                <Text style={styles.concepto}>Comisión por{"\n"}apertura</Text>
                <Text style={styles.valorConcepto}>
                  {credit.comision_por_apertura}
                </Text>
              </View>
              <Ionicons
                name="remove-outline"
                size={30}
                color="#e1e2ebff"
                style={styles.line}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.concepto}>Tasa de{"\n"}operación</Text>
                <Text style={styles.valorConcepto}>
                  {credit.tasa_de_operacion}
                </Text>
              </View>
              <Ionicons
                name="remove-outline"
                size={30}
                color="#e1e2ebff"
                style={styles.line}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.concepto}>Pago{"\n"}mensual</Text>
                <Text style={styles.valorConcepto}>{credit.pago_mensual}</Text>
              </View>
            </View>
          </>
        )}

        <View
          style={{
            paddingHorizontal: 10,
            flexDirection: credit.paso === 1 ? "column" : "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {credit.paso !== 1 && (
            <TouchableOpacity
              style={[
                styles.botonContinuar,
                {
                  marginRight: 5,
                  flex: 1,
                  backgroundColor: "white",
                  borderColor: "#060B4D",
                  borderWidth: 1,
                },
              ]}
              onPress={() => setCredit({ ...credit, paso: credit.paso - 1 })}
            >
              <Text style={[styles.textoBotonContinuar, { color: "#060B4D" }]}>
                Atrás
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[
              styles.botonContinuar,
              {
                flex: 1,
                marginLeft: credit.paso === 1 ? 0 : 5,
                width: credit.paso === 1 && "80%", // Ensure width is consistent for the "Continuar" button
                backgroundColor: !isAcceptable ? "#D5D5D5" : "#060B4D",
              },
            ]}
            onPress={handleAccept}
            disabled={!isAcceptable}
          >
            <Text
              style={[
                styles.textoBotonContinuar,
                { color: !isAcceptable ? "grey" : "white" },
              ]}
            >
              Continuar
            </Text>
          </TouchableOpacity>
        </View>

        {/* Modal del Cotizador */}
        <Modal animationType="slide" transparent={true} visible={modalVisible}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Image
                style={{ width: 63, height: 50, marginBottom: 10 }}
                source={require("../../../assets/images/BillCredito.png")}
              />
              <Text style={styles.modalText}>PagoMensual</Text>
              <Text style={[styles.modalText, { fontSize: 24 }]}>
                $6,522.59 MXN
              </Text>
              <View
                style={[
                  styles.contenedores,
                  {
                    flexDirection: "row",
                    marginTop: 5,
                    paddingHorizontal: 0,
                    paddingVertical: 0,
                  },
                ]}
              >
                <View style={{ flex: 1 }}>
                  <Text style={[styles.concepto, { fontSize: 13 }]}>
                    Comisión por{"\n"}apertura
                  </Text>
                  <Text style={styles.valorConcepto}>2.0%</Text>
                </View>
                <Ionicons
                  name="remove-outline"
                  size={30}
                  color="#e1e2ebff"
                  style={styles.line}
                />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.concepto, { fontSize: 13 }]}>
                    Tasa de{"\n"}operación
                  </Text>
                  <Text style={styles.valorConcepto}>12.0%</Text>
                </View>
                <Ionicons
                  name="remove-outline"
                  size={30}
                  color="#e1e2ebff"
                  style={styles.line}
                />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.concepto, { fontSize: 13 }]}>
                    Pago{"\n"}total
                  </Text>
                  <Text style={styles.valorConcepto}>$38,739.30</Text>
                </View>
              </View>
              <Text style={styles.modalTextBody}>
                Esta es una cotización preliminar, la tasa definitiva dependerá
                del análisis completo de tu solicitud.
              </Text>
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                  style={[
                    styles.botonContinuar,
                    {
                      marginBottom: 0,
                      marginRight: 5,
                      flex: 1,
                      backgroundColor: "white",
                      borderColor: "#060B4D",
                      borderWidth: 1,
                    },
                  ]}
                  onPress={() => [setModalVisible(false)]}
                >
                  <Text
                    style={[styles.textoBotonContinuar, { color: "#060B4D" }]}
                  >
                    Regresar
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.botonContinuar,
                    {
                      marginBottom: 0,
                      flex: 1,
                      marginLeft: 5,
                      backgroundColor: "#060B4D",
                    },
                  ]}
                  onPress={() => {
                    setModalVisible(false);
                    if (credit.paso === 1) {
                      setCredit({
                        ...credit,
                        paso: credit.paso + 1,
                        total_a_pagar: "$38,739.30",
                        pago_mensual: "$6,522.59",
                        comision_por_apertura: "2.0%",
                        tasa_de_operacion: "12.0%",
                      });
                    }
                  }}
                >
                  <Text
                    style={[styles.textoBotonContinuar, { color: "white" }]}
                  >
                    Aceptar
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
    marginTop: 15,
    marginBottom: 20,
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
    color: "#060B4D",
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
    padding: 15,
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
    marginTop: 10,
    fontSize: 12,
    color: "#060B4D",
    fontFamily: "opensans",
    textAlign: "center",
  },
});

export default DefinirCredito;
