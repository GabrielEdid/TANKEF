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
 * `ModalAtencion` es un componente que muestra información de un credito específico,
 * como una tarjeta interactuable. Da el estatus de un credito y ayuda con los flujos.
 *
 * Props:
 * - `texto`: texto que tendra el modal.
 *
 * Tres casos unicos de uso (o ver en ):
 *  <ModalAtencion
 *      texto={
 *        "Tu información ha sido recibida, estamos en proceso de validación, te notificaremos para proceder con el siguiente paso.\n¡Gracias por tu paciencia!"
 *      }
 *    />
 *  <ModalAtencion
 *      texto={
 *        "El dinero ha sido transferido a la cuenta ****8950 Bancomer."
 *      }
 *    />
 *  <ModalAtencion
 *      texto={
 *        "¡La firma del contrato se realizó con éxito! ¡Gracias por tu confianza en nosotros!"
 *      }
 *    />
 */

const ModalAtencion = (props) => {
  const navigation = useNavigation();
  // Contexto de crédito
  const { credit, setCredit } = useContext(CreditContext);

  // Componente visual
  return (
    <>
      <Modal animationType="slide" transparent={true} visible={true}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Image
              style={{ width: 60, height: 60, marginBottom: 10 }}
              source={require("../../assets/images/Atencion.png")}
            />
            <Text style={styles.modalText}>¡Atención!</Text>
            <Text style={styles.texto}>{props.texto}</Text>
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                style={styles.botonContinuar}
                onPress={() => {}}
              >
                <Text style={styles.textoBotonContinuar}>Continuar</Text>
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
    fontSize: 15,
    marginTop: 5,
  },
  line: {
    transform: [{ rotate: "90deg" }],
  },
  botonContinuar: {
    marginTop: 15,
    alignSelf: "center",
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
    backgroundColor: "#060B4D",
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
    width: "80%", // Asegúrate de que el contenedor del modal tenga un ancho definido.
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
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

export default ModalAtencion;
