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
} from "react-native";
import React, { useState, useCallback, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import CountryPicker from "react-native-country-picker-modal";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import MaskedView from "@react-native-masked-view/masked-view";
// Importaciones de Componentes y Hooks
import BulletPointText from "../../components/BulletPointText";
import { Feather, AntDesign } from "@expo/vector-icons";

// Se mide la pantalla para determinar medidas
const screenWidth = Dimensions.get("window").width;
const widthHalf = screenWidth / 2;

const Inversion2 = ({ navigation }) => {
  // Estados y Contexto
  const [focus, setFocus] = useState("Documentacion");
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [parentesco, setParentesco] = useState("");
  const [telefono, setTelefono] = useState("");
  const [porcentaje, setPorcentaje] = useState("");
  const [segundoBeneficiaro, setSegundoBeneficiaro] = useState(false);
  const [nombre2, setNombre2] = useState("");
  const [apellidos2, setApellidos2] = useState("");
  const [parentesco2, setParentesco2] = useState("");
  const [telefono2, setTelefono2] = useState("");
  const [porcentaje2, setPorcentaje2] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [countryCode, setCountryCode] = useState("MX");
  const [callingCode, setCallingCode] = useState("52");
  const [countryCode2, setCountryCode2] = useState("MX");
  const [callingCode2, setCallingCode2] = useState("52");

  // Función para manejar la cancelación del segundo beneficiario
  const handleCancelBeneficiario = () => {
    setSegundoBeneficiaro(false);
    setNombre2("");
    setApellidos2("");
    setParentesco2("");
    setTelefono2("");
    setPorcentaje2("");
  };

  // Efecto para deshabilitar el botón de continuar si no se han llenado todos los campos
  useEffect(() => {
    const camposLlenos =
      nombre !== "" &&
      apellidos !== "" &&
      parentesco !== "" &&
      telefono !== "" &&
      porcentaje !== "";

    const camposSegundoBeneficiarioLlenos =
      nombre2 !== "" &&
      apellidos2 !== "" &&
      parentesco2 !== "" &&
      telefono2 !== "" &&
      porcentaje2 !== "";

    const todosCamposLlenos = segundoBeneficiaro
      ? camposLlenos && camposSegundoBeneficiarioLlenos
      : camposLlenos;

    setDisabled(!todosCamposLlenos);
  }, [
    nombre,
    apellidos,
    parentesco,
    telefono,
    porcentaje,
    nombre2,
    apellidos2,
    parentesco2,
    telefono2,
    porcentaje2,
    segundoBeneficiaro,
  ]);

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

        {focus === "Documentacion" && (
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
                  titulo="No. de Cuenta Bancaria"
                  body="Cuenta a la cuál se deberá depositar"
                />
                <BulletPointText
                  titulo="Comprobante de No. de Cuenta Bancaria"
                  body="Documento actualizado"
                />
                <BulletPointText titulo="CLABE" body="CLABE Interbancaria" />
                <BulletPointText titulo="Banco" body="Nombre de Banco" />
              </View>
              <TouchableOpacity
                style={styles.botonContinuar}
                onPress={() => setFocus("Beneficiarios")}
              >
                <Text style={styles.textoBotonContinuar}>Continuar</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {focus === "Beneficiarios" && (
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
                <Text style={styles.tituloSeccion}>Beneficiarios</Text>
                <Text style={styles.bodySeccion}>
                  En caso de un imprevisto, es importante asegurarse de que tus
                  bienes financieros se transfieran de manera rápida y eficiente
                  a las personas que más te importan.
                </Text>
              </View>
              <View
                style={{
                  marginTop: 5,
                  backgroundColor: "white",
                  paddingVertical: 15,
                  flex: 1,
                }}
              >
                {/* Campos para introducir los datos del primer beneficiario */}
                <Text
                  style={{
                    fontSize: 20,
                    paddingLeft: 15,
                    color: "#060B4D",
                    fontFamily: "opensanssemibold",
                  }}
                >
                  Primer Beneficiario
                </Text>
                <Text style={styles.tituloCampo}>Nombre(s)</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={setNombre}
                  value={nombre}
                />
                <View style={styles.separacion} />

                <Text style={styles.tituloCampo}>Apellidos</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={setApellidos}
                  value={apellidos}
                />
                <View style={styles.separacion} />

                <Text style={styles.tituloCampo}>Parentesco</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={setParentesco}
                  value={parentesco}
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
                    <AntDesign
                      name="caretdown"
                      size={20}
                      color="grey"
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
                    }}
                    visible={pickerVisible}
                    onClose={() => setPickerVisible(false)}
                  />
                  <Text style={styles.countryCodeText}>
                    +{callingCode} {" |"}
                  </Text>
                  <TextInput
                    style={[styles.input, { paddingLeft: 0, marginBottom: 0 }]}
                    onChangeText={setTelefono}
                    value={telefono}
                    keyboardType="numeric"
                    maxLength={10}
                  />
                </View>
                <View style={styles.separacion} />

                <Text style={styles.tituloCampo}>Porcentaje</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={setPorcentaje}
                  value={porcentaje}
                  keyboardType="numeric"
                />
                <View style={styles.separacion} />

                {/* Opcion de introducir un Segundo Beneficiario */}
                {segundoBeneficiaro === true && (
                  <View style={{ marginTop: 20 }}>
                    <Text
                      style={{
                        fontSize: 20,
                        paddingLeft: 15,
                        color: "#060B4D",
                        fontFamily: "opensanssemibold",
                      }}
                    >
                      Segundo Beneficiario
                    </Text>
                    <Text style={styles.tituloCampo}>Nombre(s)</Text>
                    <TextInput
                      style={styles.input}
                      onChangeText={setNombre2}
                      value={nombre2}
                    />
                    <View style={styles.separacion} />

                    <Text style={styles.tituloCampo}>Apellidos</Text>
                    <TextInput
                      style={styles.input}
                      onChangeText={setApellidos2}
                      value={apellidos2}
                    />
                    <View style={styles.separacion} />

                    <Text style={styles.tituloCampo}>Parentesco</Text>
                    <TextInput
                      style={styles.input}
                      onChangeText={setParentesco2}
                      value={parentesco2}
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
                        <AntDesign
                          name="caretdown"
                          size={20}
                          color="grey"
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
                        }}
                        visible={pickerVisible}
                        onClose={() => setPickerVisible(false)}
                      />
                      <Text style={styles.countryCodeText}>
                        +{callingCode2} {" |"}
                      </Text>
                      <TextInput
                        style={[
                          styles.input,
                          { paddingLeft: 0, marginBottom: 0 },
                        ]}
                        onChangeText={setTelefono2}
                        value={telefono2}
                        keyboardType="numeric"
                        maxLength={10}
                      />
                    </View>
                    <View style={styles.separacion} />

                    <Text style={styles.tituloCampo}>Porcentaje</Text>
                    <TextInput
                      style={styles.input}
                      onChangeText={setPorcentaje2}
                      value={porcentaje2}
                      keyboardType="numeric"
                    />
                    <View style={styles.separacion} />
                  </View>
                )}

                {/* Botones de Continuar y Agregar o Eliminar Beneficiario */}
                <TouchableOpacity
                  style={[
                    styles.botonContinuar,
                    { backgroundColor: "#F5F5F5" },
                  ]}
                  onPress={() =>
                    segundoBeneficiaro
                      ? handleCancelBeneficiario()
                      : setSegundoBeneficiaro(true)
                  }
                >
                  <Text
                    style={[styles.textoBotonContinuar, { color: "#060B4D" }]}
                  >
                    {segundoBeneficiaro
                      ? "Eliminar Beneficiario"
                      : "Agregar Beneficiario"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.botonContinuar,
                    { backgroundColor: disabled ? "#D5D5D5" : "#060B4D" },
                  ]}
                  onPress={() => navigation.navigate("Inversion3")}
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
    textAlign: "justify",
  },
  tituloCampo: {
    marginTop: 10,
    paddingLeft: 15,
    marginBottom: 10,
    fontSize: 17,
    color: "#9c9db8ff",
    fontFamily: "opensanssemibold",
  },
  input: {
    fontSize: 17,
    width: "100%",
    color: "#060B4D",
    fontFamily: "opensanssemibold",
    paddingLeft: 15,
    marginBottom: 10,
  },
  countryCodeText: {
    fontSize: 17,
    color: "grey",
    fontFamily: "opensanssemibold",
    marginRight: 10,
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

export default Inversion2;
