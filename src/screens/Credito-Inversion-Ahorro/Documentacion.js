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
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState, useCallback, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useRoute } from "@react-navigation/native";
// Importaciones de Componentes y Hooks
import { Feather, MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { subISOWeekYears } from "date-fns";

// Se mide la pantalla para determinar medidas
const screenWidth = Dimensions.get("window").width;
const widthHalf = screenWidth / 2;

const Documentacion = ({ navigation }) => {
  const route = useRoute();
  const { flujo } = route.params;
  // Estados y Contexto
  const [CURP, setCURP] = useState("");
  const [situacionFiscal, setSituacionFiscal] = useState("");
  const [comprobanteDomicilio, setComprobanteDomicilio] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [disabled, setDisabled] = useState(true);

  // Efecto para deshabilitar el botón si algún campo está vacío
  useEffect(() => {
    const camposLlenos = CURP && situacionFiscal && comprobanteDomicilio;
    setDisabled(!camposLlenos);
  }, [CURP, situacionFiscal, comprobanteDomicilio]);

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
      } else if (setType === "domicilio") {
        setComprobanteDomicilio(selectedDocument.uri);
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
      } else if (setType === "domicilio") {
        setComprobanteDomicilio(selectedImage.uri);
      }
    } else {
      console.log("Operación cancelada o no se seleccionó ninguna imagen");
    }
  };

  // Componente Visual
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
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
          <Text style={styles.tituloPantalla}>{flujo}</Text>
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
          <KeyboardAwareScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            scrollEnabled={false}
            enableOnAndroid={true}
            style={styles.scrollV}
            keyboardShouldPersistTaps="handled"
            extraScrollHeight={100}
          >
            <View style={{ flex: 1 }}>
              <View style={styles.seccion}>
                <Text style={styles.tituloSeccion}>Documentación</Text>
                <Text style={styles.bodySeccion}>
                  Ingresa los datos solicitados para continuar.
                </Text>
              </View>
              <View
                style={{
                  marginTop: 5,
                  backgroundColor: "white",
                }}
              >
                {/* Campos para introducir los datos bancarios */}

                <View>
                  <Text style={styles.tituloCampo}>CURP</Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={setCURP}
                    value={CURP}
                    placeholder="Nombre Cuentahabiente"
                  />
                </View>
                <View style={styles.separacion} />
                <Text style={styles.tituloCampo}>
                  Constancia de situación fiscal
                </Text>
                <TouchableOpacity
                  style={{ flexDirection: "row" }}
                  onPress={() => showUploadOptions("fiscal")}
                >
                  <Text
                    style={[
                      styles.input,
                      {
                        width: "92%",
                        color: "#c7c7c9ff",
                      },
                    ]}
                  >
                    Selecciona documento
                  </Text>
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
                        {situacionFiscal.split("/").pop()}
                      </Text>
                      <TouchableOpacity onPress={() => setSituacionFiscal("")}>
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
                  <Text
                    style={[
                      styles.input,
                      {
                        width: "92%",
                        color: "#c7c7c9ff",
                      },
                    ]}
                  >
                    Selecciona documento
                  </Text>
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
                        {comprobanteDomicilio.split("/").pop()}
                      </Text>
                      <TouchableOpacity
                        onPress={() => setComprobanteDomicilio("")}
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
            </View>
          </KeyboardAwareScrollView>
          {/* Boton de Aceptar */}
          <TouchableOpacity
            style={[
              styles.botonContinuar,
              { backgroundColor: disabled ? "#D5D5D5" : "#060B4D" },
            ]}
            onPress={() => setModalVisible(true)}
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
                  navigation.navigate("DefinirFirma", { flujo: flujo }),
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
    </TouchableWithoutFeedback>
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
    marginRight: 35,
    fontSize: 20,
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
  input: {
    paddingLeft: 15,
    fontSize: 16,
    width: "100%",
    color: "#060B4D",
    marginBottom: 10,
    fontFamily: "opensanssemibold",
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
