// Importaciones de React Native y React
import React, { useState, useCallback, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  ScrollView,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { DateTime } from "luxon";
// Importaciones de Componentes y Hooks
import { APIGet } from "../API/APIService";
import { UserContext } from "../hooks/UserContext";
import { Ionicons, Entypo, AntDesign, FontAwesome } from "@expo/vector-icons";
import Movimiento from "./Movimiento";
import ModalEstatus from "./ModalEstatus";
import { applyActionCode } from "firebase/auth";

const screenWidth = Dimensions.get("window").width;
const widthThird = screenWidth / 3;
const widthHalf = screenWidth / 2;

/**
 * `MiTankefCredito` es un componente que visualiza los creditos personales y muestra
 * información relevante como el estatus, plazo, rendimiento y totales de crédito.
 * Está diseñado para ofrecer una visión rápida y efectiva de los recursos financieros del usuario
 * dentro de la pantalla MiTankef, es un componente que NO debe ser reusable.
 *
 * Props:
 * Este componente no recibe props directamente, pero se espera que la data necesaria para
 * los creditos sea recuperada a través de una llamada a una API.
 *
 * Ejemplo de uso (o ver en MiTankef.js):
 * <MiTankefCredito />
 */

const MiTankefCredito = (props) => {
  const navigation = useNavigation();
  // Estados y Contexto
  const { user, setUser } = useContext(UserContext); //Contexto de usuario
  const [focus, setFocus] = useState("Balance"); //Balance o Movimientos
  const [credits, setCredits] = useState([]); //Inversiones del usuario
  const [currentID, setCurrentID] = useState(null); //ID de la inversion actual
  const [creditState, setCreditState] = useState(null); //Estado de la inversion
  const [plazo, setPlazo] = useState(null); //Plazo de la inversion
  const [folio, setFolio] = useState(null); //Folio de la inversion
  const [tasaOperacion, setTasaOperacion] = useState(null); //Tasa de interes
  const [comisionApertura, setComisionApertura] = useState(null); //Comision de apertura
  const [pagoMensual, setPagoMensual] = useState(null); //Pago mensual
  const [totalPagar, setTotalPagar] = useState(null); //Total a pagar
  const [fecha, setFecha] = useState(null); //Fecha de creación
  const [aprovacion, setAprovacion] = useState(null); //Aprovacion de la inversion
  const [modalVisible, setModalVisible] = useState(false); //Modal de inversion
  const [effectTrigger, setEffectTrigger] = useState(false); //Trigger para efectos

  // Mapa de imágenes
  const imageMap = {
    Bill: require("../../assets/images/BillInvest.png"),
    Card: require("../../assets/images/tarjeta.png"),

    // ... más imágenes
  };

  // Funcion para obtener las inversiones del usuario
  const fetchUserCredits = async () => {
    const url = `/api/v1/users/credits`;

    const result = await APIGet(url);

    if (result.error) {
      console.error("Error al obtener los creditos del usuario:", result.error);
    } else {
      const filteredResults = result.data.data.sort((a, b) => b.id - a.id);
      console.log("Resultados de los creditos:", filteredResults);
      setCredits(filteredResults);
      fetchCredit(filteredResults[0].id);
      setCreditState(filteredResults[0].aasm_state);
      handleCreditStateChange(filteredResults[0].aasm_state);
      setComisionApertura(filteredResults[0].commision_for_oppening);
      setPlazo(filteredResults[0].term);
      setFolio(filteredResults[0].invoice_number);
      setPagoMensual(filteredResults[0].monthly_payment);
      setTasaOperacion(filteredResults[0].rate_operation);
      setTotalPagar(filteredResults[0].total_to_pay);
      setFecha(filteredResults[0].created_at);
      setCurrentID(filteredResults[0].id);
      setAprovacion(filteredResults[0].type_approval);
      setTasaInteres(filteredResults[0].rate_operation);
    }
  };

  // Funcion para obtener una inversion en especifico
  const fetchCredit = async (id) => {
    const url = `/api/v1/credits/${id}`;

    const result = await APIGet(url);

    if (result.error) {
      console.error("Error al obtener el credito:", result.error);
    } else {
      console.log("Resultado del credito:", result.data.data);
      setCreditState(result.data.data.aasm_state);
      handleCreditStateChange(result.data.data.aasm_state);
      setComisionApertura(result.data.data.commision_for_oppening);
      setPlazo(result.data.data.term);
      setFolio(result.data.data.invoice_number);
      setPagoMensual(result.data.data.monthly_payment);
      setTasaOperacion(result.data.data.rate_operation);
      setTotalPagar(result.data.data.total_to_pay);
      setFecha(result.data.data.created_at);
      setCurrentID(result.data.data.id);
      setAprovacion(result.data.data.type_approval);
    }
  };

  // Efecto para cargar los posts del feed al cargar la pantalla
  useFocusEffect(
    useCallback(() => {
      fetchUserCredits();
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

  const formatDate = (isoDateString) => {
    const date = DateTime.fromISO(isoDateString);
    return date.toFormat("dd.MM.yyyy");
  };

  useEffect(() => {
    if (
      creditState === "reviewing_documentation" ||
      creditState === "rejected_documentation" ||
      creditState === "request_network" ||
      creditState === "signing_contract" ||
      creditState === "sign_contract" ||
      creditState === "request_payment" ||
      creditState === "reviewing_payment"
    ) {
      setModalVisible(true);
    }
  }, [creditState, effectTrigger]);

  const handleCreditStateChange = (newState) => {
    if (creditState === newState) {
      setEffectTrigger((t) => !t); // Toggles the trigger to force useEffect execution
    }
    setCreditState(newState);
  };

  // Componente visual
  return (
    <View>
      {/* Vista de los distintos créditos */}
      {credits.length === 0 && (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("Crear", {
              screen: "DefinirCredito",
              params: { flujo: "Crédito" },
            })
          }
          style={styles.botonNuevoCredito}
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
            Nuevo{"\n"}Crédito
          </Text>
        </TouchableOpacity>
      )}

      {credits.length > 0 ? (
        <>
          <ScrollView
            style={{
              marginBottom: 5,
            }}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          >
            {/* Componente repetible */}

            {credits &&
              credits.length > 0 &&
              credits.map((credit, index) => (
                <TouchableOpacity
                  key={credit.id || index}
                  style={[
                    styles.creditNameContainer,
                    {
                      backgroundColor:
                        currentID === credit.id ? "#2FF690" : "white",
                    },
                  ]}
                  onPress={() => [
                    fetchCredit(credit.id),
                    setCurrentID(credit.id),
                  ]}
                >
                  <FontAwesome name="credit-card" size={24} color="#060B4D" />
                  <Text
                    style={{
                      color: "#060B4D",
                      fontFamily: "opensanssemibold",
                      textAlign: "center",
                      fontSize: 12,
                    }}
                  >
                    Crédito{"\n"}
                    {formatDate(credit.created_at)}
                  </Text>
                </TouchableOpacity>
              ))}
          </ScrollView>

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
              <View
                style={{
                  justifyContent: "space-between",
                  backgroundColor: "white",
                  paddingHorizontal: 20,
                  paddingVertical: 15,
                  alignItems: "center",
                  marginTop: 3,
                }}
              >
                <Text style={styles.tituloMonto}>Pago mensual</Text>
                <Text style={styles.monto}>
                  {formatAmount(pagoMensual)} MXN
                </Text>
              </View>

              <View style={styles.container}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.concepto}>Folio de{"\n"}crédito</Text>
                  <Text style={styles.valorConcepto}>{folio}</Text>
                </View>
                <Ionicons
                  name="remove-outline"
                  size={30}
                  color="#e1e2ebff"
                  style={styles.line}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.concepto}>Tasa de{"\n"}operación</Text>
                  <Text style={styles.valorConcepto}>{tasaOperacion}%</Text>
                </View>
                <Ionicons
                  name="remove-outline"
                  size={30}
                  color="#e1e2ebff"
                  style={styles.line}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.concepto}>Total a{"\n"}pagar</Text>
                  <Text style={styles.valorConcepto}>
                    {formatAmount(totalPagar)}
                  </Text>
                </View>
              </View>

              <View style={styles.container}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.concepto}>Fecha de{"\n"}creación</Text>
                  <Text style={styles.valorConcepto}>{formatDate(fecha)}</Text>
                </View>
                <Ionicons
                  name="remove-outline"
                  size={30}
                  color="#e1e2ebff"
                  style={styles.line}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.concepto}>Plazo del{"\n"}crédito</Text>
                  <Text style={styles.valorConcepto}>{plazo} meses</Text>
                </View>
                <Ionicons
                  name="remove-outline"
                  size={30}
                  color="#e1e2ebff"
                  style={styles.line}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.concepto}>Tipo de{"\n"}crédito</Text>
                  <Text style={styles.valorConcepto}>{aprovacion}</Text>
                </View>
              </View>
            </>
          )}

          {focus === "Movimientos" && (
            <>
              <View>
                <Movimiento
                  movimiento={"Inicio Crédito"}
                  fecha={"10.ENE.2024"}
                  monto={"$10,000.00 MXN"}
                  positive={true}
                />
                <Movimiento
                  movimiento={"Pago mensual"}
                  fecha={"10.FEB.2024"}
                  monto={"$2,174.20 MXN"}
                  positive={false}
                />
              </View>
            </>
          )}
        </>
      ) : (
        <>
          <Text style={styles.noCredit}>No tienes Créditos activos</Text>
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
          {creditState === "reviewing_documentation" && (
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

          {creditState === "rejected_documentation" && (
            <ModalEstatus
              titulo={"¡Atención!"}
              texto={
                "Se encontraron inconsistencias en tu proceso, la solicitud ha sido rechazada."
              }
              imagen={"RedAlert"}
              visible={modalVisible}
              onClose={() => setModalVisible(false)}
              onAccept={() => [setModalVisible(false)]}
            />
          )}

          {creditState === "request_network" && (
            <ModalEstatus
              titulo={"¡Felicidades!"}
              texto={
                "Tu información ha sido validada, porfavor continua seleccionando tus obligados solidarios"
              }
              imagen={"Ready"}
              visible={modalVisible}
              onClose={() => setModalVisible(false)}
              onAccept={() => [
                setModalVisible(false),
                navigation.navigate("Crear", {
                  screen: "ObligadosSolidarios",
                  params: { flujo: "Crédito", idInversion: currentID },
                }),
              ]}
            />
          )}

          {creditState === "sign_contract" && (
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
                  params: { flujo: "Crédito", idInversion: currentID },
                }),
              ]}
            />
          )}

          {creditState === "signing_contract" && (
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

          {creditState === "request_payment" && (
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
                  params: { flujo: "Crédito", idInversion: currentID },
                }),
              ]}
            />
          )}

          {creditState === "reviewing_payment" && (
            <ModalEstatus
              titulo={"¡Depósito exitoso!"}
              texto={
                "¡Hemos recibido el comprobante de depósito, gracias por tu transacción!. Pronto recibirás un correo con la confirmación de tu crédito."
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
  bill: {
    height: 20,
    width: 20,
    marginBottom: 5,
    tintColor: "#060B4D",
  },
  botonNuevoCredito: {
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
  creditNameContainer: {
    alignItems: "center",
    marginLeft: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    width: 120,
    backgroundColor: "#2FF690",
  },
  container: {
    backgroundColor: "white",
    marginTop: 3,
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 10,
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
  noCredit: {
    color: "#060B4D",
    fontFamily: "opensanssemibold",
    textAlign: "center",
    alignSelf: "center",
    fontSize: 16,
    marginLeft: 10,
    marginTop: 75,
  },
});

export default MiTankefCredito;
