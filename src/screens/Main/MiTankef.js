// Importaciones de React Native y React
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
// Importaciones de Componentes y Hooks
import { Feather } from "@expo/vector-icons";
import StackedImages from "../../components/StackedImages";
import MiTankefCredito from "../../components/MiTankefCredito";
import MiTankefInversion from "../../components/MiTankefInversion";
import MiTankefCaja from "../../components/MiTankefCaja";
import MiTankefObligado from "../../components/MiTankefObligado";
//import MovimientoCredito from "../../components/Componentes Olvidados/MovimientoCredito";
//import MovimientoInversion from "../../components/Componentes Olvidados/MovimientoInversion";

const screenWidth = Dimensions.get("window").width;
const widthHalf = screenWidth / 2;

const MiTankef = ({ navigation }) => {
  // Estados y Contexto
  const [focus, setFocus] = useState("Credito");
  const [secondFocus, setSecondFocus] = useState("Detalle");

  const imageMap = {
    Natasha: require("../../../assets/images/Fotos_Personas/Natahsa.png"),
    Quill: require("../../../assets/images/Fotos_Personas/Quill.png"),
    Clint: require("../../../assets/images/Fotos_Personas/Clint.png"),
    Antonio: require("../../../assets/images/Fotos_Personas/Antonio.png"),
    Steve: require("../../../assets/images/Fotos_Personas/Steve.png"),
    Test: require("../../../assets/images/Test.png"),
    Blank: require("../../../assets/images/blankAvatar.jpg"),
    Sliders: require("../../../assets/images/Sliders.png"),
    // ... más imágenes
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.tituloContainer}>
        {/* Titulo */}
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
        <TouchableOpacity>
          <Feather
            name="bell"
            size={25}
            color="#060B4D"
            style={{ marginTop: 50 }}
          />
        </TouchableOpacity>
      </View>
      <View style={{ marginTop: 3, backgroundColor: "white" }}>
        <Text style={styles.textoValorRed}>Valor de tu Red (MXN)</Text>
        <Text style={styles.valorRed}>$120,000.00</Text>
        <StackedImages />
      </View>

      {/* Primera Barra de Tabs */}
      <View style={styles.tabsContainer}>
        {/* Boton Tab Credito */}
        <TouchableOpacity
          style={[
            styles.tabButton,
            { backgroundColor: focus === "Credito" ? "#2FF690" : "#F3F3F3" },
          ]}
          onPress={() => setFocus("Credito")}
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
          onPress={() => setFocus("Inversion")}
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
          onPress={() => setFocus("Caja")}
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
          onPress={() => setFocus("Obligado")}
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

      {/* Segunda Barra de Tabs */}
      <View style={styles.secondTabsContainer}>
        {/* Boton Tab Detalle */}
        <TouchableOpacity
          style={styles.secondTabButton}
          onPress={() => setSecondFocus("Detalle")}
        >
          <Text
            style={[
              styles.secondTabText,
              {
                color: secondFocus === "Detalle" ? "#060B4D" : "#9596AF",
                fontFamily:
                  secondFocus === "Detalle"
                    ? "opensansbold"
                    : "opensanssemibold",
              },
            ]}
          >
            Detalle
          </Text>
          {secondFocus === "Detalle" ? <View style={styles.focusLine} /> : null}
        </TouchableOpacity>
        {/* Boton Tab Movimientos */}
        <TouchableOpacity
          style={styles.secondTabButton}
          onPress={() => setSecondFocus("Movimientos")}
        >
          <Text
            style={[
              styles.secondTabText,
              {
                color: secondFocus === "Movimientos" ? "#060B4D" : "#9596AF",
                fontFamily:
                  secondFocus === "Movimientos"
                    ? "opensansbold"
                    : "opensanssemibold",
              },
            ]}
          >
            Movimientos
          </Text>
          {secondFocus === "Movimientos" ? (
            <View style={styles.focusLine} />
          ) : null}
        </TouchableOpacity>
      </View>

      <View style={{ marginTop: 5 }}>
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
      </View>
    </View>
  );
};

{
  /*export default class Movimientos extends Component {
  constructor(props) {
    super(props);

    this.state = { isCreditos: false, isInversiones: true };
  }

  updateCounter() {
    this.setState({ counter: this.state.counter + 1 });
  }

  render() {
    return (
      <View style={styles.background}>
        {/* Titulo 
        <View style={{ height: 120 }}>
          <Text style={styles.titulo}>TANKEF</Text>
        </View>
        <View
          style={{
            height: 70,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity
            style={[
              styles.verInversiones,
              !this.state.isInversiones
                ? { borderColor: "#29364d", borderWidth: 2 }
                : {},
            ]}
            onPress={() =>
              this.setState({ isCreditos: false, isInversiones: true })
            }
          >
            <LinearGradient
              colors={
                this.state.isInversiones
                  ? ["#2FF690", "#21B6D5"]
                  : ["white", "white"]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.linearGradientInversiones}
            >
              <Text
                style={[
                  styles.textoBoton,
                  { color: this.state.isInversiones ? "white" : "#29364d" },
                ]}
              >
                INVERSIONES
              </Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.verCreditos,
              !this.state.isCreditos
                ? { borderColor: "#29364d", borderWidth: 2 }
                : {},
            ]}
            onPress={() =>
              this.setState({ isCreditos: true, isInversiones: false })
            }
          >
            <LinearGradient
              colors={
                this.state.isCreditos
                  ? ["#2FF690", "#21B6D5"]
                  : ["white", "white"]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.linearGradientCreditos}
            >
              <Text
                style={[
                  styles.textoBoton,
                  { color: this.state.isCreditos ? "white" : "#29364d" },
                ]}
              >
                CREDITOS
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Seccion de los Creditos del Usuario 
        {this.state.isCreditos && (
          <View style={{ flex: 1 }}>
            <Image
              style={styles.imagenCredito}
              source={require("../../../assets/images/Credito.png")}
            />
            <Text style={styles.texto}>Mis Créditos</Text>

            <View style={{ flex: 1, marginTop: 12 }}>
              <ScrollView style={{ flex: 1 }}>
                <MovimientoCredito
                  tag={["TANKEF", "En Espera"]}
                  titulo="Pago de Tarjeta de Crédito"
                  fecha="14 Nov 9:08 AM"
                  body="$9,000.00"
                />
                <MovimientoCredito
                  tag={["TANKEF", "Completado"]}
                  titulo="Préstamo Colegiatura"
                  fecha="20 Sep 11:08 AM"
                  body="$16,500.00"
                />
              </ScrollView>
            </View>

            {/* Boton de Nuevo Crédito y Ver Más 
            <View
              style={{
                height: 80,
                marginLeft: 20,
                marginRight: 20,
                alignSelf: "stretch",
              }}
            >
              <TouchableOpacity style={styles.boton}>
                <LinearGradient
                  colors={["#2FF690", "#21B6D5"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.botonGradient}
                >
                  <Text style={[styles.textoBoton, { fontSize: 20 }]}>
                    NUEVO CRÉDITO
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
            {/* Boton de VerMas
            {/*<TouchableOpacity style={styles.verMas}>
          <Text style={styles.textoVerMas}>VER MÁS</Text>
        </TouchableOpacity>
          </View>
        )}

        {/* Seccion de las Inversiones del Usuario 
        {this.state.isInversiones && (
          <View style={{ flex: 1 }}>
            <Image
              style={styles.imagenInvertir}
              source={require("../../../assets/images/Invertir.png")}
            />
            <Text style={[styles.texto, { width: 150 }]}>Mis Inversiones</Text>

            <View style={{ flex: 1, marginTop: 12 }}>
              <ScrollView style={{ flex: 1 }}>
                <MovimientoInversion
                  tag={["13.20%", "En Curso"]}
                  titulo="Reinversión: Ahorro Aguinaldo"
                  fecha="14 Nov 9:08 AM"
                  actual="$18,195.00"
                  inicial="$16,325.00"
                />
                <MovimientoInversion
                  tag={["13.20%", "Completado"]}
                  titulo="Reinversión: Ahorro Aguinaldo"
                  fecha="14 Nov 9:08 AM"
                  actual="$18,195.00"
                  inicial="$16,325.00"
                />
                <MovimientoInversion
                  tag={["13.20%", "Completado"]}
                  titulo="Reinversión: Ahorro Aguinaldo"
                  fecha="14 Nov 9:08 AM"
                  actual="$18,195.00"
                  inicial="$16,325.00"
                />
                <MovimientoInversion
                  tag={["13.51%", "Completado"]}
                  titulo="Ahorro Aguinaldo"
                  fecha="20 Sep 11:08 AM"
                  actual="$16,325.00"
                  inicial="$15,000.00"
                />
              </ScrollView>
            </View>

            {/* Boton de Invertir y Ver Más 
            <View
              style={{
                height: 80,
                marginLeft: 20,
                marginRight: 20,
                alignSelf: "stretch",
                marginTop: 5,
              }}
            >
              <TouchableOpacity style={styles.boton}>
                <LinearGradient
                  colors={["#2FF690", "#21B6D5"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.botonGradient}
                >
                  <Text style={[styles.textoBoton, { fontSize: 20 }]}>
                    INVERTIR
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
            {/* Boton de VerMas
            {/* <TouchableOpacity style={[styles.verMas, { marginTop: 730 }]}>
          <Text style={styles.textoVerMas}>VER MÁS</Text>
        </TouchableOpacity> 
          </View>
        )}
      </View>
    );
  }
} */
}

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
  textoValorRed: {
    textAlign: "center",
    fontFamily: "opensansbold",
    fontSize: 16,
    color: "#060B4D",
    marginTop: 20,
  },
  valorRed: {
    textAlign: "center",
    fontFamily: "opensansbold",
    fontSize: 35,
    color: "#060B4D",
    marginTop: 0,
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
    paddingVertical: 10,
    justifyContent: "space-between",
  },
  tabButton: {
    alignItems: "center",
    borderRadius: 100,
    paddingVertical: 10,
    marginHorizontal: 7,
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
    paddingTop: 19,
    justifyContent: "space-between",
  },
  secondTabButton: {
    alignItems: "center",
    paddingVertical: 0,
    flex: 1,
  },
  secondTabText: {
    fontFamily: "opensansbold",
    fontSize: 18,
    textAlign: "center",
  },
  focusLine: {
    height: 4,
    width: widthHalf,
    marginTop: 15,
    backgroundColor: "#060B4D",
  },

  /* background: {
    flex: 1,
    backgroundColor: "white",
  },
  titulo: {
    fontFamily: "conthrax",
    fontSize: 27,
    color: "#29364d",
    marginTop: 70,
    marginLeft: 20,
    position: "absolute",
  },
  imagenCredito: {
    width: 53,
    height: 34,
    tintColor: "#29364d",
    marginTop: 0,
    left: 20,
  },
  imagenInvertir: {
    width: 45,
    height: 34,
    tintColor: "#29364d",
    marginTop: -1.5,
    left: 20,
  },
  texto: {
    fontSize: 16,
    width: 110,
    fontFamily: "conthrax",
    color: "#29364d",
    marginTop: -1.5,
    left: 80,
    position: "absolute",
  },
  verInversiones: {
    flex: 0.5,
    height: 40,
    borderBottomLeftRadius: 17,
    borderTopLeftRadius: 17,
    left: 20,
    marginRight: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  verCreditos: {
    flex: 0.5,
    height: 40,
    borderBottomRightRadius: 17,
    borderTopRightRadius: 17,
    right: 20,
    marginLeft: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  unfocusedButtonInversiones: {
    flex: 0.5,
    height: 40,
    borderBottomLeftRadius: 17,
    borderTopLeftRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#29364d",
    left: 20,
    marginRight: 20,
  },
  unfocusedButtonCreditos: {
    flex: 0.5,
    height: 40,
    borderBottomRightRadius: 17,
    borderTopRightRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#29364d",
    right: 20,
    marginLeft: 20,
  },
  linearGradientInversiones: {
    ...StyleSheet.absoluteFillObject,
    borderBottomLeftRadius: 15,
    borderTopLeftRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  linearGradientCreditos: {
    ...StyleSheet.absoluteFillObject,
    borderBottomRightRadius: 15,
    borderTopRightRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  boton: {
    height: 60,
    width: "100%",
    borderRadius: 17,
    position: "absolute",
  },
  botonGradient: {
    width: "100%",
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 17,
  },
  textoBoton: {
    fontSize: 15,
    fontFamily: "conthrax",
    color: "white",
    position: "absolute",
  },
  verMas: {
    width: 65,
    height: 20,
    borderRadius: 15,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    position: "absolute",
    marginTop: 400,
  },
  textoVerMas: {
    fontSize: 10,
    fontFamily: "conthrax",
    color: "#29364d",
    position: "absolute",
  }, */
});

export default MiTankef;
