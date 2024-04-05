// Importaciones de React Native y React
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
// Importaciones de Componentes y Hooks
import { Ionicons, Entypo, AntDesign, FontAwesome } from "@expo/vector-icons";
import Movimiento from "./Movimiento";

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
  // Estados y Contexto
  const [focus, setFocus] = useState("Balance"); //Balance o Movimientos

  // Mapa de imágenes
  const imageMap = {
    Bill: require("../../assets/images/BillInvest.png"),
    Card: require("../../assets/images/tarjeta.png"),

    // ... más imágenes
  };

  // Componente visual
  return (
    <View>
      {/* Vista de las distintas inversiones */}
      <View style={{ flexDirection: "row", marginBottom: 5 }}>
        {/* Opcion para tener boton de "Nuevo Crédito" */}
        {/*<TouchableOpacity
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginLeft: 10,
            backgroundColor: "white",
            paddingHorizontal: 17.5,
            paddingVertical: 5,
            width: 120,
            borderRadius: 10,
          }}
        >
          <Entypo name="plus" size={30} color="black" />
          <Text
            style={{
              color: "#060B4D",
              fontFamily: "opensansbold",
              textAlign: "center",
              fontSize: 12,
              marginTop: -5,
            }}
          >
            Nuevo{"\n"}Crédito
          </Text>
          </TouchableOpacity>*/}

        {/* Componente repetible */}
        <TouchableOpacity
          style={{
            alignItems: "center",
            marginLeft: 10,
            paddingVertical: 5,
            paddingHorizontal: 10,
            borderRadius: 10,
            width: 120,
            backgroundColor: "#2FF690",
          }}
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
            Crédito por comité
          </Text>
        </TouchableOpacity>
      </View>
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
                  focus === "Movimientos" ? "opensansbold" : "opensanssemibold",
              },
            ]}
          >
            Movimientos
          </Text>
          {focus === "Movimientos" ? <View style={styles.focusLine} /> : null}
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
            <Text style={styles.tituloMonto}>Total a pagar</Text>
            <Text style={styles.monto}>$12,913.12 MXN</Text>
          </View>

          <View style={styles.container}>
            <View style={{ flex: 1 }}>
              <Text style={styles.concepto}>Folio de{"\n"}crédito</Text>
              <Text style={styles.valorConcepto}>4225fd6f64</Text>
            </View>
            <Ionicons
              name="remove-outline"
              size={30}
              color="#e1e2ebff"
              style={styles.line}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.concepto}>Plazo de{"\n"}crédito</Text>
              <Text style={styles.valorConcepto}>6 meses</Text>
            </View>
            <Ionicons
              name="remove-outline"
              size={30}
              color="#e1e2ebff"
              style={styles.line}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.concepto}>Comisión por{"\n"}apertura</Text>
              <Text style={styles.valorConcepto}>$200.00</Text>
            </View>
          </View>

          <View style={styles.container}>
            <View style={{ flex: 1 }}>
              <Text style={styles.concepto}>Monto{"\n"}solicitado</Text>
              <Text style={styles.valorConcepto}>$10,000.00</Text>
            </View>
            <Ionicons
              name="remove-outline"
              size={30}
              color="#e1e2ebff"
              style={styles.line}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.concepto}>Tasa de{"\n"}interés</Text>
              <Text style={styles.valorConcepto}>7.84%</Text>
            </View>
            <Ionicons
              name="remove-outline"
              size={30}
              color="#e1e2ebff"
              style={styles.line}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.concepto}>Pago{"\n"}mensual</Text>
              <Text style={styles.valorConcepto}>$2,174.20</Text>
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

export default MiTankefCredito;
