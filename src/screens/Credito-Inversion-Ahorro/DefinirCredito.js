// Importaciones de React Native y React
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
  Image,
} from "react-native";
import React, { useState, useCallback, useContext, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import RadioForm from "react-native-simple-radio-button";
import { ActivityIndicator } from "react-native-paper";
import { useRoute } from "@react-navigation/native";
// Importaciones de Componentes y Hooks
import { APIGet, APIPost } from "../../API/APIService";
import { FinanceContext } from "../../hooks/FinanceContext";
import { Feather, Ionicons } from "@expo/vector-icons";
import MontoyPlazoCredito from "../../components/MontoyPlazoCredito";
import DatosGeneralesCredito from "../../components/DatosGeneralesCredito";
import DatosCotizadorCredito from "../../components/DatosCotizadorCredito";
import ModalCotizadorCredito from "../../components/ModalCotizadorCredito";
import ObligadoSolidario from "../../components/ObligadoSolidario";
import ModalEstatus from "../../components/ModalEstatus";

// Se mide la pantalla para determinar medidas
const screenWidth = Dimensions.get("window").width;
const widthHalf = screenWidth / 2;
const widthFourth = screenWidth / 4 - 15;

const DefinirCredito = ({ navigation }) => {
  const route = useRoute();
  const { flujo } = route.params;
  // Estados y Contexto
  const { finance, setFinance, resetFinance } = useContext(FinanceContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focus, setFocus] = useState("Mi Red");

  const imageMap = {
    "1de4": require("../../../assets/images/1de4.png"),
    "2de4": require("../../../assets/images/2de4.png"),
    "3de4": require("../../../assets/images/3de4.png"),
    "4de4": require("../../../assets/images/4de4.png"),
    "1de3": require("../../../assets/images/1de3.png"),
    "2de3": require("../../../assets/images/2de3.png"),
    "3de3": require("../../../assets/images/3de3.png"),
    Blank: require("../../../assets/images/blankAvatar.jpg"),
    AddSign: require("../../../assets/images/AddSign.png"),
  };

  // Función para hacer la cotizacion al API
  useEffect(() => {
    const cotizar = async () => {
      console.log(finance.plazo, finance.montoNumeric);
      const url = `/api/v1/simulator?term=${finance.plazo}&type=credit&amount=${finance.montoNumeric}`;

      const response = await APIGet(url);
      if (response.error) {
        // Manejar el error
        console.error("Error al cotizar:", response.error);
        Alert.alert(
          "Error",
          "No se pudo hacer la cotización. Intente nuevamente."
        );
      } else {
        console.log("Cotización exitosa:", response);
        setFinance({
          ...finance,
          comision_por_apertura: response.data.commision,
          tasa_de_operacion: response.data.rate,
          pago_mensual: response.data.amount,
          total_a_pagar: response.data.total,
        });
      }
    };
    if (finance.plazo && finance.montoNumeric >= 10000) {
      cotizar();
    }
  }, [finance.plazo, finance.montoNumeric]);

  // Función para cambiar el focus de la pantalla
  const handleFocus = (tab) => {
    if (tab === focus) return;
    if (finance.paso === 1) {
      setFocus(tab);
    } else {
      Alert.alert(
        "¿Deseas cambiar de opción?",
        "Si cambias de opción de crédito, perderás la información ingresada hasta el momento.",
        [
          {
            text: "Cambiar de opción",
            onPress: () => [resetFinance(), setFocus(tab)],
            style: "destructive",
          },
          {
            text: "Cancelar",
          },
        ],
        { cancelable: true }
      );
    }
  };

  const handleAccept = () => {
    if (focus === "Mi Red") {
      if (finance.paso === 1) {
        setFinance({
          ...finance,
          modalCotizadorVisible: true,
        });
      } else if (finance.paso === 2) {
        setModalVisible(true); // Desde aqui se confirma y se establece la creacion del crédito
      } else if (finance.paso === 3) {
        navigation.navigate("InfoGeneral", { flujo: flujo });
      } else if (finance.paso === 4) {
        navigation.navigate("MiTankef");
      } else {
        setFinance({
          ...finance,
          paso: finance.paso + 1,
        });
      }
    } else if (focus === "Comite") {
      if (finance.paso === 1) {
        setFinance({
          ...finance,
          modalCotizadorVisible: true,
        });
      } else if (finance.paso === 2) {
        createCredit();
      } else if (finance.paso === 3) {
        resetFinance();
        setFocus("Mi Red");
        navigation.navigate("MiTankef");
      } else {
        setFinance({
          ...finance,
          paso: finance.paso + 1,
        });
      }
    }
  };

  const createCredit = async () => {
    setLoading(true);
    const url = "/api/v1/credits";
    console.log(
      finance.montoNumeric,
      finance.plazo,
      finance.condiciones,
      focus
    );
    const data = {
      credit: {
        amount: finance.montoNumeric,
        term: finance.plazo,
        approval: focus === "Mi Red" ? "network" : "committee",
        term_and_conditions: finance.condiciones,
      },
    };

    const response = await APIPost(url, data);
    if (response.error) {
      setLoading(false);
      console.error("Error al crear el crédito:", response.error);
      const errorMessages = response.error.errors
        ? Object.values(response.error.errors).flat().join(". ")
        : response.error;
      Alert.alert("Error al crear el crédito", errorMessages);
    } else {
      setLoading(false);
      navigation.navigate("InfoGeneral", {
        flujo: flujo,
        idInversion: response.data.data.id,
      });
      console.log("Crédito creado exitosamente:", response);
    }
  };

  const handleCancelar = () => {
    Alert.alert(
      "¿Deseas cancelar el Crédito?",
      "Si cancelas el Crédito, perderás la información ingresada hasta el momento.",
      [
        {
          text: "Si",
          onPress: () => [navigation.navigate("Inicio"), resetFinance()],
          style: "destructive",
        },
        {
          text: "No",
        },
      ],
      { cancelable: true }
    );
  };

  useEffect(() => {
    if (finance.obligados_solidarios.length === 0 && finance.paso >= 3) {
      Alert.alert(
        "¡Atención!",
        "Debes tener al menos un obligado solidario para solicitar un crédito por tu red."
      );
      setFinance({ ...finance, paso: 2 });
      navigation.navigate("ObligadosSolidarios", { flujo: flujo });
    }
  }, [finance.obligados_solidarios]);

  const isAcceptable1 =
    finance.montoNumeric >= 10000 && finance.plazo && finance.condiciones;
  const isAcceptable4 = finance.aceptarSIC && finance.actuoComo;

  // Function to determine button's background color
  const getButtonBackgroundColor = () => {
    if (finance.paso <= 2) {
      return isAcceptable1 ? "#060B4D" : "#D5D5D5";
    } else if (finance.paso === 4) {
      return isAcceptable4 ? "#060B4D" : "#D5D5D5";
    } else if (loading) {
      return "#D5D5D5";
    }
  };

  // Function to determine text color
  const getTextColor = () => {
    if (finance.paso <= 2) {
      return isAcceptable1 ? "white" : "grey";
    } else if (finance.paso === 4) {
      return isAcceptable4 ? "white" : "grey";
    } else if (loading) {
      return "grey";
    }
  };

  const handleDisabled = () => {
    if (finance.paso <= 2) {
      return isAcceptable1;
    } else if (finance.paso === 4) {
      return isAcceptable4;
    } else if (loading) {
      return false;
    }
  };

  const [dataAceptar] = useState([{ label: "Si acepto", value: "Si" }]);

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
        <Text style={styles.tituloPantalla}>Crédito</Text>
        <TouchableOpacity>
          <Feather
            name="bell"
            size={25}
            color="#060B4D"
            style={{ marginTop: 50 }}
          />
        </TouchableOpacity>
      </View>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <View style={{ flex: 1 }}>
          {finance.paso === 1 && (
            <View
              style={{
                alignItems: "center",
                paddingHorizontal: 25,
                paddingVertical: 15,
                backgroundColor: "white",
                marginTop: 3,
              }}
            >
              <Text
                style={{
                  fontFamily: "opensansbold",
                  fontSize: 16,
                  color: "#060B4D",
                  textAlign: "center",
                }}
              >
                Selecciona una de nuestras opciones para solicitar un crédito.
              </Text>
            </View>
          )}
          {/* Opcion para añadir nombre al crédito */}
          {/*<View
              style={{
                marginTop: 3,
                backgroundColor: "white",
                paddingHorizontal: 15,
                paddingVertical: 5,
              }}
            >
              <Text style={styles.texto}>Nombre de la Inversión</Text>
              <TextInput
                style={styles.inputNombre}
                value={nombreInversion}
                maxLength={20}
                placeholderTextColor={"#b3b5c9ff"}
                placeholder="Introduce el nombre de la inversión"
                onChangeText={(text) => setNombreInversion(text)}
              />
            </View>*/}
          <View style={styles.tabsContainer}>
            {/* Boton Tab Mi Red */}
            <TouchableOpacity
              style={styles.tabButton}
              onPress={() => handleFocus("Mi Red")}
            >
              <Text
                style={[
                  styles.tabText,
                  {
                    color: focus === "Mi Red" ? "#060B4D" : "#9596AF",
                    fontFamily:
                      focus === "Mi Red" ? "opensansbold" : "opensanssemibold",
                  },
                ]}
              >
                Mi Red
              </Text>
              {focus === "Mi Red" ? <View style={styles.focusLine} /> : null}
            </TouchableOpacity>

            {/* Boton Tab Comité */}
            <TouchableOpacity
              style={styles.tabButton}
              onPress={() => handleFocus("Comite")}
            >
              <Text
                style={[
                  styles.tabText,
                  {
                    color: focus === "Comite" ? "#060B4D" : "#9596AF",
                    fontFamily:
                      focus === "Comite" ? "opensansbold" : "opensanssemibold",
                  },
                ]}
              >
                Comité
              </Text>
              {focus === "Comite" ? <View style={styles.focusLine} /> : null}
            </TouchableOpacity>
          </View>

          {/* Flujo de Mi Red */}
          {focus === "Mi Red" && (
            <>
              <View
                style={[
                  styles.contenedores,
                  { flexDirection: "row", justifyContent: "center" },
                ]}
              >
                <Image
                  source={imageMap[`${finance.paso}de4`]}
                  style={{ height: 50, width: 50 }}
                />
                <Text
                  style={[
                    styles.texto,
                    { fontFamily: "opensansbold", marginLeft: 10 },
                  ]}
                >
                  {finance.paso === 1
                    ? "Solicitud de crédito por Mi Red"
                    : finance.paso === 2
                    ? "Revisión de Cotización"
                    : finance.paso === 3
                    ? "Obligados solidarios"
                    : "Revisión y Validación de información"}
                </Text>
              </View>

              <MontoyPlazoCredito />

              {/* {finance.paso === 1 && (
              <View style={styles.contenedores}>
                <Text style={styles.texto}>
                  Invita a tus amigos a unirse a tu red financiera. Cuantos más
                  se sumen, más respaldo tendrás al solicitar un crédito.
                  ¡Aprovecha el poder de la comunidad para obtener
                  financiamiento!
                </Text>
              </View>
            )} */}

              {finance.paso >= 2 && <DatosCotizadorCredito />}

              {finance.paso >= 3 && (
                <>
                  {finance.obligados_solidarios.map((obligado, index) => (
                    <>
                      <ObligadoSolidario
                        key={index}
                        userID={obligado.userID}
                        nombre={obligado.nombre}
                        imagen={
                          obligado.imagen ? obligado.imagen : imageMap["Blank"]
                        }
                        select={false}
                        button={true}
                      />
                    </>
                  ))}

                  <TouchableOpacity
                    onPress={() => [
                      navigation.navigate("ObligadosSolidarios", {
                        flujo: flujo,
                      }),
                      setFinance({ ...finance, paso: 2 }),
                    ]}
                  >
                    <ObligadoSolidario
                      nombre={"Agregar obligado solidario"}
                      imagen={imageMap["AddSign"]}
                      button={false}
                    />
                  </TouchableOpacity>
                  {finance.paso >= 4 && (
                    <>
                      <DatosGeneralesCredito />
                      <View style={styles.contenedores}>
                        <Text style={styles.subTexto}>
                          Acepto se me investigue en la Sociedad de Información
                          Crediticia (SIC)
                        </Text>
                        <RadioForm
                          key={finance.aceptarSIC}
                          radio_props={dataAceptar}
                          initial={finance.aceptarSIC === "" ? -1 : 0}
                          onPress={(value) =>
                            setFinance({
                              ...finance,
                              aceptarSIC:
                                value === finance.aceptarSIC ? "" : value,
                            })
                          }
                          buttonColor={"#060B4D"}
                          buttonSize={10}
                          selectedButtonColor={"#060B4D"}
                          labelStyle={{
                            fontSize: 16,
                            color: "#060B4D",
                            fontFamily: "opensanssemibold",
                          }}
                          animation={false}
                          style={{ alignSelf: "baseline", marginTop: 10 }}
                        />
                        <View
                          style={[styles.separacion, { marginVertical: 10 }]}
                        />
                        <Text style={styles.subTexto}>
                          Declaro que soy el propietario real de los recursos
                          y/o beneficiario del crédito, por lo que el origen
                          procedencia de los recursos que Tu Kapital en
                          Evolución, SAPI de CV, SOFOM, ENR, recibirá respecto
                          de los servicios que solicitep proceden de fuentes
                          lícitas y son de mi propiedad. Por lo que declaro que:
                        </Text>
                        <RadioForm
                          radio_props={dataActuo}
                          initial={-1}
                          onPress={(value) =>
                            setFinance({ ...finance, actuoComo: value })
                          }
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
                        <Text
                          style={[
                            styles.subTexto,
                            { fontSize: 12, marginTop: 10 },
                          ]}
                        >
                          (*) En caso de actuar a nombre de un tercero, es
                          necesario la siguiente información: Identificación
                          oficial vigente, datos generales y comprobante de
                          domicilio recientes.
                        </Text>
                      </View>
                    </>
                  )}
                </>
              )}
            </>
          )}
          {focus === "Comite" && (
            <>
              <View
                style={[
                  styles.contenedores,
                  { flexDirection: "row", justifyContent: "center" },
                ]}
              >
                <Image
                  source={imageMap[`${finance.paso}de3`]}
                  style={{ height: 50, width: 50 }}
                />
                <Text
                  style={[
                    styles.texto,
                    { fontFamily: "opensansbold", marginLeft: 10 },
                  ]}
                >
                  {finance.paso === 1
                    ? "Solicitud de crédito por Comité"
                    : finance.paso === 2
                    ? "Revisión de Cotización"
                    : "Revisión y Validación de infromación"}
                </Text>
              </View>

              <MontoyPlazoCredito />

              {/* {finance.paso === 1 && (
              <View style={styles.contenedores}>
                <Text style={styles.texto}>
                  Al solicitar un crédito a través del comité, tu historial
                  crediticio será revisado en buró de crédito y otros aspectos
                  serán evaluados.
                </Text>
              </View>
            )} */}

              {finance.paso >= 2 && (
                <>
                  <DatosCotizadorCredito />
                  {finance.paso >= 3 && <DatosGeneralesCredito />}
                </>
              )}
            </>
          )}
        </View>

        <View>
          {/*<View
            style={{
              paddingHorizontal: 10,
              flexDirection: finance.paso === 1 ? "column" : "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >*/}
          {/* Botones de Atrás y Continuar */}
          {/*
            {finance.paso !== 1 && (
              <TouchableOpacity
                style={[
                  styles.botonContinuar,
                  {
                    marginRight: 5,
                    flex: 1,
                    backgroundColor: "white",
                    borderColor: "#060B4D",
                    borderWidth: 1,
                  },
                ]}
                onPress={() => {
                  finance.paso === 3
                    ? setFinance({
                        ...finance,
                        paso: finance.paso - 1,
                        obligados_solidarios: [],
                      })
                    : setFinance({ ...finance, paso: finance.paso - 1 });
                }}
              >
                <Text
                  style={[styles.textoBotonContinuar, { color: "#060B4D" }]}
                >
                  Atrás
                </Text>
              </TouchableOpacity>
            )}*/}
          <TouchableOpacity
            style={[
              styles.botonContinuar,
              {
                backgroundColor: getButtonBackgroundColor(),
              },
            ]}
            onPress={handleAccept}
            disabled={!handleDisabled()}
          >
            <Text
              style={[styles.textoBotonContinuar, { color: getTextColor() }]}
            >
              Continuar
            </Text>
          </TouchableOpacity>
          {/*</View>*/}
          {finance.paso <= 2 && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                alignSelf: "center",
              }}
            >
              <TouchableOpacity
                style={{ marginTop: 10, marginRight: 7.5 }}
                onPress={() => [
                  setFinance({ ...finance, condiciones: !finance.condiciones }),
                ]}
              >
                <Feather
                  name={finance.condiciones ? "check-square" : "square"}
                  size={24}
                  color="#060B4D"
                />
              </TouchableOpacity>
              <Text style={styles.textCondiciones}>
                Al continuar usted está aceptando{" "}
                <Text style={{ fontFamily: "opensansbold" }}>
                  Términos y Condiciones
                </Text>
              </Text>
            </View>
          )}
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
              Cancelar Crédito
            </Text>
          </TouchableOpacity>
        </View>
        <ModalCotizadorCredito />
      </ScrollView>
      {finance.paso === 2 && (
        <ModalEstatus
          titulo={"¡Atención!"}
          texto={
            "Una vez aceptada la cotización, no podrás modificarla. ¿Deseas continuar?"
          }
          imagen={"Alert"}
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onAccept={() => [setModalVisible(false), createCredit()]}
        />
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
    marginLeft: 15,
    fontSize: 24,
    color: "#060B4D",
    fontFamily: "opensanssemibold",
  },
  tabsContainer: {
    backgroundColor: "white",
    marginTop: 3,
    flexDirection: "row",
    paddingTop: 16,
    justifyContent: "space-between",
  },
  tabButton: {
    alignItems: "center",
    flex: 1,
  },
  tabText: {
    fontFamily: "opensansbold",
    fontSize: 16,
  },
  focusLine: {
    height: 4,
    width: widthHalf,
    marginTop: 12,
    backgroundColor: "#060B4D",
  },
  separacion: {
    height: 1,
    width: "100%",
    backgroundColor: "#cecfdbff",
  },
  botonContinuar: {
    marginTop: 15,
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
  contenedores: {
    backgroundColor: "white",
    paddingHorizontal: 12,
    paddingVertical: 15,
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
  textCondiciones: {
    color: "#060B4D",
    fontFamily: "opensans",
    fontSize: 12,
    marginTop: 10,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default DefinirCredito;
