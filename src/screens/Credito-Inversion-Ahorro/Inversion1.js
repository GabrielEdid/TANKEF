// Importaciones de React Native y React
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
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
  const [focus, setFocus] = useState("Documentacion");

  // Mapa para cargar todas las imagenes
  const imageMap = {
    Blank: require("../../../assets/images/blankAvatar.jpg"),
    // ... más imágenes
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

      {focus === "Documentacion" && (
        <>
          <View
            style={{
              marginTop: 5,
              backgroundColor: "white",
              alignItems: "center",
              padding: 15,
            }}
          >
            <Text
              style={{
                fontSize: 25,
                color: "#060B4D",
                fontFamily: "opensanssemibold",
              }}
            >
              Documentación
            </Text>
            <Text
              style={{
                marginTop: 10,
                marginBottom: 10,
                fontSize: 14,
                color: "#060B4D",
                fontFamily: "opensanssemibold",
                textAlign: "center",
              }}
            >
              Para agilizar el proceso te recomendamos tener los siguientes
              documentos a la mano.
            </Text>
          </View>
          <View
            style={{
              marginTop: 5,
              backgroundColor: "white",
              paddingBottom: 15,
              flex: 1,
            }}
          >
            <View style={{ flex: 1 }}>
              <BulletPointText
                titulo="INE"
                body="Identificación oficial actualizada"
              />
              <BulletPointText titulo="CURP" body="Documento actualizado" />
              <BulletPointText
                titulo="Constancia de situación fiscal"
                body="Identificación oficial actualizada"
              />
              <BulletPointText
                titulo="Comprobante de Domicilio"
                body="Documento actualizado"
              />
              <BulletPointText
                titulo="No. de Cuenta Bancaria"
                body="Cuenta a la cuál se deberá depositar"
              />
              <BulletPointText
                titulo="Comprobante de No. de Cuenta Bancaria"
                body="Documento actualizado"
              />
              <BulletPointText titulo="CLABE" body="CLABE Interbancaria" />
              <BulletPointText titulo="Banco" body="Nombre de Banco" />
            </View>
            <TouchableOpacity
              style={styles.botonContinuar}
              onPress={() => setFocus("Beneficiarios")}
            >
              <Text style={styles.textoBotonContinuar}>Continuar</Text>
            </TouchableOpacity>
          </View>
        </>
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
});

export default Inversion1;
