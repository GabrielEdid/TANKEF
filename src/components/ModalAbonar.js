import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Modal,
  Alert,
  TextInput,
} from "react-native";
import React, { useState, useCallback, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { APIGet } from "../API/APIService";
import { useInactivity } from "../hooks/InactivityContext";
import { Feather, FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { set } from "date-fns";

const screenWidth = Dimensions.get("window").width;

const ALLOWED_EXTENSIONS = ["pdf", "jpg", "jpeg", "png", "bmp"];
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

const ModalAbonar = (props) => {
  const route = useRoute();
  const { resetTimeout } = useInactivity();

  // Local state management
  const [beneficiario, setBeneficiario] = useState("");
  const [institucion, setInstitucion] = useState("");
  const [cuentaClabe, setCuentaClabe] = useState("");
  const [referencia, setReferencia] = useState("");
  const [monto, setMonto] = useState("");
  const [montoShow, setMontoShow] = useState("");
  const [montoNumeric, setMontoNumeric] = useState(0);
  const [comprobantePago, setComprobantePago] = useState("");
  const [nombreComprobante, setNombreComprobante] = useState("");

  const fetchAbono = async () => {
    const url = `/api/v1/investments/${props.financeId}`;

    const result = await APIGet(url);

    if (result.error) {
      console.error(
        "Error al obtener la orden de pago del usuario:",
        result.error
      );
      Alert.alert("Error", "Error al obtener la orden de pago.");
    } else {
      console.log(
        "Resultado de la orden de pago del usuario:",
        result.data.data.stp_account
      );
      setBeneficiario(titleCase(result.data.data.stp_account.beneficiary));
      setInstitucion(result.data.data.stp_account.institution);
      setCuentaClabe(result.data.data.stp_account.clabe);
      setReferencia(result.data.data.stp_account.reference);
      setMonto(formatAmount(result.data.data.stp_account.amount));
    }
  };

  useEffect(() => {
    if (props.visible) {
      fetchAbono();
    }
  }, [props.visible]);

  const showUploadOptions = () => {
    resetTimeout();
    Alert.alert(
      "Seleccionar Documento",
      "Elige de donde deseas subir tu documento:",
      [
        {
          text: "Cancelar",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Galería de Fotos",
          onPress: () => {
            pickImage();
            console.log("Photo Gallery Pressed");
          },
        },
        {
          text: "Documentos",
          onPress: () => {
            pickDocument();
            console.log("Documents Pressed");
          },
        },
      ],
      { cancelable: true }
    );
  };

  const pickDocument = async () => {
    resetTimeout();
    let result = await DocumentPicker.getDocumentAsync({});
    if (result.type === "success") {
      const selectedDocument = result;

      const extension = selectedDocument.name.split(".").pop().toLowerCase();

      if (!ALLOWED_EXTENSIONS.includes(extension)) {
        Alert.alert(
          "Error",
          "Formato de archivo no permitido. Solo se permiten PDF, JPG, JPEG, PNG o BMP."
        );
        return;
      }

      if (selectedDocument.size > MAX_FILE_SIZE_BYTES) {
        Alert.alert("Error", "El documento excede el tamaño máximo de 10MB.");
        return;
      }

      setComprobantePago(selectedDocument.uri);
      setNombreComprobante(selectedDocument.name);
    } else {
      console.log("Operación cancelada o no se seleccionó ningún documento");
    }
  };

  const pickImage = async () => {
    resetTimeout();
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.2,
    });

    if (!result.canceled) {
      const selectedImage = result.assets[0];

      const extension = selectedImage.uri.split(".").pop().toLowerCase();

      if (!ALLOWED_EXTENSIONS.includes(extension)) {
        Alert.alert(
          "Error",
          "Formato de archivo no permitido. Solo se permiten PDF, JPG, JPEG, PNG o BMP."
        );
        return;
      }

      if (selectedImage.fileSize > MAX_FILE_SIZE_BYTES) {
        Alert.alert("Error", "La imagen excede el tamaño máximo de 10MB.");
        return;
      }

      setComprobantePago(selectedImage.uri);
      setNombreComprobante("Pago Seleccionado");
    } else {
      console.log("Operación cancelada o no se seleccionó ninguna imagen");
    }
  };

  function titleCase(str) {
    return str
      .toLowerCase()
      .split(" ")
      .map(function (word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(" ");
  }

  return (
    <Modal animationType="slide" transparent={true} visible={props.visible}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.titulo}>Abonar</Text>

          {props.flujo === "credit" && (
            <Text style={styles.text}>
              Tu Kapital en Evolución, SAPI de CV SOFOM, ENR.{"\n"}Banco INBURSA
              {"\n"}No. de cuenta 5005 7137 181
            </Text>
          )}

          <Text style={styles.text}>
            Beneficiario:{" "}
            <Text style={{ fontFamily: "opensans" }}>{beneficiario}</Text>
          </Text>
          <Text style={styles.text}>
            Instución:{" "}
            <Text style={{ fontFamily: "opensans" }}>{institucion}</Text>
          </Text>

          <Text style={styles.text}>
            Clabe interbancaria:{" "}
            <Text style={{ fontFamily: "opensans" }}>{cuentaClabe}</Text>
          </Text>
          <Text style={styles.text}>
            Referencia:{" "}
            <Text style={{ fontFamily: "opensans" }}>{referencia || "NA"}</Text>
          </Text>

          {props.flujo === "credit" && (
            <>
              <Text style={styles.header}>Carga tu comprobante de pago</Text>
              {!comprobantePago ? (
                <TouchableOpacity
                  style={styles.botonWrapper}
                  onPress={() => showUploadOptions()}
                >
                  <Text
                    style={[
                      styles.uploadText,
                      {
                        color: "#b3b5c9ff",
                      },
                    ]}
                  >
                    Carga un documento
                  </Text>
                  <Feather
                    name="upload"
                    size={16}
                    color="#b3b5c9ff"
                    style={{ marginLeft: 10 }}
                  />
                </TouchableOpacity>
              ) : (
                <View
                  style={{
                    flexDirection: "row",
                    marginVertical: 10,
                  }}
                >
                  <FontAwesome
                    name="image"
                    size={20}
                    color="#060B4D"
                    style={{ marginLeft: 15, alignSelf: "center" }}
                  />
                  <Text
                    style={{
                      flex: 1,
                      paddingHorizontal: 10,
                      fontSize: 16,
                      color: "#060B4D",
                      fontFamily: "opensans",
                      marginVertical: 2.5,
                    }}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {nombreComprobante}
                  </Text>
                  <TouchableOpacity
                    onPress={() => [
                      setComprobantePago(""),
                      setNombreComprobante(""),
                      resetTimeout(),
                    ]}
                  >
                    <FontAwesome
                      name="trash-o"
                      size={25}
                      color="#F95C5C"
                      style={{ marginRight: 15, alignSelf: "center" }}
                    />
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              style={styles.botonContinuar}
              onPress={() => {
                [props.onClose()];
              }}
            >
              <Text style={styles.textoBotonContinuar}>Aceptar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  titulo: {
    fontSize: 25,
    marginBottom: 10,
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
  text: {
    marginVertical: 2.5,
    fontSize: 16,
    color: "#060B4D",
    fontFamily: "opensanssemibold",
    textAlign: "center",
  },
});

export default ModalAbonar;
