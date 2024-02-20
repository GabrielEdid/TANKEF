// Importaciones de React Native y React
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  TextInput,
} from "react-native";
import React, { useState, useCallback } from "react";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
// Importaciones de Componentes y Hooks
import BulletPointText from "../../components/BulletPointText";
import { Feather } from "@expo/vector-icons";

// Se mide la pantalla para determinar medidas
const screenWidth = Dimensions.get("window").width;
const widthHalf = screenWidth / 2;

const Inversion1 = () => {
  // Estados y Contexto
  const [text, setText] = useState("");

  // Componente Visual
  return (
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
      <View
        style={{
          backgroundColor: "white",
          paddingHorizontal: 20,
          paddingVertical: 10,
        }}
      >
        <Text
          style={{
            color: "#9c9db8ff",
            fontFamily: "opensanssemibold",
            fontSize: 16,
          }}
        >
          Monto a Invertir
        </Text>
        <TextInput
          style={styles.input}
          placeholder="$0.00"
          placeholderTextColor="#060B4D"
          onChangeText={setText}
          multiline={true}
          value={text}
          maxLength={500}
        />
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
  input: {
    marginTop: 3,
    fontSize: 12,
    flex: 1,
    width: "100%",
    height: "100%",
    textAlignVertical: "top",
    backgroundColor: "white",
    fontFamily: "opensans",
  },
});

export default Inversion1;
