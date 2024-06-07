// Importaciones de React Native y React
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import React, { useState, useCallback, useContext } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
// Importaciones de Componentes y Hooks
import { UserContext } from "../../hooks/UserContext";
import { APIGet } from "../../API/APIService";
import { Feather } from "@expo/vector-icons";
import { useInactivity } from "../../hooks/InactivityContext";
import StackedImages from "../../components/StackedImages";
import MiTankefCredito from "../../components/MiTankefCredito";
import MiTankefInversion from "../../components/MiTankefInversion";
import MiTankefCaja from "../../components/MiTankefCaja";
import MiTankefObligado from "../../components/MiTankefObligado";

// Se mide la pantalla para determinar medidas
const screenWidth = Dimensions.get("window").width;
const widthHalf = screenWidth / 2;

const MiTankef = () => {
  // Estados y Contexto
  const { resetTimeout } = useInactivity();
  const { user, setUser } = useContext(UserContext);
  const [focus, setFocus] = useState("Credito");
  const [secondFocus, setSecondFocus] = useState("Detalle");

  // Mapa para cargar todas las imagenes
  const imageMap = {
    Blank: require("../../../assets/images/blankAvatar.jpg"),
    // ... más imágenes
  };

  // Función para obtener el Dashboard, datos generales del usuario
  // const fetchDashboard = async () => {
  //   const url = "/api/v1/dashboard";
  //   const response = await APIGet(url);
  //   if (response.error) {
  //     console.error("Error al obtener el Dashboard:", response.error);
  //   } else {
  //     setUser({ ...user, valorRed: response.data.data.value_network });
  //   }
  // };

  // Efecto para obtener el Dashboard al cargar la pantalla
  // useFocusEffect(
  //   useCallback(() => {
  //     fetchDashboard();
  //   }, [])
  // );

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
        <Text style={styles.tituloPantalla}>Mi Tankef</Text>
        {/* <TouchableOpacity>
          <Feather
            name="bell"
            size={25}
            color="#060B4D"
            style={{ marginTop: 50 }}
          />
        </TouchableOpacity> */}
      </View>

      {/* Cuadro con Valor de la Red y las imagenes de los usuarios en la red */}
      <View style={{ marginTop: 3, backgroundColor: "white" }}>
        <Text style={styles.textoValorRed}>Valor general de tu red</Text>
        <Text style={styles.valorRed}>
          {formatAmount(user.valorRed) + " "}
          MXN
        </Text>
        {/* Componente de Imagenes de los usuarios en la red */}
        <StackedImages />
      </View>

      {/* Primera Barra de Tabs, al precionar cualquiera, cambia el estado y la visualización */}
      <View style={styles.tabsContainer}>
        {/* Boton Tab Credito */}
        <TouchableOpacity
          style={[
            styles.tabButton,
            { backgroundColor: focus === "Credito" ? "#2FF690" : "#F3F3F3" },
          ]}
          onPress={() => [setFocus("Credito"), resetTimeout()]}
        >
          <Text
            style={[
              styles.tabText,
              { color: focus === "Credito" ? "#060B4D" : "#9596AF" },
            ]}
          >
            Crédito
          </Text>
        </TouchableOpacity>

        {/* Boton Tab Inversion */}
        <TouchableOpacity
          style={[
            styles.tabButton,
            { backgroundColor: focus === "Inversion" ? "#2FF690" : "#F3F3F3" },
          ]}
          onPress={() => [setFocus("Inversion"), resetTimeout()]}
        >
          <Text
            style={[
              styles.tabText,
              { color: focus === "Inversion" ? "#060B4D" : "#9596AF" },
            ]}
          >
            Inversión
          </Text>
        </TouchableOpacity>

        {/* Boton Tab Caja Ahorro */}
        <TouchableOpacity
          style={[
            styles.tabButton,
            { backgroundColor: focus === "Caja" ? "#2FF690" : "#F3F3F3" },
          ]}
          onPress={() => [setFocus("Caja"), resetTimeout()]}
        >
          <Text
            style={[
              styles.tabText,
              { color: focus === "Caja" ? "#060B4D" : "#9596AF" },
            ]}
          >
            Caja Ahorro
          </Text>
        </TouchableOpacity>

        {/* Boton Tab Obligado S. */}
        <TouchableOpacity
          style={[
            styles.tabButton,
            { backgroundColor: focus === "Obligado" ? "#2FF690" : "#F3F3F3" },
          ]}
          onPress={() => [setFocus("Obligado"), resetTimeout()]}
        >
          <Text
            style={[
              styles.tabText,
              { color: focus === "Obligado" ? "#060B4D" : "#9596AF" },
            ]}
          >
            Obligado S.
          </Text>
        </TouchableOpacity>
      </View>

      {/* Se llaman los respectivos componentes segun los estados de los dos tabs anteriores */}
      <ScrollView
        style={{ marginTop: 5 }}
        onScroll={() => resetTimeout()}
        scrollEventThrottle={400}
      >
        {focus === "Credito" && secondFocus === "Detalle" && (
          <MiTankefCredito />
        )}
        {focus === "Inversion" && secondFocus === "Detalle" && (
          <MiTankefInversion />
        )}
        {focus === "Caja" && secondFocus === "Detalle" && <MiTankefCaja />}
        {focus === "Obligado" && secondFocus === "Detalle" && (
          <MiTankefObligado />
        )}
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
    marginRight: 112.5,
    fontSize: 24,
    color: "#060B4D",
    fontFamily: "opensanssemibold",
    fontWeight: "bold",
  },
  textoValorRed: {
    textAlign: "center",
    fontFamily: "opensansbold",
    fontSize: 14,
    color: "#060B4D",
    marginTop: 10,
  },
  valorRed: {
    textAlign: "center",
    fontFamily: "opensansbold",
    fontSize: 30,
    color: "#060B4D",
  },
  imagen: {
    alignSelf: "center",
    height: 50,
    width: 50,
    borderRadius: 25,
    marginTop: 3,
    marginBottom: 20,
  },
  //Estilos para la primera barra de Tabs
  tabsContainer: {
    marginTop: 3,
    backgroundColor: "white",
    flexDirection: "row",
    paddingVertical: 5,
    paddingHorizontal: 5,
    justifyContent: "space-between",
  },
  tabButton: {
    alignItems: "center",
    borderRadius: 5,
    paddingVertical: 10,
    marginHorizontal: 3,
    flex: 1,
  },
  tabText: {
    fontFamily: "opensanssemibold",
    fontSize: 14,
    textAlign: "center",
  },
  //Estilos para la segunda barra de Tabs
  secondTabsContainer: {
    marginTop: 3,
    backgroundColor: "white",
    flexDirection: "row",
    paddingTop: 16,
    justifyContent: "space-between",
  },
  secondTabButton: {
    alignItems: "center",
    paddingVertical: 0,
    flex: 1,
  },
  secondTabText: {
    fontFamily: "opensansbold",
    fontSize: 16,
    textAlign: "center",
  },
  focusLine: {
    height: 4,
    width: widthHalf,
    marginTop: 12,
    backgroundColor: "#060B4D",
  },
});

export default MiTankef;
