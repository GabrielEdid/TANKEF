// Importaciones de React Native y React
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Alert,
} from "react-native";
import React, { useState, useCallback, useEffect, useContext } from "react";
import { LinearGradient } from "expo-linear-gradient";
import CountryPicker from "react-native-country-picker-modal";
import DropDownPicker from "react-native-dropdown-picker";
import { ActivityIndicator } from "react-native-paper";
import MaskedView from "@react-native-masked-view/masked-view";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { AsYouType } from "libphonenumber-js";
import { useRoute } from "@react-navigation/native";
import RadioForm from "react-native-simple-radio-button";
// Importaciones de Componentes y Hooks
import { APIPut, APIPost } from "../../API/APIService";
import { FinanceContext } from "../../hooks/FinanceContext";
import { Feather, Entypo, AntDesign } from "@expo/vector-icons";

// Se mide la pantalla para determinar medidas
const screenWidth = Dimensions.get("window").width;
const widthHalf = screenWidth / 2;

const InfoGeneral = ({ navigation }) => {
  const route = useRoute();
  const { flujo, idInversion } = route.params;
  // Estados y Contexto
  const { finance, setFinance, resetFinance } = useContext(FinanceContext);
  const [focus, setFocus] = useState("General");
  const [disabled, setDisabled] = useState(true);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [pickerVisible2, setPickerVisible2] = useState(false);
  const [pickerVisible3, setPickerVisible3] = useState(false);
  const [countryCode, setCountryCode] = useState("MX");
  const [countryCode2, setCountryCode2] = useState("MX");
  const [countryCode3, setCountryCode3] = useState("MX");
  const [callingCode, setCallingCode] = useState("52");
  const [callingCode2, setCallingCode2] = useState("52");
  const [callingCode3, setCallingCode3] = useState("52");
  const [loading, setLoading] = useState(false);

  const [dataDomicilio] = useState([
    { label: "Propio", value: "own" },
    { label: "Rentado", value: "rented" },
  ]);

  const [dataPolitico] = useState([
    { label: "Si", value: "true" },
    { label: "No", value: "false" },
  ]);

  const sendInfo = async () => {
    setDisabled(true);
    setLoading(true);
    console.log(
      "Agregando la info general al credito..." + finance.domicilio,
      finance.politico,
      removeSpaces(finance.telCasa),
      removeSpaces(finance.telTrabajo),
      removeSpaces(finance.celular),
      finance.descripcion
    );

    // Ahora si se mandan los documentos
    const url = `/api/v1/credits/${idInversion}`;

    try {
      const body = {
        credit: {
          home_situation: finance.domicilio,
          held_political_position: finance.politico,
          home_phone: removeSpaces(finance.telCasa),
          office_phone: removeSpaces(finance.telTrabajo),
          cell_phone: removeSpaces(finance.celular),
          description: finance.descripcion,
        },
      };

      const response = await APIPut(url, body);

      if (response.error) {
        console.error(
          "Error al agregar la información general:",
          response.error
        );
        Alert.alert(
          "Error",
          "No se pudo agregar la información general. Intente nuevamente."
        );
      } else {
        console.log("Informacion general agregada exitosamente:", response);
        navigation.navigate("Documentacion", {
          flujo: flujo,
          idInversion: idInversion,
        });
      }
    } catch (error) {
      console.error("Error en la petición:", error);
      Alert.alert("Error", "Ocurrió un error al procesar la solicitud.");
    } finally {
      setDisabled(false);
      setLoading(false);
    }
  };

  // Funcion para manejar el boton de cancelar
  const handleCancelar = () => {
    Alert.alert(
      `¿Deseas cancelar el ${flujo}`,
      `Si cancelas el ${flujo}, perderás la información ingresada hasta el momento.`,
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
      const url = `/api/v1/credits/${idInversion}/cancel`;
      const data = "";

      const response = await APIPost(url, data);
      if (response.error) {
        // Manejar el error
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
        navigation.navigate("Inicio");
        resetFinance();
      }
    };
  };

  // Efecto para deshabilitar el botón de continuar si no se han llenado todos los campos
  useEffect(() => {
    //const emailValido = isValidEmail(mail);
    //setIsEmailValid(emailValido);

    const camposLlenos =
      finance.domicilio !== "" &&
      finance.politico !== "" &&
      finance.telCasa !== "" &&
      finance.telTrabajo !== "" &&
      finance.celular !== "" &&
      finance.descripcion !== "";
    //emailValido; // Utiliza la variable local para la validación
    setDisabled(!camposLlenos);
  }, [
    finance.domicilio,
    finance.politico,
    finance.telCasa,
    finance.telTrabajo,
    finance.celular,
    finance.descripcion,
  ]);

  // Function to format the phone number as user types
  const formatPhoneNumber = (text, country, setter) => {
    const formatter = new AsYouType(country);
    const formatted = formatter.input(text);
    if (setter === "Casa") {
      setFinance({ ...finance, telCasa: formatted });
    } else if (setter === "Trabajo") {
      setFinance({ ...finance, telTrabajo: formatted });
    } else if (setter === "Celular") {
      setFinance({ ...finance, celular: formatted });
    }
  };

  const removeSpaces = (inputString) => {
    return inputString.replace(/ /g, "");
  };

  // Function to validate email
  /*const isValidEmail = (email) => {
    const regex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(String(email).toLowerCase());
  };*/

  // Componente Visual
  return (
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

      {/*focus === "Documentacion" && (
          <>
            <View style={styles.seccion}>
              <Text style={styles.tituloSeccion}>Documentación</Text>
              <Text style={styles.bodySeccion}>
                Para agilizar el proceso te recomendamos tener los siguientes
                documentos a la mano.
              </Text>
            </View>
            <View
              style={{
                marginTop: 5,
                backgroundColor: "white",
                paddingBottom: 15,
                flex: 1,
              }}
            >
              <View style={{ flex: 1 }}>
                <BulletPointText
                  titulo="INE"
                  body="Identificación oficial actualizada"
                />
                <BulletPointText titulo="CURP" body="Documento actualizado" />
                <BulletPointText
                  titulo="Constancia de situación fiscal"
                  body="Identificación oficial actualizada"
                />
                <BulletPointText
                  titulo="Comprobante de Domicilio"
                  body="Documento actualizado"
                />
                <BulletPointText
                  titulo="Carátula de estado de cuenta bancaria"
                  body="Documento actualizado"
                />
              </View>
              <TouchableOpacity
                style={styles.botonContinuar}
                onPress={() => setFocus("General")}
              >
                <Text style={styles.textoBotonContinuar}>Continuar</Text>
              </TouchableOpacity>
            </View>
          </>
            )*/}

      {focus === "General" && (
        <>
          <KeyboardAwareScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            scrollEnabled={true}
            enableOnAndroid={true}
            style={styles.scrollV}
            keyboardShouldPersistTaps="handled"
            enableAutomaticScroll={true}
          >
            <View style={styles.seccion}>
              <Text style={styles.tituloSeccion}>Información General</Text>
              <Text style={styles.bodySeccion}>
                Ingresa los datos solicitados para continuar.
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <View
                style={{
                  marginTop: 5,
                  backgroundColor: "white",
                  paddingTop: 15,
                }}
              >
                {/* Campos para introducir de la información general */}

                <Text style={[styles.tituloCampo, { marginTop: 0 }]}>
                  ¿Ha desempeñado algún cargo político?
                </Text>
                <View style={{ paddingHorizontal: 20 }}>
                  <RadioForm
                    radio_props={dataPolitico}
                    initial={
                      finance.politico === "Si"
                        ? 0
                        : finance.politico === "No"
                        ? 1
                        : -1
                    }
                    onPress={(value) =>
                      setFinance({ ...finance, politico: value })
                    }
                    buttonColor={"#060B4D"}
                    buttonSize={10}
                    selectedButtonColor={"#060B4D"}
                    labelStyle={{
                      fontSize: 16,
                      color: "#060B4D",
                      fontFamily: "opensanssemibold",
                      marginBottom: 5,
                    }}
                    animation={false}
                  />
                </View>
                <View style={styles.separacion} />

                <Text style={styles.tituloCampo}>Tipo de Domicilio</Text>
                <View style={{ paddingHorizontal: 20 }}>
                  <RadioForm
                    radio_props={dataDomicilio}
                    initial={
                      finance.domicilio === "Propio"
                        ? 0
                        : finance.domicilio === "Rentado"
                        ? 1
                        : -1
                    }
                    onPress={(value) =>
                      setFinance({ ...finance, domicilio: value })
                    }
                    buttonColor={"#060B4D"}
                    buttonSize={10}
                    selectedButtonColor={"#060B4D"}
                    labelStyle={{
                      fontSize: 16,
                      color: "#060B4D",
                      fontFamily: "opensanssemibold",
                      marginBottom: 5,
                    }}
                    animation={false}
                  />
                </View>
                <View style={styles.separacion} />

                <Text style={styles.tituloCampo}>Teléfono Casa</Text>
                <View style={styles.vistaTelefonos}>
                  <TouchableOpacity onPress={() => setPickerVisible3(true)}>
                    <Entypo
                      name="chevron-thin-down"
                      size={15}
                      color="#060B4D"
                      style={{ marginRight: 5 }}
                    />
                  </TouchableOpacity>
                  <CountryPicker
                    withFilter
                    countryCode={countryCode3}
                    withCallingCode
                    withCloseButton
                    onSelect={(country) => {
                      const { cca2, callingCode } = country;
                      setCountryCode3(cca2);
                      setCallingCode3(callingCode[0]);
                      setFinance({ ...finance, telCasa: "", telCasaShow: "" });
                    }}
                    visible={pickerVisible3}
                    onClose={() => setPickerVisible3(false)}
                  />
                  <Text style={styles.countryCodeText}>
                    +{callingCode3} {" |"}
                  </Text>
                  <TextInput
                    style={[styles.input, { paddingLeft: 0, marginBottom: 0 }]}
                    onChangeText={(text) =>
                      formatPhoneNumber(text, countryCode3, "Casa")
                    }
                    value={finance.telCasa}
                    keyboardType="phone-pad"
                    placeholder="10 dígitos"
                    maxLength={12}
                  />
                </View>
                <View style={styles.separacion} />

                <Text style={styles.tituloCampo}>Teléfono Trabajo</Text>
                <View style={styles.vistaTelefonos}>
                  <TouchableOpacity onPress={() => setPickerVisible2(true)}>
                    <Entypo
                      name="chevron-thin-down"
                      size={15}
                      color="#060B4D"
                      style={{ marginRight: 5 }}
                    />
                  </TouchableOpacity>
                  <CountryPicker
                    withFilter
                    countryCode={countryCode2}
                    withCallingCode
                    withCloseButton
                    onSelect={(country) => {
                      const { cca2, callingCode } = country;
                      setCountryCode2(cca2);
                      setCallingCode2(callingCode[0]);
                      setFinance({
                        ...finance,
                        telTrabajo: "",
                        telTrabajoShow: "",
                      });
                    }}
                    visible={pickerVisible2}
                    onClose={() => setPickerVisible2(false)}
                  />
                  <Text style={styles.countryCodeText}>
                    +{callingCode2} {" |"}
                  </Text>
                  <TextInput
                    style={[styles.input, { paddingLeft: 0, marginBottom: 0 }]}
                    onChangeText={(text) =>
                      formatPhoneNumber(text, countryCode2, "Trabajo")
                    }
                    value={finance.telTrabajo}
                    keyboardType="phone-pad"
                    placeholder="10 dígitos"
                    maxLength={12}
                  />
                </View>
                <View style={styles.separacion} />

                <Text style={styles.tituloCampo}>Celular</Text>
                <View style={styles.vistaTelefonos}>
                  <TouchableOpacity onPress={() => setPickerVisible(true)}>
                    <Entypo
                      name="chevron-thin-down"
                      size={15}
                      color="#060B4D"
                      style={{ marginRight: 5 }}
                    />
                  </TouchableOpacity>
                  <CountryPicker
                    withFilter
                    countryCode={countryCode}
                    withCallingCode
                    withCloseButton
                    onSelect={(country) => {
                      const { cca2, callingCode } = country;
                      setCountryCode(cca2);
                      setCallingCode(callingCode[0]);
                      setFinance({ ...finance, celular: "", celularShow: "" });
                    }}
                    visible={pickerVisible}
                    onClose={() => setPickerVisible(false)}
                  />
                  <Text style={styles.countryCodeText}>
                    +{callingCode} {" |"}
                  </Text>
                  <TextInput
                    style={[styles.input, { paddingLeft: 0, marginBottom: 0 }]}
                    onChangeText={(text) =>
                      formatPhoneNumber(text, countryCode, "Celular")
                    }
                    value={finance.celular}
                    keyboardType="phone-pad"
                    placeholder="10 dígitos"
                    maxLength={12}
                  />
                </View>
                <View style={styles.separacion} />

                <View style={styles.separacion} />
                <View
                  style={[
                    styles.separacion,
                    { backgroundColor: "#f2f2f2ff", height: 5 },
                  ]}
                />
                <View style={{ paddingHorizontal: 15, paddingVertical: 10 }}>
                  <TextInput
                    style={styles.inputDescription}
                    onChangeText={(value) =>
                      setFinance({ ...finance, descripcion: value })
                    }
                    value={finance.descripcion}
                    placeholder="Breve descripción de las necesidades del crédito"
                    multiline={true}
                    maxLength={300}
                  />
                </View>
              </View>
            </View>
            {/* Boton de Continuar */}
            <View style={{ zIndex: -1 }}>
              <TouchableOpacity
                style={[
                  styles.botonContinuar,
                  { backgroundColor: disabled ? "#E1E1E1" : "#060B4D" },
                ]}
                onPress={() => sendInfo()}
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
                <Text
                  style={[styles.textoBotonContinuar, { color: "#F95C5C" }]}
                >
                  Cancelar {flujo}
                </Text>
              </TouchableOpacity>
            </View>
          </KeyboardAwareScrollView>
        </>
      )}
      {loading && (
        <View style={styles.overlay}>
          <ActivityIndicator size={75} color="#060B4D" />
        </View>
      )}
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
    marginRight: 65,
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
    fontSize: 16,
    width: "100%",
    color: "#060B4D",
    fontFamily: "opensanssemibold",
    paddingLeft: 15,
    marginBottom: 10,
  },
  inputDescription: {
    borderRadius: 10,
    borderColor: "#afb0c4ff",
    borderWidth: 1,
    backgroundColor: "#F7F7F7",
    fontSize: 16,
    height: 120,
    width: "100%",
    color: "#060B4D",
    fontFamily: "opensanssemibold",
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  countryCodeText: {
    fontSize: 17,
    color: "grey",
    fontFamily: "opensanssemibold",
    marginRight: 10,
  },
  vistaTelefonos: {
    flexDirection: "row",
    paddingHorizontal: 15,
    alignItems: "center",
    marginTop: -5,
    marginBottom: 5,
  },
  DropDownPicker: {
    borderColor: "transparent",
    marginTop: -10,
    paddingLeft: 15,
    paddingRight: 20,
    borderRadius: 0,
    alignSelf: "center",
  },
  DropDownText: {
    fontSize: 17,
    fontFamily: "opensanssemibold",
    color: "#060B4D",
    alignSelf: "center",
  },
  DropDownContainer: {
    marginTop: -10,
    paddingHorizontal: 5,
    width: "100%",
    alignSelf: "center",
    borderRadius: 10,
    borderColor: "#060B4D",
  },
  separacion: {
    height: 1,
    width: "100%",
    backgroundColor: "#cecfdbff",
  },
  botonContinuar: {
    backgroundColor: "#060B4D",
    marginTop: 15,
    width: "80%",
    alignSelf: "center",
    borderRadius: 5,
  },
  textoBotonContinuar: {
    alignSelf: "center",
    color: "white",
    padding: 10,
    fontFamily: "opensanssemibold",
    fontSize: 16,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default InfoGeneral;
