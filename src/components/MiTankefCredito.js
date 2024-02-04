// Importaciones de React Native y React
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
// Importaciones de Componentes y Hooks
import { Ionicons, AntDesign } from "@expo/vector-icons";

const screenWidth = Dimensions.get("window").width;
const widthHalf = screenWidth / 2;

const MiTankefCredito = (props) => {
  return (
    <View>
      <View
        style={{
          justifyContent: "space-between",
          backgroundColor: "white",
        }}
      >
        <View
          style={{
            paddingVertical: 10,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View style={{ alignItems: "center", flex: 1 }}>
            <Text style={styles.tituloMonto}>Crédito solicitado</Text>
            <Text style={styles.monto}>$20,000.00</Text>
          </View>
          <Ionicons
            name="remove-outline"
            size={30}
            color="#e1e2ebff"
            style={styles.line}
          />
          <View style={{ alignItems: "center", flex: 1 }}>
            <Text style={styles.tituloMonto}>Mensualidades</Text>
            <Text style={styles.monto}>$3,500.00</Text>
          </View>
        </View>

        <View
          style={{
            paddingVertical: 10,
            flexDirection: "row",
          }}
        >
          <View style={{ alignItems: "center", flex: 1 }}>
            <Text style={styles.tituloMonto}>Por pagar</Text>
            <Text style={[styles.monto, { color: "#2EC379" }]}>$16,450.00</Text>
          </View>
          <Ionicons
            name="remove-outline"
            size={30}
            color="#e1e2ebff"
            style={styles.line}
          />
          <View style={{ alignItems: "center", flex: 1 }}>
            <Text style={styles.tituloMonto}>Fecha de pago</Text>
            <Text style={styles.monto}>29.30.24</Text>
          </View>
        </View>
      </View>

      <View
        style={{
          marginTop: 5,
          backgroundColor: "white",
          paddingHorizontal: 20,
        }}
      >
        <View style={{ flexDirection: "row", marginTop: 15 }}>
          <Text style={styles.concepto}>Estatus</Text>
          <Text style={styles.valorConcepto}>A tiempo</Text>
          {/* View para tener la palomita negra */}
          <View
            style={{
              backgroundColor: "#060B4D",
              alignSelf: "center",
              borderRadius: 15,
              marginLeft: 5,
            }}
          >
            <AntDesign
              name="checkcircle"
              size={18}
              color="#2FF690"
              style={{
                alignSelf: "center",
                bottom: 0.1,
              }}
            />
          </View>
        </View>
        <View style={styles.seperacion} />
        <View style={{ flexDirection: "row" }}>
          <Text style={styles.concepto}>Folio</Text>
          <Text style={styles.valorConcepto}>4225fd6f64</Text>
        </View>
        <View style={styles.seperacion} />
        <View style={{ flexDirection: "row" }}>
          <Text style={styles.concepto}>Plazo</Text>
          <Text style={styles.valorConcepto}>6 meses</Text>
        </View>
        <View style={styles.seperacion} />
        <View style={{ flexDirection: "row", marginBottom: 15 }}>
          <Text style={styles.concepto}>Tipo</Text>
          <Text style={styles.valorConcepto}>Red</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tituloMonto: {
    fontFamily: "opensans",
    fontSize: 14,
    color: "#060B4D",
  },
  monto: {
    fontFamily: "opensansbold",
    fontSize: 18,
    color: "#060B4D",
  },
  line: {
    transform: [{ rotate: "90deg" }],
    position: "absolute",
    left: widthHalf - 10,
    alignSelf: "center",
  },
  concepto: {
    fontFamily: "opensansbold",
    fontSize: 15,
    color: "#060B4D",
    flex: 1,
  },
  valorConcepto: {
    fontFamily: "opensanssemibold",
    fontSize: 15,
    color: "#060B4D",
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
