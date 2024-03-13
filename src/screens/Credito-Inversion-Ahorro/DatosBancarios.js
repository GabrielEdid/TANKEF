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

// Se mide la pantalla para determinar medidas
const screenWidth = Dimensions.get("window").width;
const widthHalf = screenWidth / 2;

const DatosBancarios = ({ navigation }) => {
  const route = useRoute();
  const { flujo } = route.params;
  // Estados y Contexto
  const [alias, setAlias] = useState("");
  const [clabe, setClabe] = useState("");
  const [NCuenta, setNCuenta] = useState("");
  const [comprobanteNCuenta, setComprobanteNCuenta] = useState("");
  const [nombreComprobante, setNombreComprobante] = useState("");
  const [banco, setBanco] = useState("");
  const [nombre, setNombre] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [disabled, setDisabled] = useState(true);

  // Efecto para deshabilitar el botón si algún campo está vacío
  useEffect(() => {
    const camposLlenos =
      nombre &&
      alias &&
      clabe &&
      clabe.length === 18 &&
      NCuenta &&
      NCuenta.length === 10 &&
      comprobanteNCuenta &&
      banco;
    setDisabled(!camposLlenos);
  }, [nombre, alias, clabe, NCuenta, comprobanteNCuenta, banco]);

  const showUploadOptions = () => {
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
    let result = await DocumentPicker.getDocumentAsync({});
    if (!result.canceled && result.assets) {
      const selectedDocument = result.assets[0];
      setComprobanteNCuenta(selectedDocument.uri);
      setNombreComprobante(selectedDocument.name);
    } else {
      console.log("Operación cancelada o no se seleccionó ningún documento");
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.2,
    });

    if (!result.canceled) {
      const selectedImage = result.assets[0];
      setComprobanteNCuenta(selectedImage.uri);
      setNombreComprobante("Imagen Seleccionada");
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
            style={{ flex: 1 }}
            maskElement={<Text style={styles.titulo}>tankef</Text>}
          >
            <LinearGradient
              colors={["#2FF690", "#21B6D5"]}
              start={{ x: 0.8, y: 0.8 }}
              end={{ x: 0, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
          </MaskedView>
          <Text
            style={[
              styles.tituloPantalla,
              { marginLeft: flujo === "Inversión" ? 0 : 15 },
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
                <Text style={styles.tituloSeccion}>Datos Bancarios</Text>
                <Text style={styles.bodySeccion}>
                  Ingresa los datos solicitados para continuar.
                </Text>
              </View>
              <View
                style={{
                  marginTop: 5,
                  backgroundColor: "white",
                  paddingTop: 15,
                }}
              >
                {/* Campos para introducir los datos bancarios */}
                <Text style={styles.tituloCampo}>Alias Cuenta</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={setAlias}
                  value={alias}
                  placeholder="Eje. Raúl G. Torres"
                />
                <View style={styles.separacion} />
                <Text style={styles.tituloCampo}>Clabe Interbancaria</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={setClabe}
                  value={clabe}
                  placeholder="18 dígitos"
                  maxLength={18}
                  keyboardType="numeric"
                />
                <View style={styles.separacion} />
                <Text style={styles.tituloCampo}>No. Cuenta</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={setNCuenta}
                  value={NCuenta}
                  placeholder="10 dígitos"
                  maxLength={10}
                  keyboardType="numeric"
                />
                <View style={styles.separacion} />
                <Text style={styles.tituloCampo}>Banco</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={setBanco}
                  value={banco}
                  placeholder="Nombre Banco"
                />
                <View style={styles.separacion} />
                <View>
                  <Text style={styles.tituloCampo}>Nombre(s) y Apellidos</Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={setNombre}
                    value={nombre}
                    placeholder="Nombre Cuentahabiente"
                  />
                </View>
                <View style={styles.separacion} />
                <Text style={styles.tituloCampo}>
                  Carátula de Estado de Cuenta
                </Text>
                <TouchableOpacity
                  style={{ flexDirection: "row" }}
                  onPress={showUploadOptions}
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
                {comprobanteNCuenta && (
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
                        {nombreComprobante}
                      </Text>
                      <TouchableOpacity
                        onPress={() => [
                          setComprobanteNCuenta(""),
                          setNombreComprobante(""),
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
    marginRight: 85,
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

export default DatosBancarios;
