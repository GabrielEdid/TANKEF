// Importaciones de React Native y React
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
// Importaciones de Hooks y Componentes
import CuadroRedUsuario from "../../components/CuadroRedUsuario";
import Post from "../../components/Post";

const Inicio = () => {
  // Componente visual
  return (
    <>
      <View style={styles.tituloContainer}>
        {/* Titulo */}
        <Text style={styles.titulo}>TANKEF</Text>
      </View>
      <ScrollView style={styles.scrollV}>
        {/* Lista de Datos de Red del Usuario */}
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={styles.scrollH}
        >
          <CuadroRedUsuario titulo="Valor de Red" body="$253,500.00" />
          <CuadroRedUsuario titulo="Mi Crédito" body="$15,000.00" />
          <CuadroRedUsuario titulo="Mi Inversión" body="$15,000.00" />
          <CuadroRedUsuario titulo="Obligado Solidario" body="$7,500.00" />
        </ScrollView>
        {/* Anuncio para Invertir */}
        <TouchableOpacity style={styles.cuadroInvertir}>
          <Text style={styles.texto}>
            Transforma tu ahorro en inversión, con una{" "}
            <Text style={{ fontWeight: "bold" }}>
              Tasa Anual del 13.51% desde $5,000
            </Text>
          </Text>
          <LinearGradient
            colors={["#2FF690", "#21B6D5"]}
            start={{ x: 1, y: 1 }} // Inicio del gradiente
            end={{ x: 0, y: 0 }} // Fin del gradiente
            style={styles.botonGradient}
          >
            <Text
              style={{
                fontFamily: "conthrax",
                color: "white",
                textAlign: "center",
                fontSize: 17,
              }}
            >
              INVERTIR
            </Text>
          </LinearGradient>
        </TouchableOpacity>
        {/* Anuncio para hacer un Crédito */}
        <TouchableOpacity style={styles.cuadroCredito}>
          <Text style={[styles.texto, { color: "#29364d" }]}>
            ¿Necesitas un <Text style={{ fontWeight: "bold" }}>impuslo</Text>{" "}
            para alcanzar tus <Text style={{ fontWeight: "bold" }}>sueños</Text>
            ? ¡Da el primer paso hacía tus objetivos!
          </Text>
          <LinearGradient
            colors={["#2FF690", "#21B6D5"]}
            start={{ x: 1, y: 1 }} // Inicio del gradiente
            end={{ x: 0, y: 0 }} // Fin del gradiente
            style={styles.botonGradient}
          >
            <Text
              style={{
                fontFamily: "conthrax",
                color: "white",
                textAlign: "center",
                fontSize: 17,
              }}
            >
              CRÉDITO
            </Text>
          </LinearGradient>
        </TouchableOpacity>
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
      </ScrollView>
    </>
  );
};

// Estilos de la pantalla
const styles = StyleSheet.create({
  tituloContainer: {
    height: 105,
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
  scrollV: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollH: {
    height: 110,
    width: 353,
    left: 20,
    paddingTop: 6,
    position: "absolute",
  },
  cuadroInvertir: {
    backgroundColor: "#29364d",
    alignContent: "center",
    height: 80,
    width: 353,
    top: 115,
    left: 20,
    borderRadius: 15,
  },
  cuadroCredito: {
    backgroundColor: "#F1F5F9",
    alignContent: "center",
    height: 80,
    width: 353,
    top: 125,
    left: 20,
    borderRadius: 15,
    borderColor: "#D5D5D5",
    borderWidth: 1.5,
    marginBottom: 140,
  },
  texto: {
    fontSize: 12,
    color: "white",
    alignContent: "center",
    top: 17.5,
    marginHorizontal: 20,
    width: 190,
  },
  botonGradient: {
    justifyContent: "center",
    width: 130,
    height: 38,
    borderRadius: 15,
    left: 210,
    bottom: 22.5,
  },
});

export default Inicio;
