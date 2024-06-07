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
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import { parseISO, format } from "date-fns";
// Importaciones de Componentes y Hooks
import { APIGet } from "../API/APIService";
import { UserContext } from "../hooks/UserContext";
import { useInactivity } from "../hooks/InactivityContext";
import { Ionicons, Entypo, AntDesign, FontAwesome5 } from "@expo/vector-icons";
import Movimiento from "./Movimiento";
import ModalEstatus from "./ModalEstatus";

const screenWidth = Dimensions.get("window").width;
const widthThird = screenWidth / 3;
const widthHalf = screenWidth / 2;

/**
 * `MiTankefObligado` es un componente que visualiza el obligado solidario y muestra
 * información relevante como los montos y el nombre del obligado.
 * Está diseñado para ofrecer una visión rápida y efectiva de los recursos financieros del usuario
 * dentro de la pantalla MiTankef, es un componente que NO debe ser reusable.
 *
 * Props:
 * Este componente no recibe props directamente, pero se espera que la data necesaria para
 * los obligados solidarios sea recuperada a través de una llamada a una API.
 *
 * Ejemplo de uso (o ver en MiTankef.js):
 * <MiTankefObligado />
 */

const MiTankefObligado = (props) => {
  const navigation = useNavigation();
  // Estados y Contexto
  const { resetTimeout } = useInactivity();
  const { user, setUser } = useContext(UserContext);
  const [focus, setFocus] = useState("Balance");
  const [obligors, setObligors] = useState([]);
  const [currentID, setCurrentID] = useState(null);
  const [obligorState, setObligorState] = useState("");
  const [effectTrigger, setEffectTrigger] = useState(false);
  const [estatus, setEstatus] = useState("");
  const [abono, setAbono] = useState("");
  const [montoInicial, setMontoInicial] = useState("");
  const [retornoInversion, setRetornoInversion] = useState("");
  const [cuenta, setCuenta] = useState("");
  const [fechaCreacion, setFechaCreacion] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [plazo, setPlazo] = useState("");
  const [folio, setFolio] = useState("");
  const [payments, setPayments] = useState([]);
  const [montoAcumulado, setMontoAcumulado] = useState("");
  const [tasaOperacion, setTasaOperacion] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const imageMap = {
    MiRed: require("../../assets/images/MiRed.png"),
    // ... más imágenes
  };

  // Funcion para obtener las cajas de ahorro del usuario
  const fetchUserObligors = async () => {
    const url = `/api/v1/users/${user.userID}/box_savings`;

    const result = await APIGet(url);

    if (result.error) {
      console.error(
        "Error al obtener las cajas de ahorro del usuario:",
        result.error
      );
    } else {
      const filteredResults = result.data.data.sort((a, b) => b.id - a.id);
      console.log("Resultados de las cajas de ahorro:", filteredResults);
      setObligors(filteredResults);
      setCurrentID(filteredResults[0].id);
      setTasaOperacion(filteredResults[0].rate_operation);
      fetchObligor(filteredResults[0].id);
    }
  };

  // Funcion para obtener una caja de ahorro en especifico
  const fetchObligor = async (id) => {
    resetTimeout();
    const url = `/api/v1/box_savings/${id}`;

    const result = await APIGet(url);

    if (result.error) {
      console.error("Error al obtener la caja de ahorro:", result.error);
    } else {
      console.log("Resultados de la caja de ahorro:", result.data.data);
      setObligorState(result.data.data.aasm_state);
      handleObligorStateChange(result.data.data.aasm_state);
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

  // Funcion para obtener los movimientos de una caja en especifico
  const fetchPayments = async (id) => {
    resetTimeout();
    const url = `/api/v1/investments/${id}/obligor_saving_payments`;

    const result = await APIGet(url);

    if (result.error) {
      console.error(
        "Error al obtener los movimientos de la caja de ahorro:",
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
      fetchUserObligors();
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

  useEffect(() => {
    if (
      obligorState === "reviewing_documentation" ||
      obligorState === "rejected_documentation" ||
      obligorState === "signing_contract" ||
      obligorState === "sign_contract" ||
      obligorState === "request_payment" ||
      obligorState === "reviewing_payment"
    ) {
      setModalVisible(true);
    }
  }, [obligorState, effectTrigger]);

  const handleObligorStateChange = (newState) => {
    if (obligorState === newState) {
      setEffectTrigger((t) => !t); // Toggles the trigger to force useEffect execution
    }
    setObligorState(newState);
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
    <View>
      {/* Vista de las distintas inversiones */}
      <ScrollView
        style={{
          marginBottom: 5,
        }}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        onScroll={() => resetTimeout()}
        scrollEventThrottle={400}
      >
        {/* Componente repetible */}
        {obligors &&
          obligors.length > 0 &&
          obligors.map((obligor, index) => (
            <TouchableOpacity
              key={obligor.id || index}
              style={[
                styles.obligorNameContainer,
                {
                  backgroundColor:
                    currentID === obligor.id ? "#2FF690" : "white",
                },
              ]}
              onPress={() => [
                fetchObligor(obligor.id),
                setCurrentID(obligor.id),
                setTasaOperacion(obligor.rate_operation),
              ]}
            >
              <Image
                source={imageMap["MiRed"]}
                style={[styles.bill, { tintColor: "#060B4D" }]}
              />
              <Text
                style={styles.obligorName}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {obligor.name}
              </Text>
            </TouchableOpacity>
          ))}
      </ScrollView>

      {obligors && obligors.length > 0 ? (
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
                    onPress={() => setModalVisible(true)}
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
                  <Text style={styles.concepto}>Plazo de ahorro</Text>
                  <Text style={styles.valorConcepto}>{plazo} meses</Text>
                </View>
              </View>

              <View style={styles.container}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.concepto}>Monto de ahorro</Text>
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
                  <Text style={styles.noObligors}>
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
          <Text style={styles.noObligors}>
            No tienes Cajas de Ahorro activas
          </Text>
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
          {obligorState === "reviewing_documentation" && (
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

          {obligorState === "rejected_documentation" && (
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

          {obligorState === "sign_contract" && (
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
                  params: { flujo: "Caja de ahorro", idInversion: currentID },
                }),
              ]}
            />
          )}

          {obligorState === "signing_contract" && (
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

          {obligorState === "request_payment" && (
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
                  params: { flujo: "Caja de ahorro", idInversion: currentID },
                }),
              ]}
            />
          )}

          {obligorState === "reviewing_payment" && (
            <ModalEstatus
              titulo={"¡Depósito exitoso!"}
              texto={
                "¡Hemos recibido el comprobante de depósito, gracias por tu transacción!. Pronto recibirás un correo con la confirmación de tu caja de ahorro."
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

          {obligorState === "generating_profit" && (
            <ModalEstatus
              titulo={"¡Felicidades!"}
              texto={
                "¡Tu caja de ahorro ya esta generando ganancias! Gracias por tu preferencia."
              }
              imagen={"Ready"}
              visible={modalVisible}
              onClose={() => setModalVisible(false)}
              onAccept={() => [setModalVisible(false)]}
            />
          )}

          {(obligorState === "concluded" || obligorState === "completed") && (
            <ModalEstatus
              titulo={"¡Terminaste!"}
              texto={
                "¡Tu caja de ahorro ha concluido! Gracias por confiar en nosotros."
              }
              imagen={"Ready"}
              visible={modalVisible}
              onClose={() => setModalVisible(false)}
              onAccept={() => [setModalVisible(false)]}
            />
          )}

          {obligorState === "cancelled" && (
            <ModalEstatus
              titulo={"¡Opps!"}
              texto={
                "Tu caja de ahorro ha sido cancelada. Por favor, ponte en contacto con nosotros para más información."
              }
              imagen={"RedAlert"}
              visible={modalVisible}
              onClose={() => setModalVisible(false)}
              onAccept={() => [setModalVisible(false)]}
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
  obligorNameContainer: {
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    width: 120,
    marginHorizontal: 10,
  },
  obligorName: {
    color: "#060B4D",
    fontFamily: "opensanssemibold",
    textAlign: "center",
    fontSize: 12,
    marginTop: 2.5,
  },
  containerBalance: {
    justifyContent: "space-between",
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 3,
  },
  noObligors: {
    color: "#060B4D",
    fontFamily: "opensanssemibold",
    textAlign: "center",
    alignSelf: "center",
    fontSize: 16,
    marginLeft: 10,
    marginTop: 75,
  },
  bill: {
    height: 30,
    width: 37,
    marginBottom: 5,
    tintColor: "#bcbeccff",
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
  seperacion: {
    width: "100%",
    height: 1,
    borderRadius: 100,
    marginVertical: 15,
    backgroundColor: "#d1d2deff",
  },
});

export default MiTankefObligado;
