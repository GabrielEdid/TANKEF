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
import { Ionicons, Entypo, AntDesign } from "@expo/vector-icons";
import Movimiento from "./Movimiento";

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
  // Estados y Contexto
  const [focus, setFocus] = useState("Balance"); //Balance o Movimientos
  // Mapa de imágenes
  const imageMap = {
    Bill: require("../../assets/images/BillInvest.png"),
    // ... más imágenes
  };

  // Componente visual
  return (
    <View>
      {/* Vista de las distintas inversiones */}
      <View style={{ flexDirection: "row", marginBottom: 5 }}>
        <TouchableOpacity
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
            Nueva{"\n"}Inversión
          </Text>
        </TouchableOpacity>

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
          <Image source={imageMap["Bill"]} style={styles.bill} />
          <Text
            style={{
              color: "#060B4D",
              fontFamily: "opensanssemibold",
              textAlign: "center",
              fontSize: 12,
            }}
          >
            Inversión Roberto Hijo
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
            <Text style={styles.tituloMonto}>Retorno de inversión neto</Text>
            <Text style={styles.monto}>$11,106.11 MXN</Text>
          </View>

          <View style={styles.container}>
            <View style={{ flex: 1 }}>
              <Text style={styles.concepto}>Folio de{"\n"}inversión</Text>
              <Text style={styles.valorConcepto}>4225fd6f64</Text>
            </View>
            <Ionicons
              name="remove-outline"
              size={30}
              color="#e1e2ebff"
              style={styles.line}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.concepto}>Plazo de{"\n"}inversión</Text>
              <Text style={styles.valorConcepto}>12 meses</Text>
            </View>
            <Ionicons
              name="remove-outline"
              size={30}
              color="#e1e2ebff"
              style={styles.line}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.concepto}>Rendimiento{"\n"}neto mensual</Text>
              <Text style={styles.valorConcepto}>$91.67</Text>
            </View>
          </View>

          <View style={styles.container}>
            <View style={{ flex: 1 }}>
              <Text style={styles.concepto}>Inversión{"\n"}inicial</Text>
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
              <Text style={styles.valorConcepto}>11.50%</Text>
            </View>
            <Ionicons
              name="remove-outline"
              size={30}
              color="#e1e2ebff"
              style={styles.line}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.concepto}>Impuesto{"\n"}mensual</Text>
              <Text style={styles.valorConcepto}>$2.75</Text>
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

export default MiTankefInversion;
