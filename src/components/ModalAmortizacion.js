import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";

const TablaAmortizacion = (props) => {
  const data = Array.from({ length: 24 }, (_, i) => ({
    cuota: i + 1,
    inicio: `Inicio ${i + 1}`,
    vencimiento: `Vencimiento ${i + 1}`,
    dias: `Días ${i + 1}`,
    depositos: 1000 + i * 100,
    acumulado: 5000 + i * 500,
    rendimientoBruto: 200 + i * 20,
    impuesto: 50 + i * 5,
    rendimientoNeto: 150 + i * 15,
    tasa: `${i + 1}%`,
  }));

  // Calculate totals
  const totals = data.reduce(
    (acc, curr) => {
      acc.depositos += curr.depositos;
      acc.acumulado += curr.acumulado;
      acc.rendimientoBruto += curr.rendimientoBruto;
      acc.impuesto += curr.impuesto;
      acc.rendimientoNeto += curr.rendimientoNeto;
      return acc;
    },
    {
      depositos: 0,
      acumulado: 0,
      rendimientoBruto: 0,
      impuesto: 0,
      rendimientoNeto: 0,
    }
  );

  return (
    <Modal
      style={{ flex: 1 }}
      animationType="slide"
      transparent={true}
      visible={props.visible}
    >
      <View style={styles.tituloContainer}>
        <TouchableOpacity onPress={() => props.onClose()}>
          <AntDesign
            name="close"
            size={30}
            color="#060B4D"
            style={{ marginTop: 60 }}
          />
        </TouchableOpacity>
        <Text style={styles.tituloPantalla}>Tabla de{"\n"}amortización</Text>
      </View>
      <View style={{ height: 3, backgroundColor: "#F5F5F5" }} />
      <View style={styles.container}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.tableHeader}>
                {[
                  "Cuota",
                  "Inicio",
                  "Vencimiento",
                  "Días",
                  "Depósitos",
                  "Acumulado",
                  "Rendimiento\nBruto",
                  "Impuesto",
                  "Rendimiento\nNeto",
                  "Tasa",
                ].map((header, index) => (
                  <Text key={index} style={styles.headerCell}>
                    {header}
                  </Text>
                ))}
              </View>
              {data.map((item, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.cell}>{item.cuota}</Text>
                  <Text style={styles.cell}>{item.inicio}</Text>
                  <Text style={styles.cell}>{item.vencimiento}</Text>
                  <Text style={styles.cell}>{item.dias}</Text>
                  <Text style={styles.cell}>{item.depositos}</Text>
                  <Text style={styles.cell}>{item.acumulado}</Text>
                  <Text style={styles.cell}>{item.rendimientoBruto}</Text>
                  <Text style={styles.cell}>{item.impuesto}</Text>
                  <Text style={styles.cell}>{item.rendimientoNeto}</Text>
                  <Text style={styles.cell}>{item.tasa}</Text>
                </View>
              ))}
              {/* Totals Row */}
              <View style={[styles.tableRow, { marginBottom: 30 }]}>
                <Text style={styles.cellTotal}>Totals</Text>
                <Text style={styles.cellTotal} />
                <Text style={styles.cellTotal} />
                <Text style={styles.cellTotal} />
                <Text style={styles.cellTotal}>{totals.depositos}</Text>
                <Text style={styles.cellTotal}>{totals.acumulado}</Text>
                <Text style={styles.cellTotal}>{totals.rendimientoBruto}</Text>
                <Text style={styles.cellTotal}>{totals.impuesto}</Text>
                <Text style={styles.cellTotal}>{totals.rendimientoNeto}</Text>
                <Text style={styles.cellTotal} />
              </View>
            </ScrollView>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  tituloContainer: {
    marginTop: 5,
    paddingHorizontal: 20,
    flexDirection: "row",
    backgroundColor: "white",
    paddingBottom: 10,
  },
  tituloPantalla: {
    flex: 1,
    marginLeft: -20,
    marginTop: 47,
    fontSize: 20,
    color: "#060B4D",
    fontFamily: "opensanssemibold",
    textAlign: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
  },
  headerCell: {
    minWidth: 120,
    padding: 10,
    textAlign: "center",
    fontFamily: "opensansbold",
    color: "#060B4D",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
  },
  cell: {
    minWidth: 120,
    padding: 10,
    textAlign: "center",
    color: "#060B4D",
    fontFamily: "opensans",
  },
  cellTotal: {
    minWidth: 120,
    padding: 10,
    fontSize: 16,
    textAlign: "center",
    color: "#060B4D",
    fontFamily: "opensansbold",
  },
});

export default TablaAmortizacion;
