// Importaciones de React Native y React
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  Keyboard,
  Modal,
  Alert,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useState, useCallback, useContext } from "react";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import { useRoute } from "@react-navigation/native";
import { ActivityIndicator } from "react-native-paper";
// Importaciones de Componentes y Hooks
import {
  Feather,
  MaterialCommunityIcons,
  FontAwesome,
} from "@expo/vector-icons";
import { useInactivity } from "../../hooks/InactivityContext";
import { APIPost } from "../../API/APIService";

// Se mide la pantalla para determinar medidas
const screenWidth = Dimensions.get("window").width;
const widthHalf = screenWidth / 2;

const DefinirFirma = ({ navigation }) => {
  const route = useRoute();
  const { flujo, idInversion } = route.params;
  // Estados y Contexto
  const { resetTimeout } = useInactivity();
  const [focus, setFocus] = useState("Presencial");
  const [modalPresencial, setModalPresencial] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePresencial = async () => {
    resetTimeout();
    setLoading(true);
    setModalPresencial(false);
    const url = `/api/v1/${
      flujo === "Inversión"
        ? "investments"
        : flujo === "Crédito"
        ? "credits"
        : "box_savings"
    }/${idInversion}/mailaddress`;
    const data = {
      mailaddress: {
        fullname: "",
        country: "",
        street: "",
        ext_number: "",
        int_number: "",
        city: "",
        municipality: "",
        neighborhood: "",
        state: "",
        zip_code: "",
        delivery_method: "branch_office",
      },
    };

    const response = await APIPost(url, data);
    if (response.error) {
      setLoading(false);
      console.error("Error al gurdar como presencial:", response.error);
      Alert.alert(
        "Error",
        "No se pudo establecer la firma del contrato presencial. Intente nuevamente."
      );
    } else {
      setLoading(false);
      navigation.navigate("MiTankef");
    }
  };

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

  // Función para manejar el botón de Aceptar
  const handleSiguiente = () => {
    resetTimeout();
    if (focus === "Presencial") {
      setModalPresencial(true);
    } else if (focus === "Enviar") {
      navigation.navigate("FirmaDomicilio", {
        flujo: flujo,
        idInversion: idInversion,
      });
    } else if (focus === "Firma") {
      navigation.navigate("MiTankef");
    }
  };

  // Componente Visual
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
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
                // marginRight: // Descomentar si se regresa el titulo
                //   flujo === "Caja de ahorro"
                //     ? 55
                //     : flujo === "Crédito"
                //     ? -20
                //     : 10,
              },
            ]}
          >
            {flujo}
          </Text>
        </View>

        <View style={{ flex: 1 }}>
          <View style={styles.seccion}>
            <Text style={styles.tituloSeccion}>Firma de Contrato</Text>
            <Text style={styles.bodySeccion}>
              Selecciona el método para recibir y firmar los contratos.
            </Text>
          </View>
          {/* Firma Digital */}
          {/* <TouchableOpacity
            style={styles.container}
            onPress={() => [setFocus("Firma"), resetTimeout()]}
          >
            <View
              style={[
                styles.imagenConcepto,
                { backgroundColor: focus === "Firma" ? "#2FF690" : "#F0F0F0" },
              ]}
            >
              <MaterialCommunityIcons
                name="signature-freehand"
                size={35}
                color={focus === "Firma" ? "#060B4D" : "black"}
              />
            </View>
            <View style={{ marginLeft: 10, paddingRight: 65 }}>
              <Text style={styles.tituloConcepto}>Firma digital</Text>
              <Text style={styles.bodyConcepto}>
                La firma digital se realiza mediante una plataforma segura y
                confidencial para ambas partes.
              </Text>
            </View>
          </TouchableOpacity> */}

          {/* Presencial */}
          <TouchableOpacity
            style={styles.container}
            onPress={() => [setFocus("Presencial"), resetTimeout()]}
          >
            <View
              style={[
                styles.imagenConcepto,
                {
                  backgroundColor:
                    focus === "Presencial" ? "#2FF690" : "#F0F0F0",
                },
              ]}
            >
              <FontAwesome
                name="handshake-o"
                size={30}
                color={focus === "Presencial" ? "#060B4D" : "black"}
              />
            </View>
            <View style={{ marginLeft: 10, paddingRight: 65 }}>
              <Text style={styles.tituloConcepto}>Presencial</Text>
              <Text style={styles.bodyConcepto}>
                Se agenda una visita en nuestra oficina principal para la firma
                de contratos.
              </Text>
            </View>
          </TouchableOpacity>

          {/* Enviar a Domicilio */}
          <TouchableOpacity
            style={styles.container}
            onPress={() => [setFocus("Enviar"), resetTimeout()]}
          >
            <View
              style={[
                styles.imagenConcepto,
                { backgroundColor: focus === "Enviar" ? "#2FF690" : "#F0F0F0" },
              ]}
            >
              <MaterialCommunityIcons
                name="truck-fast-outline"
                size={40}
                color={focus === "Enviar" ? "#060B4D" : "black"}
              />
            </View>
            <View style={{ marginLeft: 10, paddingRight: 65 }}>
              <Text style={styles.tituloConcepto}>Enviar a Domicilio</Text>
              <Text style={styles.bodyConcepto}>
                Se envían los documentos a domicilio para la firma de los
                contratos.
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Boton de Aceptar */}
        <View>
          <TouchableOpacity
            style={[styles.botonContinuar, { marginBottom: 0 }]}
            onPress={() => handleSiguiente()}
          >
            <Text style={styles.textoBotonContinuar}>Aceptar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.botonContinuar,
              {
                backgroundColor: "white",
                marginBottom: 30,
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

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalPresencial}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Image
                style={{ width: 70, height: 70, marginBottom: 10 }}
                source={require("../../../assets/images/Presencial.png")}
              />
              <Text style={styles.modalText}>Presencial</Text>
              <Text style={styles.modalTextBody}>
                ¡Gracias por tu interés! Nos pondremos en contacto contigo para
                coordinar la firma del contrato en breve.
              </Text>
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                  style={[
                    styles.botonContinuar,
                    {
                      marginBottom: 0,
                      marginRight: 5,
                      flex: 1,
                      backgroundColor: "white",
                      borderColor: "#060B4D",
                      borderWidth: 1,
                    },
                  ]}
                  onPress={() => [setModalPresencial(false), resetTimeout()]}
                >
                  <Text
                    style={[styles.textoBotonContinuar, { color: "#060B4D" }]}
                  >
                    Cancelar
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.botonContinuar,
                    { marginBottom: 0, flex: 1, marginLeft: 5 },
                  ]}
                  onPress={() => handlePresencial()}
                >
                  <Text style={[styles.textoBotonContinuar]}>Aceptar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        {loading && (
          <View style={styles.overlay}>
            <ActivityIndicator size={75} color="#060B4D" />
          </View>
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
    textAlign: "center", // Ajuste para centrar el título, eliminar si se regresa el titulo
    fontSize: 24,
    color: "#060B4D",
    fontFamily: "opensanssemibold",
    fontWeight: "bold",
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
  container: {
    backgroundColor: "white",
    marginTop: 3,
    paddingVertical: 20,
    paddingHorizontal: 25,
    flexDirection: "row",
  },
  imagenConcepto: {
    alignSelf: "center",
    height: 60,
    width: 60,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  tituloConcepto: {
    fontSize: 16,
    color: "#060B4D",
    fontFamily: "opensansbold",
  },
  bodyConcepto: {
    fontSize: 14,
    color: "#060B4D",
    fontFamily: "opensans",
    textAlign: "justify",
  },
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
    padding: 20,
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

export default DefinirFirma;
