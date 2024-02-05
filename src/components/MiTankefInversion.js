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
import { Ionicons, AntDesign } from "@expo/vector-icons";

const screenWidth = Dimensions.get("window").width;
const widthHalf = screenWidth / 2;

const imageMap = {
  Bill: require("../../assets/images/BillInvest.png"),
  // ... más imágenes
};

const MiTankefInversion = (props) => {
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
          }}
        >
          <Image source={imageMap["Bill"]} style={styles.bill} />
          <Text style={{ color: "#bcbeccff", fontFamily: "opensansbold" }}>
            Invertir
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
          <Image
            source={imageMap["Bill"]}
            style={[styles.bill, { tintColor: "#060B4D" }]}
          />
          <Text
            style={{
              color: "#060B4D",
              fontFamily: "opensans",
              textAlign: "center",
            }}
          >
            Inversión Roberto Hijo
          </Text>
          <Text style={{ color: "#060B4D", fontFamily: "opensansbold" }}>
            $350K
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
            <Text style={styles.tituloMonto}>Monto acumulado</Text>
            <Text style={styles.monto}>$450,000.00</Text>
          </View>
          <Ionicons
            name="remove-outline"
            size={30}
            color="#e1e2ebff"
            style={styles.line}
          />
          <View style={{ alignItems: "center", flex: 1 }}>
            <Text style={styles.tituloMonto}>Rendimiento neto</Text>
            <Text style={styles.monto}>$443.06</Text>
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
        <View style={{ flexDirection: "row", marginBottom: 15 }}>
          <Text style={styles.concepto}>Plazo</Text>
          <Text style={styles.valorConcepto}>36 meses</Text>
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
  bill: {
    height: 30,
    width: 30,
    marginBottom: 5,
    tintColor: "#bcbeccff",
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

export default MiTankefInversion;
