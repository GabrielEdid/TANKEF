// Importaciones de React Native y React
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React from "react";
import MovimientoCredito from "../../components/MovimientoCredito";
import MovimientoInversion from "../../components/MovimientoInversion";
import { ScrollView } from "react-native-gesture-handler";

// Importaciones de Hooks y Componentes

const Movimientos = () => {
  // Componente visual
  return (
    <View style={styles.background}>
      {/* Titulo */}
      <Text style={styles.titulo}>TANKEF</Text>
      {/* Seccion de los Creditos del Usuario */}
      <Image
        style={styles.imagenCredito}
        source={require("../../../assets/images/Credito.png")}
      />
      <Text style={styles.texto}>Mis Créditos</Text>
      {/* Boton de Nuevo Crédito y Ver Más */}
      <TouchableOpacity style={styles.boton}>
        <Text style={[styles.textoBoton]}>NUEVO CRÉDITO</Text>
      </TouchableOpacity>
      <View style={{ height: 260 }}>
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
      {/* Boton de VerMas*/}
      {/*<TouchableOpacity style={styles.verMas}>
        <Text style={styles.textoVerMas}>VER MÁS</Text>
        </TouchableOpacity>*/}
      {/* Seccion de las Inversiones del Usuario */}
      <Image
        style={styles.imagenInvertir}
        source={require("../../../assets/images/Invertir.png")}
      />
      <Text style={[styles.texto, { width: 150, marginTop: 440 }]}>
        Mis Inversiones
      </Text>
      {/* Boton de Invertir y Ver Más */}
      <TouchableOpacity style={[styles.boton, { marginTop: 440 }]}>
        <Text style={[styles.textoBoton]}>INVERTIR</Text>
      </TouchableOpacity>
      <View style={{ height: 260, marginTop: 10 }}>
        <ScrollView style={{ flex: 1 }}>
          <MovimientoInversion
            tag={["13.20%", "En Curso"]}
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
      {/* Boton de VerMas*/}
      {/* <TouchableOpacity style={[styles.verMas, { marginTop: 730 }]}>
        <Text style={styles.textoVerMas}>VER MÁS</Text>
      </TouchableOpacity> */}
    </View>
  );
};

// Estilos de la pantalla
const styles = StyleSheet.create({
  background: {
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
    marginTop: 125,
    left: 20,
  },
  imagenInvertir: {
    width: 45,
    height: 34,
    tintColor: "#29364d",
    marginTop: 22,
    left: 20,
  },
  texto: {
    fontSize: 16,
    width: 110,
    fontFamily: "conthrax",
    color: "#29364d",
    marginTop: 123.5,
    left: 80,
    position: "absolute",
  },
  boton: {
    backgroundColor: "#29364d",
    width: 130,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    left: 240,
    marginTop: 125,
  },
  textoBoton: {
    fontSize: 10,
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
  },
});

export default Movimientos;
