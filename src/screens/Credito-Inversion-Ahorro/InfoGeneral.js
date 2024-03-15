// Importaciones de React Native y React
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useState, useCallback, useEffect, useContext } from "react";
import { LinearGradient } from "expo-linear-gradient";
import CountryPicker from "react-native-country-picker-modal";
import DropDownPicker from "react-native-dropdown-picker";
import MaskedView from "@react-native-masked-view/masked-view";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { AsYouType } from "libphonenumber-js";
import { useRoute } from "@react-navigation/native";
import RadioForm from "react-native-simple-radio-button";
// Importaciones de Componentes y Hooks
import { CreditContext } from "../../hooks/CreditContext";
import { Feather, Entypo, AntDesign } from "@expo/vector-icons";

// Se mide la pantalla para determinar medidas
const screenWidth = Dimensions.get("window").width;
const widthHalf = screenWidth / 2;

const InfoGeneral = ({ navigation }) => {
  const route = useRoute();
  const { flujo } = route.params;
  // Estados y Contexto
  const { credit, setCredit } = useContext(CreditContext);
  const [focus, setFocus] = useState("General");
  const [disabled, setDisabled] = useState(true);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [countryCode, setCountryCode] = useState("MX");
  const [callingCode, setCallingCode] = useState("52");

  const [dataDomicilio] = useState([
    { label: "Propio", value: "Propio" },
    { label: "Rentado", value: "Rentado" },
  ]);

  const [dataPolitico] = useState([
    { label: "Si", value: "Si" },
    { label: "No", value: "No" },
  ]);

  // Efecto para deshabilitar el botón de continuar si no se han llenado todos los campos
  useEffect(() => {
    //const emailValido = isValidEmail(mail);
    //setIsEmailValid(emailValido);

    const camposLlenos =
      credit.domicilio !== "" &&
      credit.politico !== "" &&
      credit.telCasa !== "" &&
      credit.telTrabajo !== "" &&
      credit.celular !== "" &&
      credit.cuenta_bancaria !== "" &&
      credit.cuenta_bancaria.length === 16 &&
      credit.descripcion !== "";
    //emailValido; // Utiliza la variable local para la validación
    setDisabled(!camposLlenos);
  }, [
    credit.domicilio,
    credit.politico,
    credit.telCasa,
    credit.telTrabajo,
    credit.celular,
    credit.cuenta_bancaria,
    credit.descripcion,
  ]);

  // Function to format the phone number as user types
  const formatPhoneNumber = (text, country) => {
    const formatter = new AsYouType(country);
    const formatted = formatter.input(text);
    setCredit({ ...credit, celular: text, celularShow: formatted });
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
                      credit.politico === "Si"
                        ? 0
                        : credit.politico === "No"
                        ? 1
                        : -1
                    }
                    onPress={(value) =>
                      setCredit({ ...credit, politico: value })
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
                      credit.domicilio === "Propio"
                        ? 0
                        : credit.domicilio === "Rentado"
                        ? 1
                        : -1
                    }
                    onPress={(value) =>
                      setCredit({ ...credit, domicilio: value })
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
                <TextInput
                  style={styles.input}
                  onChangeText={(value) =>
                    setCredit({ ...credit, telCasa: value })
                  }
                  value={credit.telCasa}
                  keyboardType="phone-pad"
                  placeholder="10 dígitos"
                />
                <View style={styles.separacion} />

                <Text style={styles.tituloCampo}>Teléfono Trabajo</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={(value) =>
                    setCredit({ ...credit, telTrabajo: value })
                  }
                  value={credit.telTrabajo}
                  keyboardType="phone-pad"
                  placeholder="10 dígitos"
                />
                <View style={styles.separacion} />

                <Text style={styles.tituloCampo}>Celular</Text>
                <View
                  style={{
                    flexDirection: "row",
                    paddingHorizontal: 15,
                    alignItems: "center",
                    marginTop: -5,
                    marginBottom: 5,
                  }}
                >
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
                      setCredit({ ...credit, celular: "", celularShow: "" });
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
                      formatPhoneNumber(text, countryCode)
                    }
                    value={credit.celularShow}
                    keyboardType="phone-pad"
                    placeholder="10 dígitos"
                  />
                </View>
                <View style={styles.separacion} />

                <Text style={styles.tituloCampo}>
                  Cuenta bancaria a depositar fondos
                </Text>
                <TextInput
                  style={styles.input}
                  onChangeText={(value) =>
                    setCredit({ ...credit, cuenta_bancaria: value })
                  }
                  value={credit.cuenta_bancaria}
                  placeholder="16 dígitos"
                  maxLength={16}
                  keyboardType="numeric"
                />
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
                      setCredit({ ...credit, descripcion: value })
                    }
                    value={credit.descripcion}
                    placeholder="Breve descripción de las necesidades del crédito"
                    multiline={true}
                    maxLength={300}
                  />
                </View>
              </View>
            </View>
            {/* Boton de Continuar */}
            <View style={{ marginBottom: 20, zIndex: -1 }}>
              <TouchableOpacity
                style={[
                  styles.botonContinuar,
                  { backgroundColor: disabled ? "#E1E1E1" : "#060B4D" },
                ]}
                onPress={() => [
                  setCredit({
                    ...credit,
                    paso: credit.paso + 1,
                  }),
                  navigation.navigate("DefinirCredito", { flujo: flujo }),
                  console.log(credit),
                ]}
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
          </KeyboardAwareScrollView>
        </>
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
});

export default InfoGeneral;
