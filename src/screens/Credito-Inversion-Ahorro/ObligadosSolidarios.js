// Importaciones de React Native y React
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
} from "react-native";
import React, { useState, useCallback, useEffect, useContext } from "react";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { ActivityIndicator } from "react-native-paper";
import { useRoute } from "@react-navigation/native";
// Importaciones de Componentes y Hooks
import { APIGet, APIPut } from "../../API/APIService";
import { useInactivity } from "../../hooks/InactivityContext";
import { FinanceContext } from "../../hooks/FinanceContext";
import ObligadoSolidario from "../../components/ObligadoSolidario";
import ModalEstatus from "../../components/ModalEstatus";
import { Feather, Entypo, AntDesign } from "@expo/vector-icons";

// Se mide la pantalla para determinar medidas
const screenWidth = Dimensions.get("window").width;
const widthHalf = screenWidth / 2;

const ObligadosSolidarios = ({ navigation }) => {
  const route = useRoute();
  const { flujo, idInversion } = route.params;
  // Estados y Contexto
  const { resetTimeout } = useInactivity();
  const { finance, setFinance, resetFinance } = useContext(FinanceContext);
  const [network, setNetwork] = useState([]);
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const sendObligados = async () => {
    resetTimeout();
    setDisabled(true);
    setLoading(true);
    console.log(
      "Agregando los obligados solidarios" + finance.obligados_solidarios
    );

    // Ahora si se mandan los obligados
    const url = `/api/v1/credits/${idInversion}`;

    try {
      const body = {
        credit: {
          authorizer_ids: finance.obligados_solidarios,
        },
      };

      const response = await APIPut(url, body);

      if (response.error) {
        console.error(
          "Error al agregar los obligados soldarios:",
          response.error
        );
        const errorMessages = response.error.errors
          ? Object.values(response.error.errors).flat().join(". ")
          : response.error;
        setLoading(false);
        console.error("Error al guardar la cuenta bancaria:", response.error);
        Alert.alert("Error", errorMessages);
      } else {
        console.log("Obligados Solidarios agregados exitosamente:", response);
        setModalVisible(true);
      }
    } catch (error) {
      console.error("Error en la petición:", error);
      Alert.alert("Error", "Ocurrió un error al procesar la solicitud.");
    } finally {
      setDisabled(false);
      setLoading(false);
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

  // Funcion para convertir la primera letra de cada palabra en mayúscula
  function titleCase(str) {
    return str
      .toLowerCase()
      .split(" ")
      .map(function (word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(" ");
  }

  // Efecto para deshabilitar el botón de continuar si no hay ningun obligado
  useEffect(() => {
    setDisabled(finance.obligados_solidarios.length === 0 ? true : false);
  }, [finance.obligados_solidarios]);

  // Llama a fetchNetwork cuando el componente se monta
  useEffect(() => {
    fetchNetwork();
  }, []);

  // Funcion para obtener los miembros de la red del usuario loggeado
  const fetchNetwork = async () => {
    const url = `/api/v1/network/members`;

    const result = await APIGet(url);

    if (result.error) {
      console.error("Error al obtener la red del usuario:", result.error);
    } else {
      const filteredResults = result.data.data.sort((a, b) => b.id - a.id);
      console.log("Resultados de la red:", filteredResults);
      setNetwork(filteredResults);
    }
  };

  // Componente Visual
  return (
    <View style={{ flex: 1 }}>
      {/* Titulo, Nombre de Pantalla y Campana */}
      <View style={styles.tituloContainer}>
        {/* <MaskedView
          style={{ flex: 1 }}
          maskElement={<Text style={styles.titulo}>tankef</Text>}
        >
          <LinearGradient
            colors={["#2FF690", "#21B6D5"]}
            start={{ x: 0.8, y: 0.8 }}
            end={{ x: 0, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </MaskedView> */}
        <Text style={styles.tituloPantalla}>{flujo}</Text>
      </View>

      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        scrollEnabled={true}
        enableOnAndroid={true}
        style={styles.scrollV}
        keyboardShouldPersistTaps="handled"
        enableAutomaticScroll={true}
        onScroll={() => resetTimeout()}
        scrollEventThrottle={400}
      >
        <View style={styles.seccion}>
          <Text style={styles.tituloSeccion}>Obligados Solidarios</Text>
          <Text style={styles.bodySeccion}>
            Puedes seleccionar a un amigo o socio dentro de tu red financiera
            como tu obligado solidario. Estas personas, amigos o socios fungen
            como tus “avales” para la solicitud de tu crédito.
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          {network.map((network, index) => (
            <ObligadoSolidario
              key={index}
              userID={network.id}
              nombre={titleCase(network.full_name)}
              imagen={network.avatar ? network.avatar : imageMap["Blank"]}
              select={true}
              button={true}
            />
          ))}
        </View>
        {/* Boton de Continuar */}

        {/* Botones de Atrás y Continuar */}

        <TouchableOpacity
          style={[styles.botonContinuar, { marginBottom: 0 }]}
          onPress={() => sendObligados()}
          disabled={disabled}
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
      </KeyboardAwareScrollView>
      <ModalEstatus
        titulo={"¡Atención!"}
        texto={
          "Se ha enviado la invitacion a los obligados solidarios seleccionados. Espera su respuesta para continuar."
        }
        imagen={"Alert"}
        visible={modalVisible}
        onAccept={() => [
          setModalVisible(false),
          resetFinance(),
          navigation.navigate("MiTankef"),
        ]}
      />
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
    // marginRight: 85, // Descomentar si se regresa el titulo
    textAlign: "center", // Ajuste para centrar el título, eliminar si se regresa el titulo
    fontSize: 24,
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
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ObligadosSolidarios;
