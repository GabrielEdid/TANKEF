// Importaciones de React Native y React
import React, { useEffect, useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
} from "react-native";
// Importaciones de Componentes y Hooks
import { FinanceContext } from "../hooks/FinanceContext";
import { APIGet } from "../API/APIService";
import { AntDesign } from "@expo/vector-icons";

const TablaAmortizacion = (props) => {
  const { finance } = useContext(FinanceContext);
  const [tablaData, setTablaData] = useState([]);

  useEffect(() => {
    const fetchTabla = async () => {
      const url = `/api/v1/simulator?term=${finance.plazo}&type=${props.flujo}&amount=${finance.montoNumeric}`;
      try {
        const response = await APIGet(url);
        if (response.error) {
          console.error("Error al obtener la tabla:", response.error);
        } else {
          console.log("Tabla obtenida exitosamente:", response.data);
          setTablaData(response.data.table); // Assuming data is directly under table key
        }
      } catch (error) {
        console.error("Error en la petición de la tabla:", error);
      }
    };

    if (props.visible) {
      fetchTabla();
    }
  }, [props.visible, finance.plazo, finance.montoNumeric, props.flujo]);

  // Helper function to format the numeric values as currency
  const formatAmmount = (text) => {
    const inputText = String(text || "0").replace(/,/g, "");
    const numericValue = parseFloat(inputText);
    return isNaN(numericValue) ? "" : `$${numericValue.toLocaleString()}`;
  };

  // Calculate totals
  const totals = tablaData.reduce(
    (acc, curr) => {
      acc.depositos += curr.deposit || 0;
      acc.acumulado += curr.amount_accumulated || 0;
      acc.rendimientoBruto += curr.rendimiento_bruto || 0;
      acc.impuest += curr.impuest || 0;
      acc.rendimientoNeto += curr.rendimiento_neto || 0;
      return acc;
    },
    {
      depositos: 0,
      acumulado: 0,
      rendimientoBruto: 0,
      impuest: 0,
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
              {tablaData.map((item, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.cell}>{index + 1}</Text>
                  <Text style={styles.cell}>{item.start_date}</Text>
                  <Text style={styles.cell}>{item.end_date}</Text>
                  <Text style={styles.cell}>{item.days}</Text>
                  <Text style={styles.cell}>{formatAmmount(item.deposit)}</Text>
                  <Text style={styles.cell}>
                    {formatAmmount(item.amount_accumulated)}
                  </Text>
                  <Text style={styles.cell}>
                    {formatAmmount(item.rendimiento_bruto.toFixed(2))}
                  </Text>
                  <Text style={styles.cell}>
                    {formatAmmount(item.impuest.toFixed(2))}
                  </Text>
                  <Text style={styles.cell}>
                    {formatAmmount(item.rendimiento_neto.toFixed(2))}
                  </Text>
                  <Text style={styles.cell}>
                    {formatAmmount(item.investment_rate)}
                  </Text>
                </View>
              ))}
              <View style={styles.tableRow}>
                <Text style={styles.cellTotal}>Totales</Text>
                <Text style={styles.cellTotal}></Text>
                <Text style={styles.cellTotal}></Text>
                <Text style={styles.cellTotal}></Text>
                <Text style={styles.cellTotal}>
                  {formatAmmount(totals.depositos.toFixed(2))}
                </Text>
                <Text style={styles.cellTotal}>
                  {props.flujo === "box_saving"
                    ? formatAmmount(totals.acumulado.toFixed(2))
                    : ""}
                </Text>
                <Text style={styles.cellTotal}>
                  {formatAmmount(totals.rendimientoBruto.toFixed(2))}
                </Text>
                <Text style={styles.cellTotal}>
                  {formatAmmount(totals.impuest.toFixed(2))}
                </Text>
                <Text style={styles.cellTotal}>
                  {formatAmmount(totals.rendimientoNeto.toFixed(2))}
                </Text>
                <Text style={styles.cellTotal}></Text>
              </View>
              <View style={{ margin: 20, marginBottom: 40 }}>
                <Text
                  style={{
                    color: "#060B4D",
                    fontFamily: "opensans",
                    fontSize: 12,
                  }}
                >
                  1.- Tasa de interés variable, por lo que las condiciones
                  pueden cambiar de acuerdo a los mercados financieros.{"\n"}
                  2.- Tasa base de cotización. TIIE a 28 días publicada en el
                  Diario Oficial de la Federación (DOF) el día inmediato
                  anterior a la fecha del cálculo.{"\n"}
                  3.- Tasa de impuesto vigente del año en curso, por lo que
                  puede variar para los años posteriores.
                </Text>
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
    fontSize: 14,
    textAlign: "center",
    color: "#060B4D",
    fontFamily: "opensansbold",
  },
});

export default TablaAmortizacion;
