// Importaciones de React Native y React
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  ScrollView,
  Modal,
} from "react-native";
import React, { useState, useCallback, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { useRoute } from "@react-navigation/native";
import RadioForm from "react-native-simple-radio-button";
// Importaciones de Componentes y Hooks
import {
  Feather,
  MaterialIcons,
  FontAwesome,
  AntDesign,
} from "@expo/vector-icons";
import { APIPut } from "../API/APIService";

// Se mide la pantalla para determinar medidas
const screenWidth = Dimensions.get("window").width;
const widthHalf = screenWidth / 2;

const TablaAmortizacion = (props, { navigation }) => {
  const route = useRoute();
  const { flujo, idInversion } = route.params;
  // Estados y Contexto
  const [CURP, setCURP] = useState("");
  const [nombreCURP, setNombreCURP] = useState("");
  const [situacionFiscal, setSituacionFiscal] = useState("");
  const [nombreSituacionFiscal, setNombreSituacionFiscal] = useState("");
  const [comprobanteDomicilio, setComprobanteDomicilio] = useState("");
  const [nombreComprobanteDomicilio, setNombreComprobanteDomicilio] =
    useState("");
  const [identificacion, setIdentificacion] = useState("");
  const [nombreIdentificacion, setNombreIdentificacion] = useState("");
  const [actuoComo, setActuoComo] = useState("");
  //const [modalVisible, setModalVisible] = useState(false);
  const [disabled, setDisabled] = useState(true);

  // Función para subir la documentación
  const handlePress = async () => {
    setDisabled(true);
    console.log("Agregando los documentos a la inversión o caja de ahorro...");
    const url = `/api/v1/${
      flujo === "Inversión" ? "investments" : "box_savings"
    }/${idInversion}`;

    const key = flujo === "Inversión" ? "investment" : "box_saving";
    const formData = new FormData();

    formData.append(`${key}[official_identification]`, {
      uri: identificacion,
      type: "application/jpeg",
      name: "identificacion.jpeg",
    });
    formData.append(`${key}[curp]`, {
      uri: CURP,
      type: "application/jpeg",
      name: "CURP.jpeg",
    });
    formData.append(`${key}[proof_sat]`, {
      uri: situacionFiscal,
      type: "application/jpeg",
      name: "situacionFiscal.jpeg",
    });
    formData.append(`${key}[proof_address]`, {
      uri: comprobanteDomicilio,
      type: "application/jpeg",
      name: "comprobanteDomicilio.jpeg",
    });
    formData.append(
      `${key}[accept_documentation_1]`,
      actuoComo === "Actúo a nombre y por cuenta propia." ? "true" : "false"
    );
    formData.append(
      `${key}[accept_documentation_2]`,
      actuoComo === "Actúo a nombre y por cuenta de un tercero."
        ? "true"
        : "false"
    );

    try {
      const response = await APIPut(url, formData);

      if (response.error) {
        console.error(
          "Error al agregar los documentos a la inversión o caja de ahorro:",
          response.error
        );
        Alert.alert(
          "Error",
          `No se pudieron agregar los documentos a la ${
            flujo === "Inversión" ? "Inversión" : "Caja de Ahorro"
          }. Intente nuevamente.`
        );
      } else {
        console.log("Documentos agregados exitosamente:", response);
        navigation.navigate("DatosBancarios", {
          flujo: flujo,
          idInversion: idInversion,
        });
      }
    } catch (error) {
      console.error("Error en la petición:", error);
      Alert.alert("Error", "Ocurrió un error al procesar la solicitud.");
    } finally {
      setDisabled(false);
    }
  };

  // Efecto para deshabilitar el botón si algún campo está vacío
  useEffect(() => {
    const camposLlenos =
      CURP &&
      situacionFiscal &&
      comprobanteDomicilio &&
      identificacion &&
      actuoComo;
    setDisabled(!camposLlenos);
  }, [CURP, situacionFiscal, comprobanteDomicilio, identificacion, actuoComo]);

  const showUploadOptions = (setType) => {
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
          onPress: () => pickImage(setType),
        },
        {
          text: "Documentos",
          onPress: () => pickDocument(setType),
        },
      ],
      { cancelable: true }
    );
  };

  const pickDocument = async (setType) => {
    let result = await DocumentPicker.getDocumentAsync({});
    if (!result.canceled && result.assets) {
      const selectedDocument = result.assets[0];
      if (setType === "fiscal") {
        setSituacionFiscal(selectedDocument.uri);
        setNombreSituacionFiscal(selectedDocument.name);
      } else if (setType === "domicilio") {
        setComprobanteDomicilio(selectedDocument.uri);
        setNombreComprobanteDomicilio(selectedDocument.name);
      } else if (setType === "identificacion") {
        setIdentificacion(selectedDocument.uri);
        setNombreIdentificacion(selectedDocument.name);
      } else if (setType === "curp") {
        setCURP(selectedDocument.uri);
        setNombreCURP(selectedDocument.name);
      }
    } else {
      console.log("Operación cancelada o no se seleccionó ningún documento");
    }
  };

  const pickImage = async (setType) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.2,
    });

    if (!result.canceled) {
      const selectedImage = result.assets[0];
      if (setType === "fiscal") {
        setSituacionFiscal(selectedImage.uri);
        setNombreSituacionFiscal("Constancia Seleccionada");
      } else if (setType === "domicilio") {
        setComprobanteDomicilio(selectedImage.uri);
        setNombreComprobanteDomicilio("Comprobante Seleccionado");
      } else if (setType === "identificacion") {
        setIdentificacion(selectedImage.uri);
        setNombreIdentificacion("Identificación Seleccionada");
      } else if (setType === "curp") {
        setCURP(selectedImage.uri);
        setNombreCURP("CURP Seleccionado");
      }
    } else {
      console.log("Operación cancelada o no se seleccionó ninguna imagen");
    }
  };

  const [dataActuo] = useState([
    {
      label: "Actúo a nombre y por cuenta propia.",
      value: "Actúo a nombre y por cuenta propia.",
    },
    {
      label: "Actúo a nombre y por cuenta de un tercero(*).",
      value: "Actúo a nombre y por cuenta de un tercero.",
    },
  ]);

  const data = Array.from({ length: 24 }, (_, i) => ({
    cuota: i + 1,
    inicio: `Inicio ${i + 1}`,
    vencimiento: `Vencimiento ${i + 1}`,
    dias: `Días ${i + 1}`,
    depositos: `Depósitos ${i + 1}`,
    acumulado: `Acumulado ${i + 1}`,
    rendimientoBruto: `Rendimiento Bruto ${i + 1}`,
    impuesto: `Impuesto ${i + 1}`,
    rendimientoNeto: `Rendimiento Neto ${i + 1}`,
    tasa: `Tasa ${i + 1}%`,
  }));

  // Componente Visual
  return (
    <Modal
      style={{ flex: 1 }}
      animationType="slide"
      transparent={true}
      visible={props.visible}
    >
      {/* Titulo, Nombre de Pantalla y Campana */}
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
        <ScrollView horizontal>
          <View>
            <ScrollView>
              <View style={styles.tableHeader}>
                {[
                  "Cuota",
                  "Inicio",
                  "Vencimiento",
                  "Días",
                  "Depósitos",
                  "Acumulado",
                  "Rendimiento Bruto",
                  "Impuesto",
                  "Rendimiento Neto",
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
            </ScrollView>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

// Estilos de la pantalla
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
});

export default TablaAmortizacion;
