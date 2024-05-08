// Importaciones de React Native y React
import React, { useState, useContext, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  ScrollView,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
// Importaciones de Componentes y Hooks
import { APIGet } from "../API/APIService";
import { UserContext } from "../hooks/UserContext";
import { Ionicons, Entypo, AntDesign } from "@expo/vector-icons";
import Movimiento from "./Movimiento";
import ModalEstatus from "./ModalEstatus";

const screenWidth = Dimensions.get("window").width;
const widthThird = screenWidth / 3;
const widthHalf = screenWidth / 2;

/**
 * `MiTankefInversion` es un componente que visualiza las inversiones personales y muestra
 * información relevante como el estatus, plazo y totales de inversiónes.
 * Está diseñado para ofrecer una visión rápida y efectiva de los recursos financieros del usuario
 * dentro de la pantalla MiTankef, es un componente que NO debe ser reusable.
 *
 * Props:
 * Este componente no recibe props directamente, pero se espera que la data necesaria para
 * las inversiones sea recuperada a través de una llamada a una API.
 *
 * Ejemplo de uso (o ver en MiTankef.js):
 * <MiTankefInversion />
 */

const MiTankefInversion = (props) => {
  const navigation = useNavigation();
  // Estados y Contexto
  const { user, setUser } = useContext(UserContext);
  const [focus, setFocus] = useState("Balance");
  const [investments, setInvestments] = useState([]);
  const [folio, setFolio] = useState("");
  const [plazo, setPlazo] = useState("");
  const [inversionInicial, setInversionInicial] = useState("");
  const [tasaInteres, setTasaInteres] = useState("");
  const [retornoNeto, setRetornoNeto] = useState("");
  const [investmentState, setInvestmentState] = useState("");
  const [effectTrigger, setEffectTrigger] = useState(false);
  const [currentID, setCurrentID] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);

  // Mapa de imágenes
  const imageMap = {
    Bill: require("../../assets/images/BillInvest.png"),
    // ... más imágenes
  };

  // Funcion para obtener las inversiones del usuario
  const fetchUserInvestments = async () => {
    const url = `/api/v1/users/${user.userID}/investments`;

    const result = await APIGet(url);

    if (result.error) {
      console.error(
        "Error al obtener las inversiones del usuario:",
        result.error
      );
    } else {
      const filteredResults = result.data.data.sort((a, b) => b.id - a.id);
      console.log("Resultados de las inversiones:", filteredResults);
      setInvestments(filteredResults);
      setCurrentID(filteredResults[0].id);
      setTasaInteres(filteredResults[0].rate_operation);
      fetchInvestment(filteredResults[0].id);
    }
  };

  // Funcion para obtener una inversion en especifico
  const fetchInvestment = async (id) => {
    const url = `/api/v1/investments/${id}`;

    const result = await APIGet(url);

    if (result.error) {
      console.error("Error al obtener la inversion:", result.error);
    } else {
      console.log("Resultados de la inversion:", result.data.data);
      setInvestmentState(result.data.data.aasm_state);
      handleInvestmentStateChange(result.data.data.aasm_state);
      setPlazo(result.data.data.term);
      setFolio(result.data.data.invoice_number);
      setInversionInicial(formatAmount(result.data.data.amount));
      setRetornoNeto("Falta");
    }
  };

  // Efecto para cargar los posts del feed al cargar la pantalla
  useFocusEffect(
    useCallback(() => {
      fetchUserInvestments();
    }, [])
  );

  // Formatea un monto a pesos mexicanos
  const formatAmount = (amount) => {
    const number = parseFloat(amount);
    return `${number.toLocaleString("es-MX", {
      style: "currency",
      currency: "MXN",
    })}`;
  };

  useEffect(() => {
    if (
      investmentState === "reviewing_documentation" ||
      investmentState === "rejected_documentation" ||
      investmentState === "signing_contract" ||
      investmentState === "sign_contract" ||
      investmentState === "request_payment" ||
      investmentState === "reviewing_payment"
    ) {
      setModalVisible(true);
    }
  }, [investmentState, effectTrigger]);

  const handleInvestmentStateChange = (newState) => {
    if (investmentState === newState) {
      setEffectTrigger((t) => !t); // Toggles the trigger to force useEffect execution
    }
    setInvestmentState(newState);
  };

  // Componente visual
  return (
    <View>
      {/* Vista de las distintas inversiones */}
      <ScrollView
        style={{
          marginBottom: 5,
        }}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      >
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("Crear", {
              screen: "DefinirInversion",
              params: { flujo: "Inversión" },
            })
          }
          style={styles.botonNuevaInversion}
        >
          <Entypo name="plus" size={30} color="black" />
          <Text
            style={{
              color: "#060B4D",
              fontFamily: "opensansbold",
              textAlign: "center",
              fontSize: 12,
              marginTop: -5,
              marginBottom: 5,
            }}
          >
            Nueva{"\n"}Inversión
          </Text>
        </TouchableOpacity>

        {/* Componente repetible */}
        {investments &&
          investments.length > 0 &&
          investments.map((investment, index) => (
            <TouchableOpacity
              key={investment.id || index}
              style={[
                styles.investmentNameContainer,
                {
                  backgroundColor:
                    currentID === investment.id ? "#2FF690" : "white",
                },
              ]}
              onPress={() => [
                fetchInvestment(investment.id),
                setCurrentID(investment.id),
                setTasaInteres(investment.rate_operation),
              ]}
            >
              <Image source={imageMap["Bill"]} style={styles.bill} />
              <Text
                style={styles.investmentName}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {investment.name}
              </Text>
            </TouchableOpacity>
          ))}
      </ScrollView>

      {investments && investments.length > 0 ? (
        <>
          <View style={styles.tabsContainer}>
            {/* Boton Tab Balance */}
            <TouchableOpacity
              style={styles.tabButton}
              onPress={() => setFocus("Balance")}
            >
              <Text
                style={[
                  styles.tabText,
                  {
                    color: focus === "Balance" ? "#060B4D" : "#9596AF",
                    fontFamily:
                      focus === "Balance" ? "opensansbold" : "opensanssemibold",
                  },
                ]}
              >
                Balance General
              </Text>
              {focus === "Balance" ? <View style={styles.focusLine} /> : null}
            </TouchableOpacity>

            {/* Boton Tab Movimientos */}
            <TouchableOpacity
              style={styles.tabButton}
              onPress={() => setFocus("Movimientos")}
            >
              <Text
                style={[
                  styles.tabText,
                  {
                    color: focus === "Movimientos" ? "#060B4D" : "#9596AF",
                    fontFamily:
                      focus === "Movimientos"
                        ? "opensansbold"
                        : "opensanssemibold",
                  },
                ]}
              >
                Movimientos
              </Text>
              {focus === "Movimientos" ? (
                <View style={styles.focusLine} />
              ) : null}
            </TouchableOpacity>
          </View>
          {/* Vista de la información total de las inversiónes */}
          {focus === "Balance" && (
            <>
              <View style={styles.containerBalance}>
                <Text style={styles.tituloMonto}>
                  Retorno de inversión neto
                </Text>
                <Text style={styles.monto}>{retornoNeto}</Text>
              </View>

              <View style={styles.container}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.concepto}>Folio de{"\n"}inversión</Text>
                  <Text style={styles.valorConcepto}>{folio}</Text>
                </View>
                <Ionicons
                  name="remove-outline"
                  size={30}
                  color="#e1e2ebff"
                  style={styles.line}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.concepto}>Plazo de{"\n"}inversión</Text>
                  <Text style={styles.valorConcepto}>{plazo} meses</Text>
                </View>
              </View>

              <View style={styles.container}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.concepto}>Inversión{"\n"}inicial</Text>
                  <Text style={styles.valorConcepto}>{inversionInicial}</Text>
                </View>
                <Ionicons
                  name="remove-outline"
                  size={30}
                  color="#e1e2ebff"
                  style={styles.line}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.concepto}>Tasa de{"\n"}interés</Text>
                  <Text style={styles.valorConcepto}>{tasaInteres}</Text>
                </View>
              </View>
            </>
          )}

          {focus === "Movimientos" && (
            <>
              <View>
                <Movimiento
                  movimiento={"Inicio Inversión"}
                  fecha={"10.ENE.2024"}
                  monto={"$10,000.00 MXN"}
                  positive={true}
                />
                <Movimiento
                  movimiento={"Abono"}
                  fecha={"10.FEB.2024"}
                  monto={"$5,000.00 MXN"}
                  positive={true}
                />
              </View>
            </>
          )}
        </>
      ) : (
        <>
          <Text style={styles.noInvestment}>No tienes Inversiones activas</Text>
          <Entypo
            name="emoji-sad"
            size={35}
            color="#060B4D"
            style={{ alignSelf: "center", marginTop: 10 }}
          />
        </>
      )}

      {
        <>
          {investmentState === "reviewing_documentation" && (
            <ModalEstatus
              titulo={"¡Atención!"}
              texto={
                "Tu documentación ha sido recibida, estamos en proceso de validación, te notificaremos para proceder con el siguiente paso.\n¡Gracias por tu paciencia!"
              }
              imagen={"Alert"}
              visible={modalVisible}
              onClose={() => setModalVisible(false)}
              onAccept={() => setModalVisible(false)}
            />
          )}

          {investmentState === "rejected_documentation" && (
            <ModalEstatus
              titulo={"¡Atención!"}
              texto={
                "Tu documentación ha sido rechazada, por favor revisa que coincidan con lo que se solicita y que sean vigentes antes de volver a enviarlos.\n¡Gracias por tu preferencia!"
              }
              imagen={"RedAlert"}
              visible={modalVisible}
              onClose={() => setModalVisible(false)}
              onAccept={() => [
                setModalVisible(false),
                navigation.navigate("Crear", {
                  screen: "Documentacion",
                  params: { flujo: "Inversión", idInversion: currentID },
                }),
              ]}
            />
          )}

          {investmentState === "sign_contract" && (
            <ModalEstatus
              titulo={"¡Felicidades!"}
              texto={
                "Tu información ha sido validada, por favor continua a la firma de contrato."
              }
              imagen={"Ready"}
              visible={modalVisible}
              onClose={() => setModalVisible(false)}
              onAccept={() => [
                setModalVisible(false),
                navigation.navigate("Crear", {
                  screen: "DefinirFirma",
                  params: { flujo: "Inversión", idInversion: currentID },
                }),
              ]}
            />
          )}

          {investmentState === "signing_contract" && (
            <ModalEstatus
              titulo={"¡Atención!"}
              texto={
                "La firma del contrato está pendiente. Por favor completa ese paso para continuar.\n¡Gracias!"
              }
              imagen={"RedAlert"}
              visible={modalVisible}
              onClose={() => setModalVisible(false)}
              onAccept={() => [
                setModalVisible(false),
                /*navigation.navigate("Crear", {
                  screen: "DefinirFirma",
                  params: { flujo: "Inversión" },
                }),*/
              ]}
            />
          )}

          {investmentState === "request_payment" && (
            <ModalEstatus
              titulo={"¡Atención!"}
              texto={
                "Tu pago está pendiente. Por favor, completa la transacción para continuar."
              }
              imagen={"RedAlert"}
              visible={modalVisible}
              onClose={() => setModalVisible(false)}
              onAccept={() => [
                setModalVisible(false),
                navigation.navigate("Crear", {
                  screen: "OrdenPago",
                  params: { flujo: "Inversión", idInversion: currentID },
                }),
              ]}
            />
          )}

          {investmentState === "reviewing_payment" && (
            <ModalEstatus
              titulo={"¡Depósito exitoso!"}
              texto={
                "¡Hemos recibido el comprobante de depósito, gracias por tu transacción!. Pronto recibirás un correo con la confirmación de tu inversión."
              }
              imagen={"Ready"}
              visible={modalVisible}
              onClose={() => setModalVisible(false)}
              onAccept={() => [
                setModalVisible(false),
                /*navigation.navigate("Crear", {
                  screen: "DefinirFirma",
                  params: { flujo: "Inversión" },
                }),*/
              ]}
            />
          )}
        </>
      }
    </View>
  );
};

// Estilos del componente
const styles = StyleSheet.create({
  tituloMonto: {
    fontFamily: "opensans",
    fontSize: 14,
    color: "#060B4D",
  },
  monto: {
    fontFamily: "opensansbold",
    fontSize: 22,
    color: "#060B4D",
  },
  line: {
    transform: [{ rotate: "90deg" }],
    right: 10,
  },
  investmentNameContainer: {
    alignItems: "center",
    marginRight: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    width: 120,
  },
  investmentName: {
    color: "#060B4D",
    fontFamily: "opensanssemibold",
    textAlign: "center",
    fontSize: 12,
    marginTop: 2.5,
  },
  noInvestment: {
    color: "#060B4D",
    fontFamily: "opensanssemibold",
    textAlign: "center",
    alignSelf: "center",
    fontSize: 16,
    marginLeft: 10,
    marginTop: 75,
  },
  bill: {
    height: 20,
    width: 20,
    marginBottom: 5,
    tintColor: "#060B4D",
  },
  botonNuevaInversion: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 17.5,
    width: 120,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  //Estilos para la segunda barra de Tabs
  tabsContainer: {
    backgroundColor: "white",
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
  container: {
    backgroundColor: "white",
    marginTop: 3,
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  containerBalance: {
    justifyContent: "space-between",
    backgroundColor: "white",
    paddingHorizontal: 20,
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
    fontFamily: "opensanssemibold",
    fontSize: 16,
    color: "#060B4D",
    textAlign: "center",
  },
  seperacion: {
    width: "100%",
    height: 1,
    borderRadius: 100,
    marginVertical: 15,
    backgroundColor: "#d1d2deff",
  },
});

export default MiTankefInversion;
