// Importaciones de React Native y React
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import DropDownPicker from "react-native-dropdown-picker";
import CountryPicker from "react-native-country-picker-modal";
import MaskedView from "@react-native-masked-view/masked-view";
import { AsYouType } from "libphonenumber-js";
// Importaciones de Componentes y Hooks
import { Feather, Entypo, AntDesign } from "@expo/vector-icons";

// Se mide la pantalla para determinar medidas
const screenWidth = Dimensions.get("window").width;
const widthHalf = screenWidth / 2;

const Inversion5 = ({ navigation }) => {
  // Estados y Contexto
  const [focus, setFocus] = useState("Documentacion");
  const [nombre, setNombre] = useState("");
  const [calle, setCalle] = useState("");
  const [numeroExterior, setNumeroExterior] = useState("");
  const [numeroInterior, setNumeroInterior] = useState("");
  const [codigoPostal, setCodigoPostal] = useState("");
  const [pais, setPais] = useState("México");
  const [estado, setEstado] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [municipio, setMunicipio] = useState("");
  const [colonia, setColonia] = useState("");
  const [domicilio, setDomicilio] = useState("");
  const [politico, setPolitico] = useState("");
  const [profesion, setProfesion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [mail, setMail] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [countryCode, setCountryCode] = useState("MX");
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);

  const [dataDomicilio] = useState([
    { label: "Real", value: "Real" },
    { label: "Convencional", value: "Convencional" },
    { label: "Legal", value: "Legal" },
    { label: "Fiscal", value: "Fiscal" },
  ]);

  const [dataPolitico] = useState([
    { label: "Si", value: "Si" },
    { label: "No", value: "No" },
  ]);

  // Efecto para deshabilitar el botón de continuar si no se han llenado todos los campos
  useEffect(() => {
    setIsEmailValid(isValidEmail(mail));
    const camposLlenos =
      domicilio !== "" &&
      politico !== "" &&
      profesion !== "" &&
      telefono !== "" &&
      mail !== "" &&
      descripcion !== "" &&
      isEmailValid;

    setDisabled(!camposLlenos);
  }, [
    domicilio,
    politico,
    profesion,
    telefono,
    mail,
    descripcion,
    isEmailValid,
  ]);

  // Function to format the phone number as user types
  const formatPhoneNumber = (text, setFunction, country) => {
    const formatter = new AsYouType(country);
    const formatted = formatter.input(text);
    setFunction(formatted);
  };

  const isValidEmail = (email) => {
    const regex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(String(email).toLowerCase());
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
          <Text style={styles.tituloPantalla}>Inversión</Text>
          <TouchableOpacity>
            <Feather
              name="bell"
              size={25}
              color="#060B4D"
              style={{ marginTop: 50 }}
            />
          </TouchableOpacity>
        </View>

        <KeyboardAwareScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          scrollEnabled={true}
          enableOnAndroid={true}
          style={styles.scrollV}
          keyboardShouldPersistTaps="handled"
          enableAutomaticScroll={true}
        >
          <View style={styles.seccion}>
            <Text style={styles.tituloSeccion}>Firma de Contrato</Text>
            <Text style={styles.bodySeccion}>Enviar a Domicilio</Text>
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
                Nombre Completo{" "}
              </Text>
              <TextInput
                style={styles.input}
                onChangeText={setProfesion}
                value={profesion}
                placeholder="Eje. Raúl Guizar Torres"
              />
              <View style={styles.separacion} />

              <Text style={styles.tituloCampo}>Nombre de la Calle</Text>
              <TextInput
                style={styles.input}
                onChangeText={setProfesion}
                value={profesion}
                placeholder="Eje. Acueducto de las Fuentes"
              />
              <View style={styles.separacion} />

              <Text style={styles.tituloCampo}>Número Exterior</Text>
              <TextInput
                style={styles.input}
                onChangeText={setProfesion}
                value={profesion}
                placeholder="Eje. 22"
              />
              <View style={styles.separacion} />

              <Text style={styles.tituloCampo}>Número Interior</Text>
              <TextInput
                style={styles.input}
                onChangeText={setProfesion}
                value={profesion}
                placeholder="Eje. 4B"
              />
              <View style={styles.separacion} />

              <Text style={styles.tituloCampo}>Código Postal</Text>
              <TextInput
                style={styles.input}
                onChangeText={setProfesion}
                value={profesion}
                placeholder="Eje. 53290"
              />
              <View style={styles.separacion} />

              <Text style={styles.tituloCampo}>Teléfono</Text>
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
                  withCloseButton
                  onSelect={(country) => {
                    const { cca2 } = country;
                    setPais(cca2);
                  }}
                  visible={pickerVisible}
                  onClose={() => setPickerVisible(false)}
                />
                <Text style={styles.countryCodeText}>{pais}</Text>
              </View>
              <View style={styles.separacion} />

              <Text style={styles.tituloCampo}>Tipo de Domicilio</Text>
              <DropDownPicker
                open={open}
                value={domicilio}
                items={dataDomicilio}
                placeholder="Selecciona una opción"
                setOpen={setOpen}
                setValue={setDomicilio}
                onChangeValue={(value) => setDomicilio(value)}
                style={styles.DropDownPicker}
                arrowIconStyle={{ tintColor: "#060B4D", width: 25 }}
                placeholderStyle={{
                  color: "#c7c7c9ff",
                  fontFamily: "opensanssemibold",
                }}
                dropDownContainerStyle={styles.DropDownContainer}
                textStyle={styles.DropDownText}
              />
              <View style={styles.separacion} />

              <Text style={styles.tituloCampo}>
                ¿Ha desempeñado algún cargo político?
              </Text>
              <View style={{ zIndex: open ? -1 : 1 }}>
                <DropDownPicker
                  open={open2}
                  value={politico}
                  items={dataPolitico}
                  placeholder="Selecciona una opción"
                  setOpen={setOpen2}
                  setValue={setPolitico}
                  onChangeValue={(value) => setPolitico(value)}
                  style={styles.DropDownPicker}
                  arrowIconStyle={{ tintColor: "#060B4D", width: 25 }}
                  placeholderStyle={{
                    color: "#c7c7c9ff",
                    fontFamily: "opensanssemibold",
                  }}
                  dropDownContainerStyle={[
                    styles.DropDownContainer,
                    { marginTop: -9 },
                  ]}
                  textStyle={styles.DropDownText}
                />
              </View>
              <View style={styles.separacion} />
            </View>
          </View>
          {/* Botones de Continuar y Agregar o Eliminar Beneficiario */}
          <View style={{ marginBottom: 20, zIndex: -1 }}>
            <TouchableOpacity
              style={[
                styles.botonContinuar,
                { backgroundColor: disabled ? "#E1E1E1" : "#060B4D" },
              ]}
              onPress={() => navigation.navigate("Credito3")}
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
    marginBottom: 10,
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

export default Inversion5;
