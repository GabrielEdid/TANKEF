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
import { parseISO, format, set } from "date-fns";
// Importaciones de Componentes y Hooks
import { APIGet } from "../API/APIService";
import { useInactivity } from "../hooks/InactivityContext";
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
  const { resetTimeout } = useInactivity();
  const { user, setUser } = useContext(UserContext);
  const [focus, setFocus] = useState("Balance");
  const [investments, setInvestments] = useState([]);
  const [folio, setFolio] = useState("");
  const [plazo, setPlazo] = useState("");
  const [inversionInicial, setInversionInicial] = useState("");
  const [tasaOperacion, setTasaOperacion] = useState("");
  const [estatus, setEstatus] = useState("");
  const [abono, setAbono] = useState("");
  const [retornoInversion, setRetornoInversion] = useState("");
  const [montoInicial, setMontoInicial] = useState("");
  const [montoAcumulado, setMontoAcumulado] = useState("");
  const [cuenta, setCuenta] = useState("");
  const [fechaCreacion, setFechaCreacion] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [investmentState, setInvestmentState] = useState("");
  const [payments, setPayments] = useState([]);
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
      setTasaOperacion(filteredResults[0].rate_operation);
      fetchInvestment(filteredResults[0].id);
    }
  };

  // Funcion para obtener una inversion en especifico
  const fetchInvestment = async (id) => {
    resetTimeout();
    const url = `/api/v1/investments/${id}`;

    const result = await APIGet(url);

    if (result.error) {
      console.error("Error al obtener la inversion:", result.error);
    } else {
      console.log("Resultados de la inversion:", result.data.data);
      setInvestmentState(result.data.data.aasm_state);
      handleInvestmentStateChange(result.data.data.aasm_state);
      setEstatus(result.data.data.current_state);
      setAbono("Falta");
      setMontoInicial(formatAmount(result.data.data.amount));
      setRetornoInversion("Falta");
      setPlazo(result.data.data.term);
      setMontoAcumulado("Falta");
      setFolio(result.data.data.invoice_number);
      //setCuenta(formatBankAccount(result.data.data.bank_account));
      setCuenta(result.data.data.bank_account.short_name);
      setFechaCreacion(formatDate(result.data.data.created_at));
      setFechaInicio("Falta");
      setFechaFin("Falta");
      fetchPayments(id);
    }
  };

  // Funcion para obtener los movimientos de una inversion en especifico
  const fetchPayments = async (id) => {
    resetTimeout();
    const url = `/api/v1/investments/${id}/investment_payments`;

    const result = await APIGet(url);

    if (result.error) {
      console.error(
        "Error al obtener los movimientos de la inversión:",
        result.error
      );
    } else {
      console.log("Resultados de los movimientos:", result.data.data);
      const newPayments = result.data.data.sort(
        (a, b) => new Date(a.start_date) - new Date(b.start_date)
      );
      setPayments(newPayments);
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

  const formatDate = (isoString) => {
    const date = parseISO(isoString);
    return format(date, "dd/MM/yyyy hh:mm aa");
  };

  const formatBankAccount = (bankAccount) => {
    const { account } = bankAccount;
    if (!account || account.length < 4) {
      throw new Error("Invalid account number");
    }
    const maskedAccount =
      account.slice(0, -4).replace(/./g, "*") + account.slice(-4);
    return `${maskedAccount}`;
  };

  // useEffect(() => {
  //   if (
  //     investmentState === "reviewing_documentation" ||
  //     investmentState === "rejected_documentation" ||
  //     investmentState === "signing_contract" ||
  //     investmentState === "sign_contract" ||
  //     investmentState === "request_payment" ||
  //     investmentState === "reviewing_payment"
  //   ) {
  //     setModalVisible(true);
  //   }
  // }, [investmentState, effectTrigger]);

  const handleInvestmentStateChange = (newState) => {
    if (investmentState === newState) {
      setEffectTrigger((t) => !t); // Toggles the trigger to force useEffect execution
    }
    setInvestmentState(newState);
  };

  const estatusTextColor = () => {
    if (estatus === "En curso") return "#2ba64e";
    else if (estatus === "Completado") return "#007af5";
    else if (estatus === "En espera") return "#6e737a";
    else if (estatus === "En proceso") return "#fa811e";
    else if (estatus === "Cancelado" || estatus === "Rechazada")
      return "#d93840";
  };

  const estatusBackgroundColor = () => {
    if (estatus === "En curso") return "#ceedd4";
    else if (estatus === "Completado") return "#cce6ff";
    else if (estatus === "En espera") return "#e1e3e6";
    else if (estatus === "En proceso") return "#ffe6d1";
    else if (estatus === "Cancelado" || estatus === "Rechazada")
      return "#f7d7d9";
  };

  // Componente visual
  return (
    <>
      <View style={{ flex: 1 }}>
        {/* Vista de las distintas inversiones */}
        <ScrollView
          style={{
            marginBottom: 5,
          }}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          onScroll={() => resetTimeout()}
        >
          <TouchableOpacity
            onPress={() => [
              navigation.navigate("Crear", {
                screen: "DefinirInversion",
                params: { flujo: "Inversión" },
              }),
              resetTimeout(),
            ]}
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
              Nueva Inversión
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
                  setTasaOperacion(investment.rate_operation),
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
                onPress={() => [setFocus("Balance"), resetTimeout()]}
              >
                <Text
                  style={[
                    styles.tabText,
                    {
                      color: focus === "Balance" ? "#060B4D" : "#9596AF",
                      fontFamily:
                        focus === "Balance"
                          ? "opensansbold"
                          : "opensanssemibold",
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
                onPress={() => [setFocus("Movimientos"), resetTimeout()]}
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
                <View style={styles.container}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.concepto}>Estatus</Text>
                    <TouchableOpacity
                      style={[
                        styles.estatusContainer,
                        {
                          borderColor: estatusTextColor(),
                          backgroundColor: estatusBackgroundColor(),
                        },
                      ]}
                      onPress={() => {
                        setModalVisible(true);
                      }}
                    >
                      <AntDesign
                        name="infocirlce"
                        size={18}
                        color={estatusTextColor()}
                        style={{ marginRight: 5 }}
                      />
                      <Text
                        style={[
                          styles.valorConcepto,
                          { color: estatusTextColor() },
                        ]}
                      >
                        {estatus}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <Ionicons
                    name="remove-outline"
                    size={30}
                    color="#e1e2ebff"
                    style={styles.line}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.concepto}>Plazo de inversión</Text>
                    <Text style={styles.valorConcepto}>{plazo} meses</Text>
                  </View>
                </View>

                <View style={styles.container}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.concepto}>Monto inversión</Text>
                    <Text style={styles.valorConcepto}>{montoInicial}</Text>
                  </View>
                  <Ionicons
                    name="remove-outline"
                    size={30}
                    color="#e1e2ebff"
                    style={styles.line}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.concepto}>Monto acumulado</Text>
                    <Text style={styles.valorConcepto}>{montoAcumulado}</Text>
                  </View>
                </View>

                <View style={styles.container}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.concepto}>Tasa de operación</Text>
                    <Text style={styles.valorConcepto}>{tasaOperacion}%</Text>
                  </View>
                  <Ionicons
                    name="remove-outline"
                    size={30}
                    color="#e1e2ebff"
                    style={styles.line}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.concepto}>Cuenta</Text>
                    <Text style={styles.valorConcepto}>{cuenta}</Text>
                  </View>
                </View>

                <View style={styles.container}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.concepto}>Folio</Text>
                    <Text style={styles.valorConcepto}>{folio}</Text>
                  </View>
                  <Ionicons
                    name="remove-outline"
                    size={30}
                    color="#e1e2ebff"
                    style={styles.line}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.concepto}>Fecha de creación</Text>
                    <Text style={styles.valorConcepto}>{fechaCreacion}</Text>
                  </View>
                </View>

                <View style={styles.container}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.concepto}>Fecha de inicio</Text>
                    <Text style={styles.valorConcepto}>{fechaInicio}</Text>
                  </View>
                  <Ionicons
                    name="remove-outline"
                    size={30}
                    color="#e1e2ebff"
                    style={styles.line}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.concepto}>Fecha de finalización</Text>
                    <Text style={styles.valorConcepto}>{fechaFin}</Text>
                  </View>
                </View>
              </>
            )}

            {focus === "Movimientos" && (
              <>
                {payments.length > 0 ? (
                  payments.map((payment, index) => (
                    <View>
                      <Movimiento
                        key={payment.id || index}
                        movimiento={"Inicio Inversión"}
                        fecha={"10.ENE.2024"}
                        monto={"$10,000.00 MXN"}
                        positive={true}
                      />
                    </View>
                  ))
                ) : (
                  <View>
                    <Text style={styles.noInvestment}>
                      Todavía no tienes movimientos
                    </Text>
                    <Entypo
                      name="emoji-sad"
                      size={35}
                      color="#060B4D"
                      style={{ alignSelf: "center", marginTop: 10 }}
                    />
                  </View>
                )}
              </>
            )}
          </>
        ) : (
          <>
            <Text style={styles.noInvestment}>
              No tienes Inversiones activas
            </Text>
            <Entypo
              name="emoji-sad"
              size={35}
              color="#060B4D"
              style={{ alignSelf: "center", marginTop: 10 }}
            />
          </>
        )}
      </View>
      {investmentState === "generating_profit" && (
        <TouchableOpacity style={[styles.botonAbonar, {}]} onPress={() => {}}>
          <Text style={[styles.textoBotonAbonar, {}]}>Abonar</Text>
        </TouchableOpacity>
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
                "Se encontraron inconsistencias en tu proceso, la solicitud ha sido rechazada. Porfavor revisa tu documentación y vuelve a intentarlo.\n¡Gracias!"
              }
              imagen={"RedAlert"}
              visible={modalVisible}
              onClose={() => setModalVisible(false)}
              onAccept={() => [setModalVisible(false)]}
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

          {investmentState === "generating_profit" && (
            <ModalEstatus
              titulo={"¡Felicidades!"}
              texto={
                "¡Tu inversión ya esta generando ganancias! Gracias por tu preferencia."
              }
              imagen={"Ready"}
              visible={modalVisible}
              onClose={() => setModalVisible(false)}
              onAccept={() => [setModalVisible(false)]}
            />
          )}

          {(investmentState === "concluded" ||
            investmentState === "completed") && (
            <ModalEstatus
              titulo={"¡Terminaste!"}
              texto={
                "¡Tu inversión ha concluido! Gracias por confiar en nosotros."
              }
              imagen={"Ready"}
              visible={modalVisible}
              onClose={() => setModalVisible(false)}
              onAccept={() => [setModalVisible(false)]}
            />
          )}

          {investmentState === "cancelled" && (
            <ModalEstatus
              titulo={"¡Opps!"}
              texto={
                "Tu inversión ha sido cancelada. Por favor, ponte en contacto con nosotros para más información."
              }
              imagen={"RedAlert"}
              visible={modalVisible}
              onClose={() => setModalVisible(false)}
              onAccept={() => [setModalVisible(false)]}
            />
          )}
        </>
      }
    </>
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
    paddingVertical: 7.5,
  },
  estatusContainer: {
    flexDirection: "row",
    borderRadius: 100,
    alignSelf: "center",
    paddingHorizontal: 10,
    paddingVertical: 2,
    alignItems: "center",
    borderWidth: 1,
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
    fontFamily: "opensansbold",
    fontSize: 16,
    color: "#060B4D",
    textAlign: "center",
  },
  botonAbonar: {
    alignSelf: "flex-end",
    width: "80%",
    marginTop: 50,
    marginBottom: 20,
    alignSelf: "center",
    borderRadius: 5,
    backgroundColor: "#060B4D",
  },
  textoBotonAbonar: {
    alignSelf: "center",
    padding: 10,
    color: "white",
    fontFamily: "opensanssemibold",
    fontSize: 16,
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
