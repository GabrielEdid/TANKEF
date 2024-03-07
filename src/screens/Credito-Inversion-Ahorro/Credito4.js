// Importaciones de React Native y React
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useState, useCallback } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import MaskedView from "@react-native-masked-view/masked-view";
// Importaciones de Componentes y Hooks
import {
  Feather,
  MaterialCommunityIcons,
  FontAwesome,
} from "@expo/vector-icons";

// Se mide la pantalla para determinar medidas
const screenWidth = Dimensions.get("window").width;
const widthHalf = screenWidth / 2;

const Credito4 = ({ navigation }) => {
  // Estados y Contexto
  const [focus, setFocus] = useState("Firma");

  // Función para manejar el botón de Aceptar
  const handleSiguiente = () => {
    if (focus === "Presencial") {
      setModalPresencial(true);
    } else if (focus === "Enviar") {
      navigation.navigate("Inversion5");
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

        <View style={{ flex: 1 }}>
          <View style={styles.seccion}>
            <Text style={styles.tituloSeccion}>Firma de Contrato</Text>
            <Text style={styles.bodySeccion}>
              Selecciona el método para recibir y firmar los contratos.
            </Text>
          </View>
          {/* Firma Digital */}
          <TouchableOpacity
            style={styles.container}
            onPress={() => setFocus("Firma")}
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
          </TouchableOpacity>

          {/* Presencial */}
          <TouchableOpacity
            style={styles.container}
            onPress={() => setFocus("Presencial")}
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
            onPress={() => setFocus("Enviar")}
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
        <View style={{}}>
          <TouchableOpacity
            style={styles.botonContinuar}
            onPress={() => handleSiguiente()}
          >
            <Text style={styles.textoBotonContinuar}>Aceptar</Text>
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
    marginRight: 65,
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
  container: {
    backgroundColor: "white",
    marginTop: 5,
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
});

export default Credito4;
