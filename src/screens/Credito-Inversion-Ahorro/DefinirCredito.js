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
import MontoyPlazoCredito from "../../components/MontoyPlazoCredito";
import DatosGeneralesCredito from "../../components/DatosGeneralesCredito";
import DatosCotizadorCredito from "../../components/DatosCotizadorCredito";

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
    "1de4": require("../../../assets/images/1de4.png"),
    "2de4": require("../../../assets/images/2de4.png"),
    "3de4": require("../../../assets/images/3de4.png"),
    "4de4": require("../../../assets/images/4de4.png"),
    "1de3": require("../../../assets/images/1de3.png"),
    "2de3": require("../../../assets/images/2de3.png"),
    "3de3": require("../../../assets/images/3de3.png"),
  };

  const isAcceptable = credit.montoNumeric >= 10000 && credit.plazo;

  const handleAccept = () => {
    if (focus === "Comite") {
      if (credit.paso === 4) {
        navigation.navigate("MiTankef");
      } else if (credit.paso === 1) {
        setModalVisible(true);
      } else if (credit.paso === 2) {
        navigation.navigate("InfoGeneral", { flujo: flujo });
      } else {
        setCredit({
          ...credit,
          paso: credit.paso + 1,
        });
      }
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
            {/* Boton Tab Mi Red */}
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

            {/* Boton Tab Comité */}
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
              source={
                focus === "Mi Red"
                  ? imageMap[`${credit.paso}de4`]
                  : imageMap[`${credit.paso}de3`]
              }
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
          <MontoyPlazoCredito />
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

        {credit.paso >= 2 && (
          <>
            <DatosCotizadorCredito />

            {credit.paso >= 3 && <DatosGeneralesCredito />}
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
          {/* Botones de Atrás y Continuar */}
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
  /*inputNombre: {
    marginTop: 5,
    fontSize: 16,
    color: "#060B4D",
    fontFamily: "opensans",
  },*/

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
