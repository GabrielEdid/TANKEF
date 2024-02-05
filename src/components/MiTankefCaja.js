// Importaciones de React Native y React
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
// Importaciones de Componentes y Hooks
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";

const screenWidth = Dimensions.get("window").width;
const widthHalf = screenWidth / 2;

const MiTankefCaja = (props) => {
  const imageMap = {
    Bill: require("../../assets/images/BillInvest.png"),
    // ... más imágenes
  };

  return (
    <View>
      <View style={{ flexDirection: "row", marginBottom: 5 }}>
        <TouchableOpacity
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginLeft: 10,
            borderColor: "#bcbeccff",
            borderWidth: 2,
            paddingHorizontal: 17.5,
            paddingVertical: 20,
            borderRadius: 10,
            maxWidth: 95,
          }}
        >
          <FontAwesome5
            name="piggy-bank"
            size={24}
            color="#bcbeccff"
            style={{ marginBottom: 5 }}
          />
          <Text
            style={{
              color: "#bcbeccff",
              fontFamily: "opensansbold",
              textAlign: "center",
            }}
          >
            Caja de ahorro
          </Text>
        </TouchableOpacity>

        {/* Componente repetible */}
        <TouchableOpacity
          style={{
            alignItems: "center",
            marginLeft: 10,
            paddingVertical: 20,
            paddingHorizontal: 5,
            borderRadius: 10,
            maxWidth: 100,
            backgroundColor: "white",
          }}
        >
          <FontAwesome5
            name="piggy-bank"
            size={24}
            color="#060B4D"
            style={{ marginBottom: 5 }}
          />
          <Text
            style={{
              color: "#060B4D",
              fontFamily: "opensans",
              textAlign: "center",
            }}
          >
            Caja Roberto Hijo
          </Text>
          <Text style={{ color: "#060B4D", fontFamily: "opensansbold" }}>
            $50K
          </Text>
        </TouchableOpacity>
      </View>

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
            <Text style={styles.tituloMonto}>Total acumulado (x3)</Text>
            <Text style={styles.monto}>$200,000.00</Text>
          </View>
          <Ionicons
            name="remove-outline"
            size={30}
            color="#e1e2ebff"
            style={styles.line}
          />
          <View style={{ alignItems: "center", flex: 1 }}>
            <Text style={styles.tituloMonto}>Total rendimiento neto (x3)</Text>
            <Text style={styles.monto}>$1,894.55</Text>
          </View>
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

export default MiTankefCaja;
