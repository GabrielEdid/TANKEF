// Importaciones de React Native y React
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState, useCallback } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import MaskedView from "@react-native-masked-view/masked-view";
// Importaciones de Componentes y Hooks
import BulletPointText from "../../components/BulletPointText";
import { Feather } from "@expo/vector-icons";

// Se mide la pantalla para determinar medidas
const screenWidth = Dimensions.get("window").width;
const widthHalf = screenWidth / 2;

const Inversion3 = () => {
  // Estados y Contexto
  const [focus, setFocus] = useState("Documentacion");
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [parentesco, setParentesco] = useState("");
  const [telefono, setTelefono] = useState("");
  const [porcentaje, setPorcentaje] = useState("");

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

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
        >
          <View style={styles.seccion}>
            <Text style={styles.tituloSeccion}>Datos Bancarios</Text>
            <Text style={styles.bodySeccion}>
              En caso de un imprevisto, es importante asegurarse de que tus
              bienes financieros se transfieran de manera rápida y eficiente a
              las personas que más te importan.
            </Text>
          </View>
          <View
            style={{
              marginTop: 5,
              backgroundColor: "white",
              paddingVertical: 15,
              flex: 1,
            }}
          >
            {/* Campos para introducir los datos del primer beneficiario */}
            <Text
              style={{
                fontSize: 20,
                paddingLeft: 15,
                color: "#060B4D",
                fontFamily: "opensanssemibold",
              }}
            >
              Primer Beneficiario
            </Text>
            <Text style={styles.tituloCampo}>Nombre(s)</Text>
            <TextInput
              style={styles.input}
              onChangeText={setNombre}
              value={nombre}
            />
            <View style={styles.separacion} />

            <Text style={styles.tituloCampo}>Apellidos</Text>
            <TextInput
              style={styles.input}
              onChangeText={setApellidos}
              value={apellidos}
            />
            <View style={styles.separacion} />

            <Text style={styles.tituloCampo}>Parentesco</Text>
            <TextInput
              style={styles.input}
              onChangeText={setParentesco}
              value={parentesco}
            />
            <View style={styles.separacion} />

            <Text style={styles.tituloCampo}>Teléfono</Text>
            <TextInput
              style={styles.input}
              onChangeText={setTelefono}
              value={telefono}
            />
            <View style={styles.separacion} />

            <Text style={styles.tituloCampo}>Porcentaje</Text>
            <TextInput
              style={styles.input}
              onChangeText={setPorcentaje}
              value={porcentaje}
            />
            <View style={styles.separacion} />
          </View>

          {/* Boton de Aceptar */}
          <View style={{ backgroundColor: "white" }}>
            <TouchableOpacity
              style={styles.botonContinuar}
              onPress={() => setFocus("Documentacion")}
            >
              <Text style={styles.textoBotonContinuar}>Aceptar</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
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
    textAlign: "justify",
  },
  tituloCampo: {
    marginTop: 10,
    paddingLeft: 15,
    marginBottom: 10,
    fontSize: 17,
    color: "#9c9db8ff",
    fontFamily: "opensanssemibold",
  },
  input: {
    paddingLeft: 15,
    fontSize: 17,
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
    marginBottom: 15,
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

export default Inversion3;
