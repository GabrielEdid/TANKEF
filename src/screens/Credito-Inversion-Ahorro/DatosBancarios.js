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
} from "react-native";
import React, { useState, useCallback, useEffect, useContext } from "react";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import RadioForm from "react-native-simple-radio-button";
import { ActivityIndicator } from "react-native-paper";
import { useRoute, useFocusEffect } from "@react-navigation/native";
// Importaciones de Componentes y Hooks
import { FinanceContext } from "../../hooks/FinanceContext";
import { APIPost, APIGet } from "../../API/APIService";
import ModalEstatus from "../../components/ModalEstatus";
import { Feather, MaterialIcons, FontAwesome } from "@expo/vector-icons";

// Se mide la pantalla para determinar medidas
const screenWidth = Dimensions.get("window").width;
const widthHalf = screenWidth / 2;

const DatosBancarios = ({ navigation }) => {
  const route = useRoute();
  const { flujo, idInversion, sendDocuments, addAccount } = route.params;
  // Estados y Contexto
  const { finance, setFinance, resetFinance } = useContext(FinanceContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [initial, setInitial] = useState(-1);
  const [x, setX] = useState(true);
  const [loading, setLoading] = useState(false);

  // Funcion para guardar los datos de la cuenta bancaria
  const handlePress = async () => {
    setLoading(true);
    setDisabled(true);

    console.log("Enviando documentos desde Datos Bancarios");
    await sendDocuments();
    console.log("Se termino de enviar documentos desde Datos Bancarios");

    const url = `/api/v1/${
      flujo === "Inversión" ? "investments" : "box_savings"
    }/${idInversion}/bank_accounts`;

    const key = flujo === "Inversión" ? "investment" : "box_saving";

    const formData = new FormData();

    formData.append(
      `${key}[bank_account_attributes][short_name]`,
      finance.alias
    );
    formData.append(`${key}[bank_account_attributes][clabe]`, finance.clabe);
    formData.append(`${key}[bank_account_attributes][bank]`, finance.banco);
    formData.append(
      `${key}[bank_account_attributes][owner_name]`,
      finance.nombreCuentahabiente
    );
    formData.append(
      `${key}[bank_account_attributes][account]`,
      finance.NCuenta
    );
    formData.append(`${key}[bank_account_attributes][proof_clabe]`, {
      uri: finance.comprobanteNCuenta,
      type: "image/jpeg",
      name: "comprobanteNCuenta.jpg",
    });

    try {
      console.log("Enviando datos de cuenta bancaria");
      const response = await APIPost(url, formData);

      if (response.error) {
        const errorMessages = response.error.errors
          ? Object.values(response.error.errors).flat().join(". ")
          : response.error;
        setLoading(false);
        console.error("Error al guardar la cuenta bancaria:", response.error);
        Alert.alert("Error", errorMessages);
      } else {
        setLoading(false);
        console.log("Datos de cuenta bancaria guardados con éxito");
        resetFinance();
        navigation.navigate("MiTankef");
        setModalVisible(true);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error al enviar datos (bancarios):", error);
      Alert.alert(
        "Error",
        "Hubo un problema al enviar los datos. Por favor, intenta de nuevo."
      );
    } finally {
      setLoading(false);
      setDisabled(false);
    }
  };

  // Funcion para manejar el boton de cancelar
  const handleCancelar = () => {
    Alert.alert(
      `¿Deseas cancelar la ${flujo}`,
      `Si cancelas la ${flujo}, perderás la información ingresada hasta el momento.`,
      [
        {
          text: `Si`,
          onPress: () => [cancelar()],
          style: "destructive",
        },
        {
          text: `No`,
        },
      ],
      { cancelable: true }
    );

    const cancelar = async () => {
      setLoading(true);
      const url = `/api/v1/${
        flujo === "Inversión" ? "investments" : "box_savings"
      }/${idInversion}/cancel`;
      const data = "";

      const response = await APIPost(url, data);
      if (response.error) {
        setLoading(false);
        console.error(
          "Error al eliminar la caja de ahorro o inversion:",
          response.error
        );
        Alert.alert(
          "Error",
          `No se pudo eliminar la ${flujo}. Intente nuevamente.`
        );
      } else {
        setLoading(false);
        console.log(
          "Caja de ahorro o Inversión eliminada exitosamente:",
          response
        );
        resetFinance();
        navigation.navigate("Inicio");
      }
    };
  };

  // Efecto para encontrar el banco asociado a la clabe
  useEffect(() => {
    const verificarClabe = async () => {
      if (finance.clabe.length < 18) {
        setFinance({ ...finance, banco: "" });
      } else if (finance.clabe.length === 18) {
        const url = `/api/v1/clabe_validation`;
        const formData = new FormData();

        formData.append("clabe", finance.clabe);

        try {
          const response = await APIPost(url, formData);

          if (response.error) {
            console.error(
              "Error al encontrar la cuenta bancaria:",
              response.error
            );
            Alert.alert(
              "Error",
              "La clabe introducida no está asociada a ningun banco"
            );
            setFinance({ ...finance, banco: "" });
          } else {
            setFinance({ ...finance, banco: response.data.data.bank_tag });
          }
        } catch (error) {
          console.error("Error al encontrar la cuenta de banco:", error);
          Alert.alert(
            "Error",
            "Hubo un problema al encontrar la cuenta de banco. Por favor, intenta de nuevo."
          );
        }
      }
    };

    verificarClabe();
  }, [finance.clabe]);

  // Efecto para deshabilitar el botón si algún campo está vacío
  useEffect(() => {
    const camposLlenos =
      (finance.nombreCuentahabiente &&
        finance.alias &&
        finance.clabe &&
        finance.clabe.length === 18 &&
        finance.NCuenta &&
        finance.comprobanteNCuenta &&
        finance.banco) ||
      finance.accountID;
    setDisabled(!camposLlenos);
  }, [
    finance.nombreCuentahabiente,
    finance.alias,
    finance.clabe,
    finance.NCuenta,
    finance.comprobanteNCuenta,
    finance.banco,
    finance.accountID,
  ]);

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
      setFinance({
        ...finance,
        comprobanteNCuenta: selectedDocument.uri,
        nombreComprobante: selectedDocument.name,
      });
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
      console.log(selectedImage.uri);
      setFinance({
        ...finance,
        comprobanteNCuenta: selectedImage.uri,
        nombreComprobante: "Carátula Seleccionada",
      });
    } else {
      console.log("Operación cancelada o no se seleccionó ninguna imagen");
    }
  };

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
            start={{ x: 0.8, y: 0.8 }}
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
                onChangeText={(value) =>
                  setFinance({ ...finance, alias: value })
                }
                value={finance.alias}
                placeholder="Eje. Raúl G. Torres"
              />
              <View style={styles.separacion} />
              <Text style={styles.tituloCampo}>Clabe Interbancaria</Text>
              <TextInput
                style={styles.input}
                onChangeText={(value) =>
                  setFinance({ ...finance, clabe: value })
                }
                value={finance.clabe}
                placeholder="18 dígitos"
                maxLength={18}
                keyboardType="numeric"
              />
              <View style={styles.separacion} />
              <Text style={styles.tituloCampo}>
                Comprobante CLABE Interbancaria (pdf, jpg, jpeg, png)
              </Text>
              {!finance.comprobanteNCuenta ? (
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
              ) : (
                <>
                  <View
                    style={{
                      flexDirection: "row",
                      paddingBottom: 7.5,
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
                      {finance.nombreComprobante}
                    </Text>
                    <TouchableOpacity
                      onPress={() => [
                        setFinance({
                          ...finance,
                          comprobanteNCuenta: "",
                          nombreComprobante: "",
                        }),
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

              <Text style={styles.tituloCampo}>No. Cuenta</Text>
              <TextInput
                style={styles.input}
                onChangeText={(value) =>
                  setFinance({ ...finance, NCuenta: value })
                }
                value={finance.NCuenta}
                placeholder="8-11 dígitos"
                maxLength={11}
                keyboardType="numeric"
              />
              <View style={styles.separacion} />
              <Text style={[styles.tituloCampo, { color: "#9c9db8" }]}>
                Banco
              </Text>
              <TextInput
                style={styles.input}
                onChangeText={(value) =>
                  setFinance({ ...finance, banco: value })
                }
                value={finance.banco}
                placeholder="Autorrelleno"
                editable={false}
              />
              <View style={styles.separacion} />
              <View>
                <Text style={styles.tituloCampo}>Nombre(s) y Apellidos</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={(value) =>
                    setFinance({ ...finance, nombreCuentahabiente: value })
                  }
                  value={finance.nombreCuentahabiente}
                  placeholder="Nombre Cuentahabiente"
                />
              </View>
              <View style={styles.separacion} />
            </View>
          </View>
        </KeyboardAwareScrollView>
        {/* Boton de Aceptar */}

        {addAccount === false && (
          <TouchableOpacity
            style={[
              styles.botonContinuar,
              {
                backgroundColor: "white",
                borderWidth: 1,
                borderColor: "#060B4D",
                marginBottom: 0,
              },
            ]}
            onPress={() => navigation.goBack()}
          >
            <Text style={[styles.textoBotonContinuar, { color: "#060B4D" }]}>
              Regresar
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[
            styles.botonContinuar,
            {
              backgroundColor: disabled ? "#D5D5D5" : "#060B4D",
              marginBottom: 0,
            },
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

        <TouchableOpacity
          style={[
            styles.botonContinuar,
            {
              backgroundColor: "white",
              marginBottom: 30,
            },
          ]}
          onPress={() => {
            handleCancelar();
          }}
        >
          <Text style={[styles.textoBotonContinuar, { color: "#F95C5C" }]}>
            Cancelar {flujo}
          </Text>
        </TouchableOpacity>
      </View>

      {/* <ModalEstatus
        titulo={"¡Atención!"}
        texto={
          "Tu información ha sido recibida, estamos en proceso de validación, te notificaremos para proceder con el siguiente paso.\n¡Gracias por tu paciencia!"
        }
        imagen={"Alert"}
        visible={modalVisible}
        onAccept={() => [
          setModalVisible(false),
          setInitial(-1),
          resetFinance(),
          navigation.navigate("MiTankef"),
        ]}
      /> */}
      {loading && (
        <View style={styles.overlay}>
          <ActivityIndicator size={75} color="#060B4D" />
        </View>
      )}
      <ModalEstatus
        titulo={"¡Atención!"}
        texto={
          "Tu documentación ha sido recibida, estamos en proceso de validación, te notificaremos para proceder con el siguiente paso.\n¡Gracias por tu paciencia!"
        }
        imagen={"Alert"}
        visible={modalVisible}
        onAccept={() => [
          setModalVisible(false),
          resetFinance(),
          navigation.navigate("MiTankef"),
        ]}
      />
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
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalView: {
    width: "80%",
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
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default DatosBancarios;
