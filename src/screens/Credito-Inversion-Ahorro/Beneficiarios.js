// Importaciones de React Native y React
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import React, { useState, useCallback, useEffect, useContext } from "react";
import { LinearGradient } from "expo-linear-gradient";
import CountryPicker from "react-native-country-picker-modal";
import DropDownPicker from "react-native-dropdown-picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import MaskedView from "@react-native-masked-view/masked-view";
import { AsYouType } from "libphonenumber-js";
import { useRoute } from "@react-navigation/native";
// Importaciones de Componentes y Hooks
import { InvBoxContext } from "../../hooks/InvBoxContext";
import { APIPut, APIPost } from "../../API/APIService";
import BulletPointText from "../../components/BulletPointText";
import { Feather, Entypo, AntDesign } from "@expo/vector-icons";
import { set } from "date-fns";

// Se mide la pantalla para determinar medidas
const screenWidth = Dimensions.get("window").width;
const widthHalf = screenWidth / 2;

const Beneficiarios = ({ navigation }) => {
  const route = useRoute();
  const { flujo, idInversion } = route.params;
  // Estados y Contexto
  const { invBox, setInvBox } = useContext(InvBoxContext);
  const [focus, setFocus] = useState("Beneficiarios");
  const [segundoBeneficiaro, setSegundoBeneficiaro] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  //const [telefono, setTelefono] = useState("");
  //const [telefono2, setTelefono2] = useState("");
  /*const [pickerVisible, setPickerVisible] = useState(false);
  const [pickerVisible2, setPickerVisible2] = useState(false);
  const [countryCode, setCountryCode] = useState("MX");
  const [callingCode, setCallingCode] = useState("52");
  const [countryCode2, setCountryCode2] = useState("MX");
  const [callingCode2, setCallingCode2] = useState("52");*/

  const [dataParentesco] = useState([
    { label: "Madre", value: "mother_primary" },
    { label: "Padre", value: "father_primary" },
    { label: "Hijo/a", value: "son_daughter_primary" },
    { label: "Hermano/a", value: "brother_sister_primary" },
    { label: "Cónyuge", value: "spouse_primary" },
    { label: "Tío/a", value: "uncle_aunt_primary" },
    { label: "Primo/a", value: "cousin_primary" },
    { label: "Abuelo/a", value: "grandfather_grandmother_primary" },
    { label: "Otro", value: "other_primary" },
  ]);

  const [dataParentesco2] = useState([
    { label: "Madre", value: "mother_secondary" },
    { label: "Padre", value: "father_secondary" },
    { label: "Hijo/a", value: "son_daughter_secondary" },
    { label: "Hermano/a", value: "brother_sister_secondary" },
    { label: "Cónyuge", value: "spouse_secondary" },
    { label: "Tío/a", value: "uncle_aunt_secondary" },
    { label: "Primo/a", value: "cousin_secondary" },
    { label: "Abuelo/a", value: "grandfather_grandmother_secondary" },
    { label: "Otro", value: "other_secondary" },
  ]);

  const handlePress = async () => {
    setDisabled(true);
    console.log("Agregando beneficiarios a la inversión...");
    const url = `/api/v1/${
      flujo === "Inversión" ? "investments" : "box_savings"
    }/${idInversion}`;

    const key = flujo === "Inversión" ? "investment" : "box_saving";
    const data = {
      [key]: {
        primary_beneficiary_first_name: invBox.nombre,
        primary_beneficiary_percentage: parseInt(invBox.porcentaje, 10),
        primary_beneficiary_kinship: invBox.parentesco,
        primary_beneficiary_last_name: invBox.apellidos,
        secondary_beneficiary_first_name: invBox.nombre2,
        secondary_beneficiary_percentage: parseInt(invBox.porcentaje2, 10),
        secondary_beneficiary_kinship: invBox.parentesco2,
        secondary_beneficiary_last_name: invBox.apellidos2,
      },
    };
    try {
      const response = await APIPut(url, data);
      if (response.error) {
        console.error(
          "Error al agregar los beneficiarios a la inversión o caja de ahorro:",
          response.error
        );
        Alert.alert(
          "Error",
          `No se pudieron agregar los beneficiarios a la ${
            flujo === "Inversión" ? "Inversión" : "Caja de Ahorro"
          }. Intente nuevamente.`
        );
        setDisabled(false);
      } else {
        console.log("Beneficiarios agregados exitosamente:", response);
        navigation.navigate("Documentacion", {
          flujo: flujo,
          idInversion: idInversion,
        });
        setDisabled(false);
      }
    } catch (error) {
      console.error("Error en la petición:", error);
      Alert.alert("Error", "Ocurrió un error al procesar la solicitud.");
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
          text: `Cancelar ${flujo}`,
          onPress: () => [cancelar()],
          style: "cancel",
        },
        {
          text: `Continuar ${flujo}`,
        },
      ],
      { cancelable: true }
    );

    const cancelar = async () => {
      const url = `/api/v1/${
        flujo === "Inversión" ? "investments" : "box_savings"
      }/${idInversion}/cancel`;
      const data = "";

      const response = await APIPost(url, data);
      if (response.error) {
        // Manejar el error
        console.error(
          "Error al eliminar la caja de ahorro o inversion:",
          response.error
        );
        Alert.alert(
          "Error",
          `No se pudo eliminar la ${flujo}. Intente nuevamente.`
        );
      } else {
        console.log(
          "Caja de ahorro o Inversión eliminada exitosamente:",
          response
        );
        navigation.navigate("Inicio");
      }
    };
  };

  // Función para manejar la cancelación del segundo beneficiario
  const handleCancelBeneficiario = () => {
    setInvBox({
      ...invBox,
      porcentaje: "100",
      nombre2: "",
      apellidos2: "",
      parentesco2: "",
      porcentaje2: "",
    });
    setSegundoBeneficiaro(false);
    //setTelefono2("");
    //setCallingCode2("52");
    //setCountryCode2("MX");
  };

  // Efecto para deshabilitar el botón de continuar si no se han llenado todos los campos
  useEffect(() => {
    const camposLlenos =
      invBox.nombre !== "" &&
      invBox.apellidos !== "" &&
      invBox.parentesco !== "" &&
      //telefono !== "" &&
      invBox.porcentaje !== "";

    const camposSegundoBeneficiarioLlenos =
      invBox.nombre2 !== "" &&
      invBox.apellidos2 !== "" &&
      invBox.parentesco2 !== "" &&
      //telefono2 !== "" &&
      invBox.porcentaje2 !== "";

    const todosCamposLlenos = segundoBeneficiaro
      ? camposLlenos && camposSegundoBeneficiarioLlenos
      : camposLlenos;

    setDisabled(!todosCamposLlenos);
  }, [
    invBox.nombre,
    invBox.apellidos,
    invBox.parentesco,
    //telefono,
    invBox.porcentaje,
    invBox.nombre2,
    invBox.apellidos2,
    invBox.parentesco2,
    //telefono2,
    invBox.porcentaje2,
    segundoBeneficiaro,
  ]);

  // Función para manejar el cambio en el porcentaje
  const handlePorcentajeChange = (value) => {
    let numericValue = parseInt(value.replace(/[^0-9]/g, ""), 10) || 0;
    numericValue = Math.min(Math.max(numericValue, 1), 100); // Ensure value is between 1 and 100
    setInvBox((prevState) => {
      const otherValue = calculateOtherPercentage(numericValue);
      return {
        ...prevState,
        porcentaje: numericValue.toString(),
        porcentaje2: otherValue.toString(),
      };
    });
  };

  // Función para manejar el cambio en el porcentaje del segundo beneficiario
  const handlePorcentaje2Change = (value) => {
    let numericValue = parseInt(value.replace(/[^0-9]/g, ""), 10) || 0;
    numericValue = Math.min(Math.max(numericValue, 1), 100); // Ensure value is between 1 and 100
    setInvBox((prevState) => {
      const otherValue = calculateOtherPercentage(numericValue);
      return {
        ...prevState,
        porcentaje2: numericValue.toString(),
        porcentaje: otherValue.toString(),
      };
    });
  };

  // Función para calcular el porcentaje restante
  const calculateOtherPercentage = (currentPercentage) => {
    return 100 - currentPercentage;
  };

  // Function to format the phone number as user types
  const formatPhoneNumber = (text, setFunction, country) => {
    const formatter = new AsYouType(country);
    const formatted = formatter.input(text);
    setFunction(formatted);
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

      {/*{focus === "Documentacion" && (
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
              onPress={() => setFocus("Beneficiarios")}
            >
              <Text style={styles.textoBotonContinuar}>Continuar</Text>
            </TouchableOpacity>
          </View>
        </>
          )}*/}

      {focus === "Beneficiarios" && (
        <>
          <KeyboardAwareScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            scrollEnabled={true}
            enableOnAndroid={true}
            style={styles.scrollV}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            enableAutomaticScroll={true}
          >
            <View style={styles.seccion}>
              <Text style={styles.tituloSeccion}>Beneficiarios</Text>
              <Text style={styles.bodySeccion}>
                En caso de un imprevisto, es importante asegurarse de que tus
                bienes financieros se transfieran de manera rápida y eficiente a
                las personas que más te importan.
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
                {/* Campos para introducir los datos del primer beneficiario */}
                <Text
                  style={{
                    fontSize: 16,
                    paddingLeft: 15,
                    marginBottom: 10,
                    color: "#060B4D",
                    fontFamily: "opensanssemibold",
                  }}
                >
                  Primer Beneficiario
                </Text>
                <View style={styles.separacion} />

                <Text style={styles.tituloCampo}>Nombre(s)</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={(text) =>
                    setInvBox({ ...invBox, nombre: text })
                  }
                  value={invBox.nombre}
                  placeholder="Eje. Humberto Arturo"
                />
                <View style={styles.separacion} />

                <Text style={styles.tituloCampo}>Apellidos</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={(text) =>
                    setInvBox({ ...invBox, apellidos: text })
                  }
                  value={invBox.apellidos}
                  placeholder="Eje. Flores Guillán"
                />
                <View style={styles.separacion} />

                {/*<Text style={styles.tituloCampo}>Teléfono</Text>
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
                      setTelefono("");
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
                      formatPhoneNumber(text, setTelefono, countryCode)
                    }
                    value={telefono}
                    keyboardType="phone-pad"
                    placeholder="10 dígitos"
                  />
                </View>
                  <View style={styles.separacion} />*/}

                <Text style={styles.tituloCampo}>Porcentaje</Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <TextInput
                    style={[styles.input, { flex: 0.08 }]}
                    onChangeText={handlePorcentajeChange}
                    value={invBox.porcentaje}
                    keyboardType="numeric"
                    maxLength={3}
                    editable={segundoBeneficiaro}
                  />
                  <Text
                    style={{
                      fontSize: 17,
                      marginTop: -7.5,
                      color: "#060B4D",
                      fontFamily: "opensanssemibold",
                    }}
                  >
                    %
                  </Text>
                </View>
                <View style={styles.separacion} />

                <Text style={styles.tituloCampo}>Parentesco</Text>
                <DropDownPicker
                  open={open}
                  value={invBox.parentesco}
                  items={dataParentesco}
                  placeholder="Selecciona una opción"
                  listMode="MODAL"
                  modalProps={{
                    animationType: "slide",
                  }}
                  setOpen={setOpen}
                  setValue={(callback) => {
                    setInvBox((prevState) => ({
                      ...prevState,
                      parentesco: callback(prevState.parentesco),
                    }));
                  }}
                  onChangeValue={(choice) =>
                    setInvBox({ ...invBox, parentesco: choice })
                  }
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
                <View
                  style={[
                    styles.separacion,
                    { backgroundColor: "#f2f2f2ff", height: 5 },
                  ]}
                />

                {/* Opcion de introducir un Segundo Beneficiario */}
                {segundoBeneficiaro === true && (
                  <View style={{ marginTop: 15 }}>
                    <Text
                      style={{
                        fontSize: 16,
                        paddingLeft: 15,
                        marginBottom: 10,
                        color: "#060B4D",
                        fontFamily: "opensanssemibold",
                      }}
                    >
                      Segundo Beneficiario
                    </Text>
                    <View style={styles.separacion} />

                    <Text style={styles.tituloCampo}>Nombre(s)</Text>
                    <TextInput
                      style={styles.input}
                      onChangeText={(text) =>
                        setInvBox({ ...invBox, nombre2: text })
                      }
                      value={invBox.nombre2}
                      placeholder="Eje. Humberto Arturo"
                    />
                    <View style={styles.separacion} />

                    <Text style={styles.tituloCampo}>Apellidos</Text>
                    <TextInput
                      style={styles.input}
                      onChangeText={(text) =>
                        setInvBox({ ...invBox, apellidos2: text })
                      }
                      value={invBox.apellidos2}
                      placeholder="Eje. Flores Guillán"
                    />
                    <View style={styles.separacion} />

                    {/*<Text style={styles.tituloCampo}>Teléfono</Text>
                    <View
                      style={{
                        flexDirection: "row",
                        paddingHorizontal: 15,
                        alignItems: "center",
                        marginTop: -5,
                        marginBottom: 5,
                      }}
                    >
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
                          setTelefono2("");
                        }}
                        visible={pickerVisible2}
                        onClose={() => setPickerVisible2(false)}
                      />
                      <Text style={styles.countryCodeText}>
                        +{callingCode2} {" |"}
                      </Text>
                      <TextInput
                        style={[
                          styles.input,
                          { paddingLeft: 0, marginBottom: 0 },
                        ]}
                        onChangeText={(text) =>
                          formatPhoneNumber(text, setTelefono2, countryCode2)
                        }
                        value={telefono2}
                        keyboardType="phone-pad"
                        placeholder="10 dígitos"
                      />
                    </View>
                    <View style={styles.separacion} />*/}

                    <Text style={styles.tituloCampo}>Porcentaje</Text>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <TextInput
                        style={[styles.input, { flex: 0.08 }]}
                        onChangeText={handlePorcentaje2Change}
                        value={invBox.porcentaje2}
                        keyboardType="numeric"
                        maxLength={3}
                      />
                      <Text
                        style={{
                          fontSize: 17,
                          marginTop: -7.5,
                          color: "#060B4D",
                          fontFamily: "opensanssemibold",
                        }}
                      >
                        %
                      </Text>
                    </View>
                    <View style={styles.separacion} />

                    <Text style={styles.tituloCampo}>Parentesco</Text>
                    <DropDownPicker
                      open={open2}
                      value={invBox.parentesco2}
                      items={dataParentesco2}
                      listMode="MODAL"
                      modalProps={{
                        animationType: "slide",
                      }}
                      placeholder="Selecciona una opción"
                      setOpen={setOpen2}
                      setValue={(callback) => {
                        setInvBox((prevState) => ({
                          ...prevState,
                          parentesco2: callback(prevState.parentesco2),
                        }));
                      }}
                      onChangeValue={(choice) =>
                        setInvBox({ ...invBox, parentesco2: choice })
                      }
                      style={styles.DropDownPicker}
                      arrowIconStyle={{
                        tintColor: "#060B4D",
                        width: 25,
                      }}
                      placeholderStyle={{
                        color: "#c7c7c9ff",
                        fontFamily: "opensanssemibold",
                      }}
                      dropDownContainerStyle={styles.DropDownContainer}
                      textStyle={styles.DropDownText}
                    />
                    <View style={[styles.separacion]} />
                  </View>
                )}
              </View>
            </View>
            {/* Botones de Continuar y Agregar o Eliminar Beneficiario */}
            <View style={{ marginBottom: 20, zIndex: -1 }}>
              <TouchableOpacity
                style={[styles.botonContinuar, { backgroundColor: "#E1E1E1" }]}
                onPress={() =>
                  segundoBeneficiaro
                    ? handleCancelBeneficiario()
                    : [
                        setSegundoBeneficiaro(true),
                        setInvBox({
                          ...invBox,
                          porcentaje: "50",
                          porcentaje2: "50",
                        }),
                      ]
                }
              >
                <Text
                  style={[
                    styles.textoBotonContinuar,
                    { color: segundoBeneficiaro ? "#F95C5C" : "#060B4D" },
                  ]}
                >
                  {segundoBeneficiaro
                    ? "Eliminar Beneficiario"
                    : "Agregar Beneficiario"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.botonContinuar,
                  { backgroundColor: disabled ? "#E1E1E1" : "#060B4D" },
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
    fontSize: 16,
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

export default Beneficiarios;
