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
// Importaciones de Componentes y Hooks
import { APIGet } from "../API/APIService";
import { UserContext } from "../hooks/UserContext";
import { Ionicons, Entypo, AntDesign, FontAwesome5 } from "@expo/vector-icons";
import Movimiento from "./Movimiento";
import ModalEstatus from "./ModalEstatus";

const screenWidth = Dimensions.get("window").width;
const widthThird = screenWidth / 3;
const widthHalf = screenWidth / 2;

/**
 * `MiTankefCaja` es un componente que visualiza cajas de ahorro personalizadas y muestra
 * información relevante como el total acumulado y el rendimiento neto de las inversiones.
 * Está diseñado para ofrecer una visión rápida y efectiva de los recursos financieros del usuario
 * dentro de la pantalla MiTankef, es un componente que NO debe ser reusable.
 *
 * Props:
 * Este componente no recibe props directamente, pero se espera que la data necesaria para
 * las diferentes cajas de ahorro se recuperada a través de una llamada a una API.
 *
 * Ejemplo de uso (o ver en MiTankef.js):
 * <MiTankefCaja />
 */

const MiTankefCaja = (props) => {
  const navigation = useNavigation();
  // Estados y Contexto
  const { user, setUser } = useContext(UserContext);
  const [focus, setFocus] = useState("Balance");
  const [boxes, setBoxes] = useState([]);
  const [currentID, setCurrentID] = useState(null);
  const [boxState, setBoxState] = useState(null);
  const [investmentState, setInvestmentState] = useState(null);
  const [plazo, setPlazo] = useState(null);
  const [folio, setFolio] = useState(null);
  const [montoAcumulado, setMontoAcumulado] = useState(null);
  const [tasaInteres, setTasaInteres] = useState(null);

  // Funcion para obtener las cajas de ahorro del usuario
  const fetchUserBoxes = async () => {
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
      setBoxes(filteredResults);
      setCurrentID(filteredResults[0].id);
      fetchBox(filteredResults[0].id);
    }
  };

  // Funcion para obtener una caja de ahorro en especifico
  const fetchBox = async (id) => {
    const url = `/api/v1/box_savings/${id}`;

    const result = await APIGet(url);

    if (result.error) {
      console.error("Error al obtener la caja de ahorro:", result.error);
    } else {
      console.log("Resultados de la caja de ahorro:", result.data.data);
      setBoxState(result.data.data.aasm_state);
      setPlazo(result.data.data.term);
      setFolio(result.data.data.invoice_number);
      setMontoAcumulado(formatAmount(result.data.data.amount));
      setTasaInteres("Falta");
    }
  };

  // Efecto para cargar los posts del feed al cargar la pantalla
  useFocusEffect(
    useCallback(() => {
      fetchUserBoxes();
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
          style={styles.botonNuevaCaja}
          onPress={() =>
            navigation.navigate("Crear", {
              screen: "DefinirCajaAhorro",
              params: { flujo: "Caja de ahorro" },
            })
          }
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
            Nueva caja{"\n"}de ahorro
          </Text>
        </TouchableOpacity>
        {/* Componente repetible */}
        {boxes &&
          boxes.length > 0 &&
          boxes.map((box, index) => (
            <TouchableOpacity
              key={box.id || index}
              style={[
                styles.boxNameContainer,
                {
                  backgroundColor: currentID === box.id ? "#2FF690" : "white",
                },
              ]}
              onPress={() => [fetchBox(box.id), setCurrentID(box.id)]}
            >
              <FontAwesome5
                name="piggy-bank"
                size={24}
                color="#060B4D"
                style={{ marginBottom: 5 }}
              />
              <Text
                style={styles.boxName}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {box.name}
              </Text>
            </TouchableOpacity>
          ))}
      </ScrollView>

      {boxes && boxes.length > 0 ? (
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
                <Text style={styles.tituloMonto}>Monto acumulado</Text>
                <Text style={styles.monto}>{montoAcumulado} MXN</Text>
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
                  <Text style={styles.concepto}>Plazo de ahorro</Text>
                  <Text style={styles.valorConcepto}>{plazo} meses</Text>
                </View>
                <Ionicons
                  name="remove-outline"
                  size={30}
                  color="#e1e2ebff"
                  style={styles.line}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.concepto}>Tasa de interés</Text>
                  <Text style={styles.valorConcepto}>{tasaInteres}</Text>
                </View>
              </View>
            </>
          )}

          {focus === "Movimientos" && (
            <>
              <View>
                <Movimiento
                  movimiento={"Inicio Caja"}
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
          <Text style={styles.noBoxes}>No tienes Cajas de Ahorro activas</Text>
          <Entypo
            name="emoji-sad"
            size={35}
            color="#060B4D"
            style={{ alignSelf: "center", marginTop: 10 }}
          />
        </>
      )}
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
  botonNuevaCaja: {
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
  boxNameContainer: {
    alignItems: "center",
    marginRight: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    width: 120,
  },
  boxName: {
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
  noBoxes: {
    color: "#060B4D",
    fontFamily: "opensanssemibold",
    textAlign: "center",
    alignSelf: "center",
    fontSize: 16,
    marginLeft: 10,
    marginTop: 75,
  },
  concepto: {
    fontFamily: "opensans",
    fontSize: 14,
    color: "#060B4D",
    textAlign: "center",
    marginBottom: 5,
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

export default MiTankefCaja;
