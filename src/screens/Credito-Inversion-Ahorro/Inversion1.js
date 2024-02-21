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
import BulletPointText from "../../components/BulletPointText";
import { Feather } from "@expo/vector-icons";

// Se mide la pantalla para determinar medidas
const screenWidth = Dimensions.get("window").width;
const widthFourth = screenWidth / 4 - 15;

const Inversion1 = ({ navigation }) => {
  // Estados y Contexto
  const [text, setText] = useState("$0.00");
  const [focusTab, setFocusTab] = useState("6");

  // Función para manejar el cambio de texto
  const handleChangeText = (inputText) => {
    const newText = inputText.charAt(0) === "$" ? inputText : `$${inputText}`;
    setText(newText);
  };

  // Función para manejar el evento onBlur
  const handleBlur = () => {
    // Si el texto es igual al signo de dólar o está vacío, se establece a "$0.00"
    if (text === "$" || text === "") {
      setText("$0.00");
    }
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
        <View style={{ alignItems: "center", paddingVertical: 30 }}>
          <Text
            style={{
              fontFamily: "opensanssemibold",
              fontSize: 20,
              color: "#060B4D",
            }}
          >
            Total de la inversión
          </Text>
          <Text
            style={{
              fontFamily: "opensanssemibold",
              fontSize: 30,
              color: "#060B4D",
              marginTop: 10,
            }}
          >
            $105,400.00 MXN
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.contenedores}>
            <Text style={styles.texto}>Monto a Invertir</Text>
            <TextInput
              style={styles.input}
              onChangeText={handleChangeText}
              value={text}
              onBlur={handleBlur}
              maxLength={20}
              keyboardType="numeric"
            />
          </View>
          <View style={[styles.contenedores, { marginTop: 2 }]}>
            <Text style={styles.texto}>Plazo de Inversión</Text>
            <View
              style={{
                flexDirection: "row",
                marginLeft: -5,
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                style={[
                  styles.tab,
                  { backgroundColor: focusTab === "6" ? "#2FF690" : "#F3F3F3" },
                ]}
                onPress={() => setFocusTab("6")}
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
                onPress={() => setFocusTab("12")}
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
                onPress={() => setFocusTab("18")}
              >
                <Text style={styles.textoTab}>18</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.tab,
                  {
                    backgroundColor: focusTab === "24" ? "#2FF690" : "#F3F3F3",
                  },
                ]}
                onPress={() => setFocusTab("24")}
              >
                <Text style={styles.textoTab}>24</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={styles.botonContinuar}
          onPress={() => navigation.navigate("Inversion2")}
        >
          <Text style={styles.textoBotonContinuar}>Simular Inversión</Text>
        </TouchableOpacity>
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
    paddingVertical: 10,
  },
  texto: {
    color: "#9c9db8ff",
    fontFamily: "opensanssemibold",
    fontSize: 18,
  },
  input: {
    marginTop: 3,
    fontSize: 18,
    width: "100%",
    color: "#060B4D",
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "white",
    fontFamily: "opensanssemibold",
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
});

export default Inversion1;
