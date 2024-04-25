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
import { useRoute } from "@react-navigation/native";
// Importaciones de Componentes y Hooks
import { APIGet } from "../../API/APIService";
import { CreditContext } from "../../hooks/CreditContext";
import { Feather, Ionicons } from "@expo/vector-icons";
import MontoyPlazoCredito from "../../components/MontoyPlazoCredito";
import DatosGeneralesCredito from "../../components/DatosGeneralesCredito";
import DatosCotizadorCredito from "../../components/DatosCotizadorCredito";
import ModalCotizadorCredito from "../../components/ModalCotizadorCredito";
import ObligadoSolidario from "../../components/ObligadoSolidario";

// Se mide la pantalla para determinar medidas
const screenWidth = Dimensions.get("window").width;
const widthHalf = screenWidth / 2;
const widthFourth = screenWidth / 4 - 15;

const DefinirCredito = ({ navigation }) => {
  const route = useRoute();
  const { flujo } = route.params;
  // Estados y Contexto
  const { credit, setCredit, resetCredit } = useContext(CreditContext);
  const [modalVisible, setModalVisible] = useState(false);
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

  const isAcceptable = credit.montoNumeric >= 10000 && credit.plazo;

  // Función para hacer la cotizacion al API
  useEffect(() => {
    const cotizar = async () => {
      console.log(credit.plazo, credit.montoNumeric);
      const url = `/api/v1/simulator?term=${credit.plazo}&type=credit&amount=${credit.montoNumeric}`;

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
        setCredit({
          ...credit,
          comision_por_apertura: response.data.commision,
          tasa_de_operacion: response.data.rate,
          pago_mensual: response.data.amount,
          total_a_pagar: response.data.total,
        });
      }
    };
    if (credit.plazo && credit.montoNumeric >= 10000) {
      cotizar();
    }
  }, [credit.plazo, credit.montoNumeric]);

  // Función para cambiar el focus de la pantalla
  const handleFocus = (tab) => {
    if (tab === focus) return;
    if (credit.paso === 1) {
      setFocus(tab);
    } else {
      Alert.alert(
        "¿Deseas cambiar de opción?",
        "Si cambias de opción de crédito, perderás la información ingresada hasta el momento.",
        [
          {
            text: "Cambiar de opción",
            onPress: () => [resetCredit(), setFocus(tab)],
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
      if (credit.paso === 4) {
        navigation.navigate("MiTankef");
      } else if (credit.paso === 1) {
        setCredit({
          ...credit,
          modalCotizadorVisible: true,
        });
      } else if (credit.paso === 2) {
        navigation.navigate("ObligadosSolidarios", { flujo: flujo });
      } else if (credit.paso === 3) {
        navigation.navigate("InfoGeneral", { flujo: flujo });
      } else {
        setCredit({
          ...credit,
          paso: credit.paso + 1,
        });
      }
    } else if (focus === "Comite") {
      if (credit.paso === 3) {
        resetCredit();
        setFocus("Mi Red");
        navigation.navigate("MiTankef");
      } else if (credit.paso === 1) {
        setCredit({ ...credit, modalCotizadorVisible: true });
      } else if (credit.paso === 2) {
        navigation.navigate("InfoGeneral", { flujo: flujo });
      } else {
        setCredit({
          ...credit,
          paso: credit.paso + 1,
        });
      }
    }
  };

  const handleCancelar = () => {
    Alert.alert(
      "¿Deseas cancelar el Crédito?",
      "Si cancelas el Crédito, perderás la información ingresada hasta el momento.",
      [
        {
          text: "Si",
          onPress: () => [navigation.navigate("Inicio"), resetCredit()],
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
    if (credit.obligados_solidarios.length === 0 && credit.paso >= 3) {
      Alert.alert(
        "¡Atención!",
        "Debes tener al menos un obligado solidario para solicitar un crédito por tu red."
      );
      setCredit({ ...credit, paso: 2 });
      navigation.navigate("ObligadosSolidarios", { flujo: flujo });
    }
  }, [credit.obligados_solidarios]);

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
          {credit.paso === 1 && (
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
                  source={imageMap[`${credit.paso}de4`]}
                  style={{ height: 50, width: 50 }}
                />
                <Text
                  style={[
                    styles.texto,
                    { fontFamily: "opensansbold", marginLeft: 10 },
                  ]}
                >
                  Mi Red con Obligados Solidarios
                </Text>
              </View>

              <MontoyPlazoCredito />

              {/* {credit.paso === 1 && (
              <View style={styles.contenedores}>
                <Text style={styles.texto}>
                  Invita a tus amigos a unirse a tu red financiera. Cuantos más
                  se sumen, más respaldo tendrás al solicitar un crédito.
                  ¡Aprovecha el poder de la comunidad para obtener
                  financiamiento!
                </Text>
              </View>
            )} */}

              {credit.paso >= 2 && <DatosCotizadorCredito />}

              {credit.paso >= 3 && (
                <>
                  {credit.obligados_solidarios.map((obligado, index) => (
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
                      setCredit({ ...credit, paso: 2 }),
                    ]}
                  >
                    <ObligadoSolidario
                      nombre={"Agregar obligado solidario"}
                      imagen={imageMap["AddSign"]}
                      button={false}
                    />
                  </TouchableOpacity>
                  {credit.paso >= 4 && (
                    <>
                      <DatosGeneralesCredito />
                      <View style={styles.contenedores}>
                        <Text style={styles.subTexto}>
                          Acepto se me investigue en la Sociedad de Información
                          Crediticia (SIC)
                        </Text>
                        <RadioForm
                          key={credit.aceptarSIC}
                          radio_props={dataAceptar}
                          initial={credit.aceptarSIC === "" ? -1 : 0}
                          onPress={(value) =>
                            setCredit({
                              ...credit,
                              aceptarSIC:
                                value === credit.aceptarSIC ? "" : value,
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
                            setCredit({ ...credit, actuoComo: value })
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
                  source={imageMap[`${credit.paso}de3`]}
                  style={{ height: 50, width: 50 }}
                />
                <Text
                  style={[
                    styles.texto,
                    { fontFamily: "opensansbold", marginLeft: 10 },
                  ]}
                >
                  {credit.paso === 1
                    ? "Solicitud de crédito por Comité"
                    : credit.paso === 2
                    ? "Revisión de Cotización"
                    : "Revisión y Validación de infromación"}
                </Text>
              </View>

              <MontoyPlazoCredito />

              {/* {credit.paso === 1 && (
              <View style={styles.contenedores}>
                <Text style={styles.texto}>
                  Al solicitar un crédito a través del comité, tu historial
                  crediticio será revisado en buró de crédito y otros aspectos
                  serán evaluados.
                </Text>
              </View>
            )} */}

              {credit.paso >= 2 && (
                <>
                  <DatosCotizadorCredito />
                  {credit.paso >= 3 && <DatosGeneralesCredito />}
                </>
              )}
            </>
          )}
        </View>

        <View>
          <View
            style={{
              paddingHorizontal: 10,
              flexDirection: credit.paso === 1 ? "column" : "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* Botones de Atrás y Continuar */}
            {credit.paso !== 1 && (
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
                  credit.paso === 3
                    ? setCredit({
                        ...credit,
                        paso: credit.paso - 1,
                        obligados_solidarios: [],
                      })
                    : setCredit({ ...credit, paso: credit.paso - 1 });
                }}
              >
                <Text
                  style={[styles.textoBotonContinuar, { color: "#060B4D" }]}
                >
                  Atrás
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[
                styles.botonContinuar,
                {
                  flex: 1,
                  marginLeft: credit.paso === 1 ? 0 : 5,
                  width: credit.paso === 1 && "80%", // Ensure width is consistent for the "Continuar" button
                  backgroundColor: !isAcceptable ? "#D5D5D5" : "#060B4D",
                },
              ]}
              onPress={handleAccept}
              disabled={!isAcceptable}
            >
              <Text
                style={[
                  styles.textoBotonContinuar,
                  { color: !isAcceptable ? "grey" : "white" },
                ]}
              >
                Continuar
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={[
              styles.botonContinuar,
              {
                backgroundColor: "white",
                marginBottom: 30,
                width: "76.5%",
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
  /*inputNombre: {
    marginTop: 5,
    fontSize: 16,
    color: "#060B4D",
    fontFamily: "opensans",
  },*/
});

export default DefinirCredito;
