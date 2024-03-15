// Importaciones de React Native y React
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React, { useState, useCallback, useEffect, useContext } from "react";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { AsYouType } from "libphonenumber-js";
import { useRoute } from "@react-navigation/native";
// Importaciones de Componentes y Hooks
import { CreditContext } from "../../hooks/CreditContext";
import ObligadoSolidario from "../../components/ObligadoSolidario";
import { Feather, Entypo, AntDesign } from "@expo/vector-icons";

// Se mide la pantalla para determinar medidas
const screenWidth = Dimensions.get("window").width;
const widthHalf = screenWidth / 2;

const ObligadosSolidarios = ({ navigation }) => {
  const route = useRoute();
  const { flujo } = route.params;
  // Estados y Contexto
  const { credit, setCredit } = useContext(CreditContext);
  const [disabled, setDisabled] = useState(true);

  // Efecto para deshabilitar el botón de continuar si no se han llenado todos los campos
  useEffect(() => {
    const camposLlenos =
      credit.domicilio !== "" &&
      credit.politico !== "" &&
      setDisabled(!camposLlenos);
  }, [credit.domicilio, credit.politico]);

  // Function to format the phone number as user types
  const formatPhoneNumber = (text, country) => {
    const formatter = new AsYouType(country);
    const formatted = formatter.input(text);
    setCredit({ ...credit, celular: text, celularShow: formatted });
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
        <Text style={styles.tituloPantalla}>{flujo}</Text>
        <TouchableOpacity>
          <Feather
            name="bell"
            size={25}
            color="#060B4D"
            style={{ marginTop: 50 }}
          />
        </TouchableOpacity>
      </View>

      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        scrollEnabled={true}
        enableOnAndroid={true}
        style={styles.scrollV}
        keyboardShouldPersistTaps="handled"
        enableAutomaticScroll={true}
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
          <ObligadoSolidario
            nombre={"Gabriel Edid Harari"}
            userID={10}
            imagen={require("../../../assets/images/Fotos_Personas/Antonio.png")}
            select={true}
          />
          <ObligadoSolidario
            nombre={"Natasha Ocasio Romanoff"}
            userID={11}
            imagen={require("../../../assets/images/Fotos_Personas/Natahsa.png")}
            select={true}
          />
          <ObligadoSolidario
            nombre={"Bruce García Banner"}
            userID={12}
            imagen={require("../../../assets/images/Fotos_Personas/Bruce.png")}
            select={false}
          />
        </View>
        {/* Boton de Continuar */}
        <View
          style={{
            paddingHorizontal: 10,
            marginBottom: 20,
            flexDirection: credit.paso === 1 ? "column" : "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* Botones de Atrás y Continuar */}
          {credit.paso !== 1 && (
            <TouchableOpacity
              style={[
                styles.botonContinuar,
                {
                  marginRight: 5,
                  flex: 1,
                  backgroundColor: "white",
                  borderColor: "#060B4D",
                  borderWidth: 1,
                },
              ]}
              onPress={() => [
                navigation.navigate("DefinirCredito", { flujo: "Crédito" }),
                setCredit({ ...credit, paso: 2 }),
              ]}
            >
              <Text style={[styles.textoBotonContinuar, { color: "#060B4D" }]}>
                Cancelar
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[
              styles.botonContinuar,
              {
                flex: 1,
                marginLeft: credit.paso === 1 ? 0 : 5,
                width: credit.paso === 1 && "80%", // Ensure width is consistent for the "Continuar" button
                backgroundColor: disabled ? "#D5D5D5" : "#060B4D",
              },
            ]}
            onPress={() => [
              navigation.navigate("DefinirCredito", { flujo: "Crédito" }),
              setCredit({ ...credit, paso: paso + 1 }),
            ]}
            disabled={disabled}
          >
            <Text
              style={[
                styles.textoBotonContinuar,
                { color: disabled ? "grey" : "white" },
              ]}
            >
              Continuar
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
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
    marginRight: 65,
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
    backgroundColor: "#060B4D",
    marginTop: 15,
    width: "80%",
    alignSelf: "center",
    borderRadius: 5,
  },
  textoBotonContinuar: {
    alignSelf: "center",
    color: "white",
    padding: 10,
    fontFamily: "opensanssemibold",
    fontSize: 16,
  },
});

export default ObligadosSolidarios;
