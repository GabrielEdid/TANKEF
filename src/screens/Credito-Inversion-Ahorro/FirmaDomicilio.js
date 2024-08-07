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
import React, { useState, useEffect, useContext } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import DropDownPicker from "react-native-dropdown-picker";
import MaskedView from "@react-native-masked-view/masked-view";
import { ActivityIndicator } from "react-native-paper";
import { useRoute } from "@react-navigation/native";
import axios from "axios";
// Importaciones de Componentes y Hooks
import { useInactivity } from "../../hooks/InactivityContext";
import { APIPost } from "../../API/APIService";
import ModalEstatus from "../../components/ModalEstatus";
import { Feather, Entypo, AntDesign } from "@expo/vector-icons";

// Se mide la pantalla para determinar medidas
const screenWidth = Dimensions.get("window").width;
const widthHalf = screenWidth / 2;

const FirmaDomicilio = ({ navigation }) => {
  const route = useRoute();
  const { flujo, idInversion } = route.params;
  // Estados y Contexto
  const { resetTimeout } = useInactivity();
  const [nombre, setNombre] = useState("");
  const [calle, setCalle] = useState("");
  const [numeroExterior, setNumeroExterior] = useState("");
  const [numeroInterior, setNumeroInterior] = useState("");
  const [codigoPostal, setCodigoPostal] = useState("");
  const [pais, setPais] = useState("México");
  const [ciudad, setCiudad] = useState("");
  const [estado, setEstado] = useState();
  const [estadosData, setEstadosData] = useState([]);
  const [municipio, setMunicipio] = useState("");
  const [municipiosData, setMunicipiosData] = useState([]);
  const [colonia, setColonia] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [openEstado, setOpenEstado] = useState(false);
  const [openMunicipio, setOpenMunicipio] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // Función para guardar los datos del domicilio
  const handlePress = async () => {
    resetTimeout();
    setLoading(true);
    setDisabled(true);
    const url = `/api/v1/${
      flujo === "Inversión" ? "investments" : "box_savings"
    }/${idInversion}/mailaddress`;
    const data = {
      mailaddress: {
        fullname: nombre,
        country: pais,
        street: calle,
        ext_number: numeroExterior,
        int_number: numeroInterior,
        city: ciudad,
        municipality: municipio,
        neighborhood: colonia,
        state: estado[0],
        zip_code: codigoPostal,
        delivery_method: "home",
      },
    };

    const response = await APIPost(url, data);
    if (response.error) {
      setLoading(false);
      console.error("Error al guardar los datos:", response.error);
      Alert.alert(
        "Error",
        "No se pudieron gurdar los datos del domicilio. Intente nuevamente."
      );
    } else {
      setLoading(false);
      setModalVisible(true);
    }
    setLoading(false);
    setDisabled(false);
  };

  // Efecto para deshabilitar el botón de continuar si no se han llenado todos los campos
  useEffect(() => {
    const camposLlenos =
      nombre !== "" &&
      calle !== "" &&
      numeroExterior !== "" &&
      numeroInterior !== "" &&
      codigoPostal !== "" &&
      pais !== "" &&
      ciudad !== "" &&
      estado !== "" &&
      municipio !== "" &&
      colonia !== "";
    setDisabled(!camposLlenos);
  }, [
    nombre,
    calle,
    numeroExterior,
    numeroInterior,
    codigoPostal,
    pais,
    ciudad,
    estado,
    municipio,
    colonia,
  ]);

  useEffect(() => {
    const config = {
      method: "get",
      url: "https://api.countrystatecity.in/v1/countries/MX/states",
      headers: {
        "X-CSCAPI-KEY":
          "UndSbjVseEw1MkFkTENGMFVNYUtZUXVmdHNZdWNoQ1pHUEFRMW1uUw==",
      },
    };

    axios(config)
      .then((response) => {
        const formattedData = response.data.map((item) => ({
          label: item.name,
          value: [item.name, item.iso2],
        }));
        setEstadosData(formattedData);
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    // Verifica que estado tenga contenido y sea un arreglo con al menos dos elementos
    if (Array.isArray(estado)) {
      const isoCode = estado[1];
      const config = {
        method: "get",
        url: `https://api.countrystatecity.in/v1/countries/MX/states/${isoCode}/cities`,
        headers: {
          "X-CSCAPI-KEY":
            "UndSbjVseEw1MkFkTENGMFVNYUtZUXVmdHNZdWNoQ1pHUEFRMW1uUw==",
        },
      };

      axios(config)
        .then((response) => {
          const formattedData = response.data.map((item) => ({
            label: item.name,
            value: item.name,
          }));
          setMunicipiosData(formattedData);
        })
        .catch((error) => console.log(error));
    }
  }, [estado]);

  const handleRegresar = () => {
    resetTimeout();
    Alert.alert(
      `¿Deseas regresar a Mi Tankef`,
      `Regresar no cancelará ${
        flujo === "Crédito" ? `el ${flujo}` : `la ${flujo}`
      }.`,
      [
        {
          text: `Si`,
          onPress: () => [navigation.navigate("MiTankef")],
          style: "destructive",
        },
        {
          text: `No`,
        },
      ],
      { cancelable: true }
    );
  };

  // Componente Visual
  return (
    <View style={{ flex: 1 }}>
      {/* Titulo, Nombre de Pantalla y Campana */}
      <View style={styles.tituloContainer}>
        {/* <MaskedView
          style={{ flex: 0.6 }}
          maskElement={<Text style={styles.titulo}>tankef</Text>}
        >
          <LinearGradient
            colors={["#2FF690", "#21B6D5"]}
            start={{ x: 1, y: 1 }}
            end={{ x: 0, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </MaskedView> */}
        <Text
          style={[
            styles.tituloPantalla,
            {
              fontSize: flujo === "Caja de ahorro" ? 20 : 24,
              //   marginRight: // Descomentar si se regresa el titulo
              //     flujo === "Caja de ahorro"
              //       ? 55
              //       : flujo === "Crédito"
              //       ? -20
              //       : 10,
            },
          ]}
        >
          {flujo}
        </Text>
      </View>

      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        scrollEnabled={true}
        enableOnAndroid={true}
        style={styles.scrollV}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        enableAutomaticScroll={true}
        onScroll={() => resetTimeout()}
        scrollEventThrottle={400}
      >
        <View style={styles.seccion}>
          <Text style={styles.tituloSeccion}>Firma de Contrato</Text>
          <Text style={styles.bodySeccion}>Enviar el contrato a Domicilio</Text>
        </View>
        <View style={{ flex: 1 }}>
          <View
            style={{
              marginTop: 3,
              backgroundColor: "white",
              paddingTop: 10,
            }}
          >
            {/* Campos para introducir de la información general */}

            <Text style={[styles.tituloCampo, { marginTop: 0 }]}>
              Nombre Completo{" "}
            </Text>
            <TextInput
              style={styles.input}
              onChangeText={(text) => [setNombre(text), resetTimeout()]}
              value={nombre}
              placeholder="Eje. Raúl Guizar Torres"
            />
            <View style={styles.separacion} />

            <Text style={styles.tituloCampo}>Nombre de la Calle</Text>
            <TextInput
              style={styles.input}
              onChangeText={(text) => [setCalle(text), resetTimeout()]}
              value={calle}
              placeholder="Eje. Acueducto de las Fuentes"
            />
            <View style={styles.separacion} />

            <Text style={styles.tituloCampo}>Número Exterior</Text>
            <TextInput
              style={styles.input}
              onChangeText={(text) => [setNumeroExterior(text), resetTimeout()]}
              value={numeroExterior}
              placeholder="Eje. 22"
            />
            <View style={styles.separacion} />

            <Text style={styles.tituloCampo}>Número Interior</Text>
            <TextInput
              style={styles.input}
              onChangeText={(text) => [setNumeroInterior(text), resetTimeout()]}
              value={numeroInterior}
              placeholder="Eje. 4B"
            />
            <View style={styles.separacion} />

            <Text style={styles.tituloCampo}>Código Postal</Text>
            <TextInput
              style={styles.input}
              onChangeText={(text) => [setCodigoPostal(text), resetTimeout()]}
              value={codigoPostal}
              keyboardType="numeric"
              placeholder="Eje. 53290"
            />
            <View style={styles.separacion} />

            <Text style={styles.tituloCampo}>País</Text>
            {/* Dropdown estatico en país */}
            <DropDownPicker
              items={[{ label: "México", value: "México" }]}
              placeholder={pais}
              showArrowIcon={false}
              style={styles.DropDownPicker}
              textStyle={styles.DropDownText}
              disabled={true}
              //setValue={setPais}
              //onChangeValue={(value) => setPais(value)}
              //value={pais}
              //setOpen={setOpenPais}
              //arrowIconStyle={{ tintColor: "#060B4D", width: 25 }}
              //dropDownContainerStyle={styles.DropDownContainer}
            />
            <View style={styles.separacion} />

            <Text style={styles.tituloCampo}>Estado</Text>
            <DropDownPicker
              searchable={true}
              searchPlaceholder="Busca un Estado"
              open={openEstado}
              value={estado}
              items={estadosData}
              listMode="MODAL"
              modalProps={{
                animationType: "slide",
              }}
              placeholder="Selecciona una opción"
              setOpen={setOpenEstado}
              setValue={setEstado}
              onSelectItem={(selection) => {
                [setEstado(selection.value), resetTimeout()];
              }}
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

            <Text style={styles.tituloCampo}>Ciudad</Text>
            <TextInput
              style={styles.input}
              onChangeText={(text) => [setCiudad(text), resetTimeout()]}
              value={ciudad}
              placeholder="Villahermosa"
            />
            <View style={styles.separacion} />

            {/*<Text style={styles.tituloCampo}>Ciudad</Text>
              <DropDownPicker
                searchable={true}
                open={openCiudad}
                value={ciudad}
                items={dataPolitico}
                listMode="MODAL"
                modalProps={{
                  animationType: "slide",
                }}
                placeholder="Selecciona una opción"
                setOpen={setOpenCiudad}
                setValue={setCiudad}
                onChangeValue={(value) => setCiudad(value)}
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
              <View style={styles.separacion} /> */}

            <Text style={styles.tituloCampo}>Municipio</Text>
            <DropDownPicker
              searchable={true}
              searchPlaceholder="Busca un Municipio"
              open={openMunicipio}
              value={municipio}
              items={municipiosData}
              listMode="MODAL"
              modalProps={{
                animationType: "slide",
              }}
              placeholder={
                estado
                  ? "Selecciona una opción"
                  : "Primero selecciona un estado"
              }
              setOpen={setOpenMunicipio}
              setValue={setMunicipio}
              onChangeValue={(value) => [setMunicipio(value), resetTimeout()]}
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
              disabled={estado === undefined || municipiosData.length === 0}
            />
            <View style={styles.separacion} />

            <Text style={styles.tituloCampo}>Colonia</Text>
            <TextInput
              style={styles.input}
              onChangeText={(text) => [setColonia(text), resetTimeout()]}
              value={colonia}
              placeholder="Eje. Vista del Valle"
            />
            <View style={styles.separacion} />
          </View>
        </View>
        {/* Botones de Continuar y Agregar o Eliminar Beneficiario */}
        <View style={{ marginBottom: 30, zIndex: -1 }}>
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
                borderColor: "#060B4D",
                borderWidth: 1,
              },
            ]}
            onPress={() => {
              handleRegresar();
            }}
          >
            <Text style={[styles.textoBotonContinuar, { color: "#060B4D" }]}>
              Regresar
            </Text>
          </TouchableOpacity>
        </View>
        <ModalEstatus
          titulo={"¡Atención!"}
          texto={
            "Pronto recibirás los documentos para firmar con instrucciones.\n¡Gracias por tu preferencia!"
          }
          imagen={"Alert"}
          visible={modalVisible}
          onAccept={() => [
            setModalVisible(false),
            navigation.navigate("MiTankef"),
          ]}
        />
      </KeyboardAwareScrollView>
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
    fontSize: 24,
    textAlign: "center", // Ajuste para centrar el título, eliminar si se regresa el titulo
    color: "#060B4D",
    fontFamily: "opensanssemibold",
    fontWeight: "bold",
  },
  seccion: {
    marginTop: 3,
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
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default FirmaDomicilio;
