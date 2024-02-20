// Importaciones de React Native y React
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
// Importaciones de Componentes y Hooks
import { APIGet } from "../../API/APIService";
import { Feather } from "@expo/vector-icons";
import StackedImages from "../../components/StackedImages";
import MiTankefCredito from "../../components/MiTankefCredito";
import MiTankefInversion from "../../components/MiTankefInversion";
import MiTankefCaja from "../../components/MiTankefCaja";
import MiTankefObligado from "../../components/MiTankefObligado";

// Se mide la pantalla para determinar medidas
const screenWidth = Dimensions.get("window").width;
const widthHalf = screenWidth / 2;

const Inversion1 = () => {
  // Estados y Contexto
  const [focus, setFocus] = useState("Credito");
  const [dashboard, setDashboard] = useState({});
  const [secondFocus, setSecondFocus] = useState("Detalle");

  // Mapa para cargar todas las imagenes
  const imageMap = {
    Blank: require("../../../assets/images/blankAvatar.jpg"),
    // ... más imágenes
  };

  // Función para obtener el Dashboard, datos generales del usuario
  const fetchDashboard = async () => {
    const url = "/api/v1/dashboard";
    const response = await APIGet(url);
    if (response.error) {
      console.error("Error al obtener el Dashboard:", response.error);
    } else {
      setDashboard(response.data);
    }
  };

  // Efecto para obtener el Dashboard al cargar la pantalla
  useFocusEffect(
    useCallback(() => {
      fetchDashboard();
    }, [])
  );

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
});

export default Inversion1;
