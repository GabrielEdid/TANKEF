// Importaciones de React Native y React
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Modal,
  Alert,
  ScrollView,
} from "react-native";
import React, { useState, useCallback, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { useRoute } from "@react-navigation/native";
import RadioForm from "react-native-simple-radio-button";
// Importaciones de Componentes y Hooks
import { Feather, MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { APIPut } from "../../API/APIService";

// Se mide la pantalla para determinar medidas
const screenWidth = Dimensions.get("window").width;
const widthHalf = screenWidth / 2;

const Documentacion = ({ navigation }) => {
  const route = useRoute();
  const { flujo } = route.params;
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
  const [modalVisible, setModalVisible] = useState(false);
  const [disabled, setDisabled] = useState(true);

  // Función para subir la documentación
  const handlePress = async () => {
    setDisabled(true);
    console.log("Agregando beneficiarios a la inversión...");
    const url = `/api/v1/investments/${155}`;

    const formData = new FormData();

    formData.append("investment[official_identification]", {
      uri: identificacion,
      type: "application/jpeg", // Ajusta el tipo MIME según sea necesario
      name: "identificacion.jpeg", // Ajusta el nombre del archivo
    });
    formData.append("investment[curp]", {
      uri: CURP,
      type: "application/jpeg", // Ajusta el tipo MIME según sea necesario
      name: "CURP.jpeg", // Ajusta el nombre del archivo
    });
    formData.append("investment[proof_sat]", {
      uri: situacionFiscal,
      type: "application/jpeg", // Ajusta el tipo MIME
      name: "situacionFiscal.jpeg", // Ajusta el nombre del archivo
    });
    formData.append("investment[proof_address]", {
      uri: comprobanteDomicilio,
      type: "application/jpeg", // Ajusta el tipo MIME
      name: "comprobanteDomicilio.jpeg", // Ajusta el nombre del archivo
    });
    formData.append(
      "investment[accept_documentation_1]",
      actuoComo === "Actúo a nombre y por cuenta propia." ? "true" : "false"
    );
    formData.append(
      "investment[accept_documentation_2]",
      actuoComo === "Actúo a nombre y por cuenta de un tercero."
        ? "true"
        : "false"
    );

    try {
      const response = await APIPut(url, formData);

      if (response.error) {
        console.error(
          "Error al agregar los documentos a la inversión:",
          response.error
        );
        Alert.alert(
          "Error",
          "No se pudieron agregar los documentos a la Inversión. Intente nuevamente."
        );
      } else {
        console.log("Documentos agregados exitosamente:", response);
        setModalVisible(true);
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

  // Componente Visual
  return (
    <View style={{ flex: 1 }}>
      {/* Titulo, Nombre de Pantalla y Campana */}
      <View style={styles.tituloContainer}>
        <MaskedView
          style={{ flex: 0.6 }}
          maskElement={<Text style={styles.titulo}>tankef</Text>}
        >
          <LinearGradient
            colors={["#2FF690", "#21B6D5"]}
            start={{ x: 1, y: 1 }}
            end={{ x: 0, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </MaskedView>
        <Text
          style={[
            styles.tituloPantalla,
            {
              fontSize: flujo === "Caja de ahorro" ? 20 : 24,
              marginRight: flujo === "Caja de ahorro" ? 35 : 0,
            },
          ]}
        >
          {flujo}
        </Text>
        <TouchableOpacity>
          <Feather
            name="bell"
            size={25}
            color="#060B4D"
            style={{ marginTop: 50 }}
          />
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1 }}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          <View style={{ flex: 1 }}>
            <View style={styles.seccion}>
              <Text style={styles.tituloSeccion}>Documentación</Text>
              <Text style={styles.bodySeccion}>
                Proporciona la documentación solicitadada para continuar.
              </Text>
            </View>
            <View
              style={{
                marginTop: 5,
                backgroundColor: "white",
              }}
            >
              <Text style={styles.tituloCampo}>CURP</Text>
              <TouchableOpacity
                style={{ flexDirection: "row" }}
                onPress={() => showUploadOptions("curp")}
              >
                <Text style={styles.input}>Selecciona documento</Text>
                <Feather name="upload" size={20} color="#060B4D" />
              </TouchableOpacity>
              {CURP && (
                <>
                  <View style={styles.separacion} />
                  <View
                    style={{
                      flexDirection: "row",
                      paddingVertical: 10,
                    }}
                  >
                    <FontAwesome
                      name="image"
                      size={20}
                      color="#060B4D"
                      style={{ marginLeft: 15 }}
                    />
                    <Text
                      style={{
                        flex: 1,
                        paddingHorizontal: 15,
                        fontSize: 16,
                        color: "#060B4D",
                        fontFamily: "opensans",
                      }}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {nombreCURP}
                    </Text>
                    <TouchableOpacity
                      onPress={() => [setCURP(""), setNombreCURP("")]}
                    >
                      <FontAwesome
                        name="trash-o"
                        size={25}
                        color="#F95C5C"
                        style={{ marginRight: 15 }}
                      />
                    </TouchableOpacity>
                  </View>
                </>
              )}
              <View style={styles.separacion} />

              <Text style={styles.tituloCampo}>
                Documento de identificación (INE o Pasaporte)
              </Text>
              <TouchableOpacity
                style={{ flexDirection: "row" }}
                onPress={() => showUploadOptions("identificacion")}
              >
                <Text style={styles.input}>Selecciona documento</Text>
                <Feather name="upload" size={20} color="#060B4D" />
              </TouchableOpacity>
              {identificacion && (
                <>
                  <View style={styles.separacion} />
                  <View
                    style={{
                      flexDirection: "row",
                      paddingVertical: 10,
                    }}
                  >
                    <FontAwesome
                      name="image"
                      size={20}
                      color="#060B4D"
                      style={{ marginLeft: 15 }}
                    />
                    <Text
                      style={{
                        flex: 1,
                        paddingHorizontal: 15,
                        fontSize: 16,
                        color: "#060B4D",
                        fontFamily: "opensans",
                      }}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {nombreIdentificacion}
                    </Text>
                    <TouchableOpacity
                      onPress={() => [
                        setIdentificacion(""),
                        setNombreIdentificacion(""),
                      ]}
                    >
                      <FontAwesome
                        name="trash-o"
                        size={25}
                        color="#F95C5C"
                        style={{ marginRight: 15 }}
                      />
                    </TouchableOpacity>
                  </View>
                </>
              )}
              <View style={styles.separacion} />

              <Text style={styles.tituloCampo}>
                Constancia de situación fiscal
              </Text>
              <TouchableOpacity
                style={{ flexDirection: "row" }}
                onPress={() => showUploadOptions("fiscal")}
              >
                <Text style={styles.input}>Selecciona documento</Text>
                <Feather name="upload" size={20} color="#060B4D" />
              </TouchableOpacity>
              {situacionFiscal && (
                <>
                  <View style={styles.separacion} />
                  <View
                    style={{
                      flexDirection: "row",
                      paddingVertical: 10,
                    }}
                  >
                    <FontAwesome
                      name="image"
                      size={20}
                      color="#060B4D"
                      style={{ marginLeft: 15 }}
                    />
                    <Text
                      style={{
                        flex: 1,
                        paddingHorizontal: 15,
                        fontSize: 16,
                        color: "#060B4D",
                        fontFamily: "opensans",
                      }}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {nombreSituacionFiscal}
                    </Text>
                    <TouchableOpacity
                      onPress={() => [
                        setSituacionFiscal(""),
                        setNombreSituacionFiscal(""),
                      ]}
                    >
                      <FontAwesome
                        name="trash-o"
                        size={25}
                        color="#F95C5C"
                        style={{ marginRight: 15 }}
                      />
                    </TouchableOpacity>
                  </View>
                </>
              )}
              <View style={styles.separacion} />

              <Text style={styles.tituloCampo}>Comprobante de domicilio</Text>
              <TouchableOpacity
                style={{ flexDirection: "row" }}
                onPress={() => showUploadOptions("domicilio")}
              >
                <Text style={styles.input}>Selecciona documento</Text>
                <Feather name="upload" size={20} color="#060B4D" />
              </TouchableOpacity>
              {comprobanteDomicilio && (
                <>
                  <View style={styles.separacion} />
                  <View
                    style={{
                      flexDirection: "row",
                      paddingVertical: 10,
                    }}
                  >
                    <FontAwesome
                      name="image"
                      size={20}
                      color="#060B4D"
                      style={{ marginLeft: 15 }}
                    />
                    <Text
                      style={{
                        flex: 1,
                        paddingHorizontal: 15,
                        fontSize: 16,
                        color: "#060B4D",
                        fontFamily: "opensans",
                      }}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {nombreComprobanteDomicilio}
                    </Text>
                    <TouchableOpacity
                      onPress={() => [
                        setComprobanteDomicilio(""),
                        setNombreComprobanteDomicilio(""),
                      ]}
                    >
                      <FontAwesome
                        name="trash-o"
                        size={25}
                        color="#F95C5C"
                        style={{ marginRight: 15 }}
                      />
                    </TouchableOpacity>
                  </View>
                </>
              )}
              <View style={styles.separacion} />
            </View>
            <View style={styles.contenedores}>
              <Text style={styles.subTexto}>
                Declaro que soy el propietario real de los recursos y/o
                beneficiario del crédito, por lo que el origen procedencia de
                los recursos que Tu Kapital en Evolución, SAPI de CV, SOFOM,
                ENR, recibirá respecto de los servicios que solicitep proceden
                de fuentes lícitas y son de mi propiedad. Por lo que declaro
                que:
              </Text>
              <RadioForm
                radio_props={dataActuo}
                initial={-1}
                onPress={(value) => setActuoComo(value)}
                buttonColor={"#060B4D"}
                buttonSize={10}
                selectedButtonColor={"#060B4D"}
                labelStyle={{
                  fontSize: 16,
                  color: "#060B4D",
                  fontFamily: "opensanssemibold",
                  marginBottom: 10,
                }}
                animation={false}
                style={{ alignSelf: "baseline", marginTop: 10 }}
              />
              <Text style={[styles.subTexto, { fontSize: 12, marginTop: 10 }]}>
                (*) En caso de actuar a nombre de un tercero, es necesario la
                siguiente información: Identificación oficial vigente, datos
                generales y comprobante de domicilio recientes.
              </Text>
            </View>
          </View>
          {/* Boton de Aceptar */}
          <TouchableOpacity
            style={[
              styles.botonContinuar,
              { backgroundColor: disabled ? "#D5D5D5" : "#060B4D" },
            ]}
            onPress={() => handlePress()}
            disabled={disabled}
          >
            <Text
              style={[
                styles.textoBotonContinuar,
                { color: disabled ? "grey" : "white" },
              ]}
            >
              Aceptar
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Image
              style={{ width: 150, height: 150, marginBottom: 10 }}
              source={require("../../../assets/images/Validacion.png")}
            />
            <Text style={styles.modalText}>Validación</Text>
            <Text style={styles.modalTextBody}>
              Estamos validando tu información. {"\n"}Te notificaremos pronto.
            </Text>
            <TouchableOpacity
              style={[
                styles.botonContinuar,
                { marginBottom: 0, width: "100%" },
              ]}
              onPress={() => [
                setModalVisible(false),
                navigation.navigate("MiTankef"),
              ]}
            >
              <Text style={[styles.textoBotonContinuar, { color: "white" }]}>
                Aceptar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Estilos de la pantalla
const styles = StyleSheet.create({
  tituloContainer: {
    paddingHorizontal: 20,
    flexDirection: "row",
    backgroundColor: "white",
    paddingBottom: 10,
  },
  titulo: {
    fontFamily: "montserrat",
    letterSpacing: -4,
    fontSize: 35,
    marginTop: 40,
  },
  tituloPantalla: {
    flex: 1,
    marginTop: 47,
    fontSize: 24,
    color: "#060B4D",
    fontFamily: "opensanssemibold",
    fontWeight: "bold",
  },
  seccion: {
    marginTop: 5,
    backgroundColor: "white",
    alignItems: "center",
    padding: 15,
  },
  tituloSeccion: {
    fontSize: 25,
    color: "#060B4D",
    fontFamily: "opensanssemibold",
  },
  bodySeccion: {
    marginTop: 10,
    marginBottom: 10,
    fontSize: 14,
    color: "#060B4D",
    fontFamily: "opensanssemibold",
    textAlign: "center",
  },
  tituloCampo: {
    marginTop: 10,
    paddingLeft: 15,
    marginBottom: 10,
    fontSize: 14,
    color: "#060B4D",
    fontFamily: "opensanssemibold",
  },
  contenedores: {
    backgroundColor: "white",
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: "center",
    marginTop: 3,
  },
  texto: {
    color: "#060B4D",
    textAlign: "center",
    fontFamily: "opensans",
    fontSize: 16,
  },
  subTexto: {
    color: "#060B4D",
    fontFamily: "opensanssemibold",
    alignSelf: "baseline",
    fontSize: 14,
  },
  input: {
    paddingLeft: 15,
    fontSize: 16,
    marginBottom: 10,
    fontFamily: "opensanssemibold",
    width: "92%",
    color: "#c7c7c9ff",
  },
  separacion: {
    height: 1,
    width: "100%",
    backgroundColor: "#cecfdbff",
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
    padding: 35,
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
    marginTop: 5,
    marginBottom: 5,
    fontSize: 14,
    color: "#060B4D",
    fontFamily: "opensans",
    textAlign: "center",
  },
});

export default Documentacion;
