// Importaciones de React Native y React
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Modal,
  Alert,
} from "react-native";
import React, { useState, useCallback, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useFocusEffect, useRoute } from "@react-navigation/native";
// Importaciones de Componentes y Hooks
import { APIGet } from "../../API/APIService";
import { useInactivity } from "../../hooks/InactivityContext";
import { Feather, MaterialIcons, FontAwesome } from "@expo/vector-icons";

// Se mide la pantalla para determinar medidas
const screenWidth = Dimensions.get("window").width;
const widthHalf = screenWidth / 2;

const OrdenPago = ({ navigation }) => {
  const route = useRoute();
  const { flujo, idInversion } = route.params;
  // Estados y Contexto
  const { resetTimeout } = useInactivity();
  const [beneficiario, setBeneficiario] = useState(false);
  const [institucion, setInstitucion] = useState(false);
  const [cuentaClabe, setCuentaClabe] = useState(false);
  const [referencia, setReferencia] = useState(false);
  const [monto, setMonto] = useState(false);

  // Obtener la orden de pago del usuario
  const fetchOrden = async () => {
    const url = `/api/v1/investments/${idInversion}`;

    const result = await APIGet(url);

    if (result.error) {
      console.error(
        "Error al obtener la orden de pago del usuario:",
        result.error
      );
      Alert.alert("Error", "Error al obtener la orden de pago.");
    } else {
      console.log(
        "Resultado de la orden de pago del usuario:",
        result.data.data.stp_account
      );
      setBeneficiario(titleCase(result.data.data.stp_account.beneficiary));
      setInstitucion(result.data.data.stp_account.institution);
      setCuentaClabe(result.data.data.stp_account.clabe);
      setReferencia(result.data.data.stp_account.reference);
      setMonto(formatAmount(result.data.data.stp_account.amount));
    }
  };

  // Efecto para obtener las cuentas bancarias del usuario
  useFocusEffect(
    useCallback(() => {
      fetchOrden();
    }, [])
  );

  // Función para convertir la primera letra de cada palabra en mayúscula
  function titleCase(str) {
    return str
      .toLowerCase()
      .split(" ")
      .map(function (word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(" ");
  }

  // Formatea un monto a pesos mexicanos
  const formatAmount = (amount) => {
    const number = parseFloat(amount);
    return `${number.toLocaleString("es-MX", {
      style: "currency",
      currency: "MXN",
    })}`;
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
            start={{ x: 0.8, y: 0.8 }}
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

      <View style={{ flex: 1 }}>
        <KeyboardAwareScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          scrollEnabled={false}
          enableOnAndroid={true}
          style={styles.scrollV}
          keyboardShouldPersistTaps="handled"
          extraScrollHeight={100}
          onScroll={() => resetTimeout()}
          scrollEventThrottle={400}
        >
          <View style={{ flex: 1 }}>
            <View style={styles.seccion}>
              <Text style={styles.tituloSeccion}>Orden de pago</Text>
              <Text style={styles.bodySeccion}>
                Se recibieron los contratos firmados, ahora debes realizar el
                depósito de tu inversión
              </Text>
            </View>
            <View
              style={{
                marginTop: 5,
                backgroundColor: "white",
                paddingTop: 15,
              }}
            >
              {/* Campos para introducir los datos bancarios */}
              <Text style={styles.tituloCampo}>Nombre del Beneficiario</Text>
              <Text style={styles.input}>{beneficiario}</Text>
              <View style={styles.separacion} />

              <Text style={styles.tituloCampo}>Institución</Text>
              <Text style={styles.input}>{institucion}</Text>
              <View style={styles.separacion} />

              <Text style={styles.tituloCampo}>Cuenta clabe</Text>
              <Text style={styles.input}>{cuentaClabe}</Text>
              <View style={styles.separacion} />

              <Text style={styles.tituloCampo}>Referencia</Text>
              <Text style={styles.input}>{referencia}</Text>
              <View style={styles.separacion} />

              <Text style={styles.tituloCampo}>Monto a depositar</Text>
              <Text style={styles.input}>{monto} MXN</Text>
              <View style={styles.separacion} />
            </View>
          </View>
        </KeyboardAwareScrollView>
        {/* Boton de Aceptar */}
        <TouchableOpacity
          style={styles.botonContinuar}
          onPress={() => [navigation.navigate("MiTankef"), resetTimeout()]}
        >
          <Text style={styles.textoBotonContinuar}>Aceptar</Text>
        </TouchableOpacity>
      </View>
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
    color: "#9c9db8",
    fontFamily: "opensanssemibold",
  },
  input: {
    paddingLeft: 15,
    fontSize: 16,
    width: "100%",
    color: "#060B4D",
    marginBottom: 10,
    fontFamily: "opensanssemibold",
  },
  separacion: {
    height: 1,
    width: "100%",
    backgroundColor: "#cecfdbff",
  },
  botonContinuar: {
    marginTop: 15,
    marginBottom: 30,
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
  // Estilos del Modal
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
    padding: 35,
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
});

export default OrdenPago;
