// Importaciones de React Native y React
import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
// Importaciones de Componentes y Contextos
import { CreditContext } from "../hooks/CreditContext";
import { Ionicons } from "@expo/vector-icons";

/**
 * `Conexion` es un componente que muestra información de una conexión específica,
 * como una tarjeta interactuable. Ofrece la funcionalidad para navegar a una vista detallada
 * del perfil asociado y la opción de eliminar esta conexión con confirmación mediante un modal.
 *
 * Props:
 * - `userID`: Identificador único del usuario asociado a la conexión.
 * - `imagen`: Puede ser una URL de imagen o un recurso local para mostrar como avatar del usuario.
 * - `nombre`: Nombre del usuario a mostrar en la tarjeta de conexión.
 * - `mail`: Correo electrónico del usuario asociado a la conexión.
 *
 * Ejemplo de uso (o ver en MiRed.js):
 * <Conexion
 *   userID="123"
 *   imagen="https://ruta/a/imagen.jpg"
 *   nombre="John Doe"
 *   mail="johndoe@gmail.com"
 * />
 */

const ModalCotizadorCredito = () => {
  const navigation = useNavigation();
  // Contexto de crédito
  const { credit, setCredit } = useContext(CreditContext);

  // Componente visual
  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={credit.modalCotizadorVisible}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Image
              style={{ width: 63, height: 50, marginBottom: 10 }}
              source={require("../../assets/images/BillCredito.png")}
            />
            <Text style={styles.modalText}>Pago Mensual</Text>
            <Text style={[styles.modalText, { fontSize: 24 }]}>
              {credit.pago_mensual}
            </Text>
            <View
              style={[
                styles.contenedores,
                {
                  flexDirection: "row",
                  marginTop: 5,
                  paddingHorizontal: 0,
                  paddingVertical: 0,
                },
              ]}
            >
              <View style={{ flex: 1 }}>
                <Text style={[styles.concepto, { fontSize: 13 }]}>
                  Comisión por{"\n"}apertura
                </Text>
                <Text style={styles.valorConcepto}>
                  {credit.comision_por_apertura}
                </Text>
              </View>
              <Ionicons
                name="remove-outline"
                size={30}
                color="#e1e2ebff"
                style={styles.line}
              />
              <View style={{ flex: 1 }}>
                <Text style={[styles.concepto, { fontSize: 13 }]}>
                  Tasa de{"\n"}operación
                </Text>
                <Text style={styles.valorConcepto}>
                  {credit.tasa_de_operacion}
                </Text>
              </View>
              <Ionicons
                name="remove-outline"
                size={30}
                color="#e1e2ebff"
                style={styles.line}
              />
              <View style={{ flex: 1 }}>
                <Text style={[styles.concepto, { fontSize: 13 }]}>
                  Pago{"\n"}total
                </Text>
                <Text style={[styles.valorConcepto, { fontSize: 14 }]}>
                  {credit.total_a_pagar} MXN
                </Text>
              </View>
            </View>
            <Text style={styles.modalTextBody}>
              Esta es una cotización preliminar, la tasa definitiva dependerá
              del análisis completo de tu solicitud.
            </Text>
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                style={[
                  styles.botonContinuar,
                  {
                    marginBottom: 0,
                    marginRight: 5,
                    flex: 1,
                    backgroundColor: "white",
                    borderColor: "#060B4D",
                    borderWidth: 1,
                  },
                ]}
                onPress={() =>
                  setCredit({ ...credit, modalCotizadorVisible: false })
                }
              >
                <Text
                  style={[styles.textoBotonContinuar, { color: "#060B4D" }]}
                >
                  Regresar
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.botonContinuar,
                  {
                    marginBottom: 0,
                    flex: 1,
                    marginLeft: 5,
                    backgroundColor: "#060B4D",
                  },
                ]}
                onPress={() => {
                  if (credit.paso === 1) {
                    setCredit({
                      ...credit,
                      paso: credit.paso + 1,
                      modalCotizadorVisible: false,
                    });
                  }
                }}
              >
                <Text style={[styles.textoBotonContinuar, { color: "white" }]}>
                  Aceptar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

// Estilos del componente
const styles = StyleSheet.create({
  contenedores: {
    backgroundColor: "white",
    paddingHorizontal: 12,
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
  monto: {
    paddingTop: 10,
    fontSize: 35,
    color: "#060B4D",
    marginTop: -10,
    marginBottom: 10,
    fontFamily: "opensanssemibold",
  },
  valorConcepto: {
    fontFamily: "opensanssemibold",
    fontSize: 16,
    color: "#060B4D",
    textAlign: "center",
  },
  separacion: {
    height: 1,
    width: "100%",
    backgroundColor: "#cecfdbff",
  },
  texto: {
    color: "#060B4D",
    textAlign: "center",
    fontFamily: "opensans",
    fontSize: 16,
  },
  line: {
    transform: [{ rotate: "90deg" }],
  },
  botonContinuar: {
    marginTop: 15,
    marginBottom: 20,
    backgroundColor: "#060B4D",
    width: "80%",
    alignSelf: "center",
    borderRadius: 5,
  },
  textoBotonContinuar: {
    color: "white",
    alignSelf: "center",
    padding: 10,
    fontFamily: "opensanssemibold",
    fontSize: 16,
  },
  // Estilos del Modal
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)", // Fondo semitransparente
  },
  modalView: {
    width: "85%", // Asegúrate de que el contenedor del modal tenga un ancho definido.
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    fontSize: 30,
    color: "#060B4D",
    fontFamily: "opensanssemibold",
    textAlign: "center",
  },
  modalTextBody: {
    marginTop: 10,
    fontSize: 12,
    color: "#060B4D",
    fontFamily: "opensans",
    textAlign: "center",
  },
});

export default ModalCotizadorCredito;
