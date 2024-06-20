import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Modal,
  Alert,
  TextInput,
  Image,
} from "react-native";
import React, { useState, useCallback, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { APIGet } from "../API/APIService";
import { useInactivity } from "../hooks/InactivityContext";
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";

/**
 * `ModalAceptarObligados` es un componente que muestra información de los obligados solidarios, si aceptaron o no la solicitud,
 * como una tarjeta interactuable. Depenediendo de sus props sera el texto y opciones mostradas.
 *
 * Props:
 * - `visible`: booleano que indica si el modal esta visible o no.
 * - `onClose`: función que se ejecuta para cerrar el modal.
 * - `financeId`: id del flujo.
 * - `flujo`: tipo de flujo.
 *
 * Ejemplo (o ver en MiTankefCredito.js):
 *    <ModalAceptarObligados
 *      visible={modalAceptarObligadosVisible}
 *      onClose={() => [setModalAceptarObligadosVisible(false), resetTimeout()]}
 *      />
 */

const screenWidth = Dimensions.get("window").width;

const ALLOWED_EXTENSIONS = ["pdf", "jpg", "jpeg", "png", "bmp"];
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

const ModalAceptarObligados = (props) => {
  const route = useRoute();
  const { resetTimeout } = useInactivity();

  // Local state management
  useEffect(() => {
    if (props.visible) {
    }
  }, [props.visible]);

  function titleCase(str) {
    return str
      .toLowerCase()
      .split(" ")
      .map(function (word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(" ");
  }

  const obligados = [
    { name: "Alberto Villa Gúzman", amount: "$15,000.00" },
    { name: "Samuel L. Rodríguez", amount: "$15,000.00" },
  ];

  return (
    <Modal animationType="slide" transparent={true} visible={props.visible}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Image
            source={require("../../assets/images/ObligadosSolidarios.png")}
            style={{ width: 62, height: 50 }}
          />
          <Text style={styles.titulo}>Obligado solidario</Text>
          <Text style={styles.text}>
            La solicitud por $30,000.00 MN ha sido aceptada por los obligados
            solidarios.
          </Text>

          {obligados.map((obligado, index) => (
            <React.Fragment key={index}>
              <View style={styles.linea} />

              <View style={{ flexDirection: "row", paddingHorizontal: 10 }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.textDatos}>{obligado.name}</Text>
                  <Text style={styles.textDatos}>{obligado.amount}</Text>
                </View>
                {/* O uno o otro */}
                <Ionicons
                  name="checkmark-circle"
                  size={35}
                  color={"#2FF690"}
                  style={{ alignSelf: "center" }}
                />
                <AntDesign
                  name="closecircle"
                  size={29}
                  color="#f23a43"
                  style={{ alignSelf: "center" }}
                />
              </View>
            </React.Fragment>
          ))}
          <View style={styles.linea} />

          {/* Determinar la diferente configuracion de botones */}
          <TouchableOpacity
            style={styles.botonContinuar}
            onPress={() => {
              props.onClose();
            }}
          >
            <Text style={styles.textoBotonContinuar}>Aceptar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.botonContinuar,
              {
                backgroundColor: "#2FF690",
              },
            ]}
            onPress={() => {
              props.onClose();
            }}
          >
            <Text
              style={[
                styles.textoBotonContinuar,
                {
                  color: "#060B4D",
                },
              ]}
            >
              Acepto los $2000.00
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.botonContinuar,
              {
                backgroundColor: "#2FF690",
              },
            ]}
            onPress={() => {
              props.onClose();
            }}
          >
            <Text
              style={[
                styles.textoBotonContinuar,
                {
                  color: "#060B4D",
                },
              ]}
            >
              Rechazar y pedir al comité
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.botonContinuar,
              {
                backgroundColor: "#2FF690",
              },
            ]}
            onPress={() => {
              props.onClose();
            }}
          >
            <Text
              style={[
                styles.textoBotonContinuar,
                {
                  color: "#060B4D",
                  textAlign: "center",
                },
              ]}
            >
              Conservar los $2000.00 y solicitar el resto al comité
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.botonContinuar,
              {
                backgroundColor: "white",
                borderWidth: 1,
                borderColor: "#060B4D",
              },
            ]}
            onPress={() => {
              props.onClose();
            }}
          >
            <Text
              style={[
                styles.textoBotonContinuar,
                {
                  color: "#060B4D",
                },
              ]}
            >
              Cancelar
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  titulo: {
    fontSize: 25,
    marginVertical: 15,
    color: "#060B4D",
    fontFamily: "opensanssemibold",
  },
  botonWrapper: {
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
  },
  uploadText: {
    marginVertical: 10,
    fontSize: 16,
    color: "#060B4D",
    fontFamily: "opensans",
  },
  header: {
    color: "#060B4D",
    textAlign: "center",
    fontFamily: "opensansbold",
    fontSize: 16,
    marginTop: 10,
  },
  botonContinuar: {
    marginTop: 5,
    alignSelf: "center",
    borderRadius: 5,
    width: "90%",
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalView: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
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
  linea: {
    height: 1,
    backgroundColor: "#cecfdb",
    width: "100%",
    marginVertical: 10,
  },
  text: {
    marginVertical: 2.5,
    fontSize: 14,
    color: "#060B4D",
    fontFamily: "opensans",
    textAlign: "center",
  },
  textDatos: {
    marginVertical: 2.5,
    fontSize: 16,
    color: "#060B4D",
    fontFamily: "opensansbold",
  },
});

export default ModalAceptarObligados;
