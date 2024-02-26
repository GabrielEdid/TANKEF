// Importaciones de React Native y React
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useState, useCallback } from "react";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
// Importaciones de Componentes y Hooks
import BulletPointTextSmall from "../../components/BulletPointTextSmall";
import { Feather } from "@expo/vector-icons";
import { set } from "date-fns";

// Se mide la pantalla para determinar medidas
const screenWidth = Dimensions.get("window").width;
const widthFourth = screenWidth / 4 - 15;

const Inversion1 = ({ navigation }) => {
  // Estados y Contexto
  const [monto, setMonto] = useState("0.00");
  const [montoCentavos, setMontoCentavos] = useState(0);
  const [plazo, setPlazo] = useState("");
  const [focusTab, setFocusTab] = useState("");

  const montoDisplay = (montoCentavos / 100)
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // Actualiza el monto basado en la entrada del usuario
  const handleMontoChange = (text) => {
    const numericValue = text.replace(/[^0-9]/g, ""); // Elimina todo excepto números
    setMontoCentavos(parseInt(numericValue, 10) || 0); // Actualiza el monto en centavos
  };

  // Lógica para manejar la eliminación de dígitos
  const handleBackspace = () => {
    setMontoCentavos(Math.floor(montoCentavos / 10)); // Elimina el último dígito
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
        <View
          style={{
            alignItems: "center",
            paddingVertical: 30,
            backgroundColor: "white",
            marginTop: 3,
          }}
        >
          <Text
            style={{
              fontFamily: "opensansbold",
              fontSize: 18,
              color: "#060B4D",
            }}
          >
            Retorno de inversión neto
          </Text>
          <Text
            style={{
              fontFamily: "opensanssemibold",
              fontSize: 34,
              color: "#8185a6ff",
              marginTop: 10,
            }}
          >
            $0.00 MXN
          </Text>
          <View
            style={{
              flexDirection: "row",
              marginLeft: -10,
              marginTop: 5,
            }}
          >
            <BulletPointTextSmall titulo="Rendimiento" body="$0.00" />
            <BulletPointTextSmall titulo="Impuesto" body="$0.00" />
            <BulletPointTextSmall titulo="Tasa de Interés" body="0%" />
          </View>
        </View>
        <View style={{ flex: 1, marginTop: 5, backgroundColor: "white" }}>
          <View style={styles.contenedores}>
            <Text style={styles.texto}>Monto de la inversión</Text>
            <Text style={styles.subTexto}>
              Por favor, introduce el monto que deseas invertir.
            </Text>
            <View style={styles.inputWrapper}>
              <Text
                style={[
                  styles.dollarSign,
                  { color: monto ? "#060B4D" : "#b3b5c9ff" },
                ]}
              >
                $
              </Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                maxLength={20}
                value={montoDisplay}
                placeholderTextColor={"#b3b5c9ff"}
                onChangeText={handleMontoChange}
                onKeyPress={({ nativeEvent }) => {
                  if (nativeEvent.key === "Backspace") {
                    handleBackspace();
                  }
                }}
                placeholder="0.00"
              />
            </View>
            <View style={styles.separacion} />

            <View
              style={{ backgroundColor: "#2FF690", padding: 5, marginTop: 10 }}
            >
              <Text style={[styles.subTexto, { marginTop: 0, fontSize: 13 }]}>
                Monto mínimo por inversión $5000.00 MXN
              </Text>
            </View>
            <Text style={[styles.texto, { marginTop: 20 }]}>
              Plazo de Inversión
            </Text>
            <Text style={[styles.subTexto]}>
              Ahora, selecciona el plazo de los pagos.
            </Text>
            <View
              style={{
                flexDirection: "row",
                marginLeft: -5,
                alignSelf: "center",
              }}
            >
              <TouchableOpacity
                style={[
                  styles.tab,
                  { backgroundColor: focusTab === "6" ? "#2FF690" : "#F3F3F3" },
                ]}
                onPress={() => [setFocusTab("6"), setPlazo(6)]}
              >
                <Text style={styles.textoTab}>6</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.tab,
                  {
                    backgroundColor: focusTab === "12" ? "#2FF690" : "#F3F3F3",
                  },
                ]}
                onPress={() => [setFocusTab("12"), setPlazo(12)]}
              >
                <Text style={styles.textoTab}>12</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.tab,
                  {
                    backgroundColor: focusTab === "18" ? "#2FF690" : "#F3F3F3",
                  },
                ]}
                onPress={() => [setFocusTab("18"), setPlazo(18)]}
              >
                <Text style={styles.textoTab}>18</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.tab,
                  {
                    backgroundColor: focusTab === "24" ? "#2FF690" : "#F3F3F3",
                    marginRight: 0,
                  },
                ]}
                onPress={() => [setFocusTab("24"), setPlazo(24)]}
              >
                <Text style={styles.textoTab}>24</Text>
              </TouchableOpacity>
            </View>
            <Text style={[styles.subTexto, { marginTop: 15, fontSize: 13 }]}>
              Esta es una cotización preliminar, la tasa definitiva dependerá
              del análisis completo de tu solicitud.
            </Text>
          </View>
        </View>
        <View style={{ backgroundColor: "white" }}>
          <TouchableOpacity
            style={[
              styles.botonContinuar,
              {
                backgroundColor:
                  monto && monto >= 5000 && plazo ? "#060B4D" : "#D5D5D5",
              },
            ]}
            onPress={() => navigation.navigate("Inversion2")}
            disabled={monto && monto >= 5000 && plazo ? false : true}
          >
            <Text
              style={[
                styles.textoBotonContinuar,
                { color: monto && monto >= 5000 && plazo ? "white" : "grey" },
              ]}
            >
              Aceptar
            </Text>
          </TouchableOpacity>
        </View>
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
  botonContinuar: {
    marginBottom: 5,
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
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: "center",
  },
  texto: {
    color: "#060B4D",
    textAlign: "center",
    fontFamily: "opensanssemibold",
    fontSize: 18,
  },
  subTexto: {
    color: "#060B4D",
    textAlign: "center",
    fontFamily: "opensans",
    marginTop: 5,
    fontSize: 14,
  },
  inputWrapper: {
    flexDirection: "row",
    paddingHorizontal: 10,
    alignItems: "center",
    alignContent: "center",
  },
  dollarSign: {
    fontSize: 24,
    fontFamily: "opensanssemibold",
  },
  input: {
    paddingVertical: 8,
    fontSize: 24,
    color: "#060B4D",
    marginTop: 10,
    marginBottom: 10,
    fontFamily: "opensanssemibold",
  },
  separacion: {
    height: 1,
    width: "100%",
    backgroundColor: "#cecfdbff",
  },
  tab: {
    marginTop: 10,
    padding: 10,
    width: widthFourth,
    borderRadius: 5,
    marginRight: 10,
  },
  textoTab: {
    textAlign: "center",
    fontFamily: "opensanssemibold",
    fontSize: 18,
  },
  botonContinuar: {
    marginBottom: 20,
    width: "80%",
    alignSelf: "center",
    borderRadius: 5,
  },
  textoBotonContinuar: {
    alignSelf: "center",
    padding: 10,
    fontFamily: "opensanssemibold",
    fontSize: 16,
  },
});

export default Inversion1;
