// Importaciones de React Native y React
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
// Importaciones de Hooks y Componentes
import CuadroRedUsuario from "../../components/CuadroRedUsuario";
import ProgressBar from "../../components/ProgressBar";
import { Feather } from "@expo/vector-icons";

const Perfil = () => {
  const navigation = useNavigation();

  // Componente visual
  return (
    <View style={styles.background}>
      {/* Boton de Settings */}
      <TouchableOpacity
        onPress={() => navigation.openDrawer()}
        style={styles.settings}
      >
        <Feather name="settings" size={30} color="#29364d" />
      </TouchableOpacity>
      {/* Titulo Superior */}
      <Text style={styles.titulo}>TANKEF</Text>
      {/* Imagen, Nombre y Correo de la persona */}
      <Image
        style={styles.fotoPerfil}
        source={require("../../../assets/images/Fotos_Personas/Steve.png")}
      />
      <Text style={styles.textoNombre}>Steve Rodgers</Text>
      <Text style={styles.textoMail}>steve.rodgh@gmail.com</Text>
      {/* Lista de Datos de Red del Usuario */}
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={styles.scroll}
      >
        <CuadroRedUsuario titulo="Conexiones" body="75" />
        <CuadroRedUsuario titulo="Valor de Red" body="$253,500.00" />
        <CuadroRedUsuario titulo="Mi Crédito" body="$15,000.00" />
        <CuadroRedUsuario titulo="Mi Inversión" body="$15,000.00" />
        <CuadroRedUsuario titulo="Obligado Solidario" body="$7,500.00" />
      </ScrollView>
      {/* View de LogIn Gradual */}
      <TouchableOpacity style={styles.cuadroLoginProgresivo}>
        {/* Texto Incentivo del Recuadro */}
        <Text style={styles.texto}>
          Termina tu <Text style={{ fontWeight: "bold" }}>registro</Text> para
          poder{" "}
          <Text style={{ fontWeight: "bold" }}>
            solicitar créditos e invertir
          </Text>
          !
        </Text>
        <ProgressBar progress={0.6} />
        {/* Boton del Recuadro */}
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
            }}
          >
            COMPLETAR PERFIL
          </Text>
        </LinearGradient>
      </TouchableOpacity>
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
  settings: {
    height: 32,
    width: 35,
    marginTop: 70,
    marginLeft: 340,
    alignItems: "center",
    position: "absolute",
  },
  fotoPerfil: {
    width: 80,
    height: 80,
    position: "absolute",
    borderRadius: 80,
    marginTop: 115,
    left: 20,
  },
  textoNombre: {
    color: "#29364d",
    fontWeight: "bold",
    fontSize: 27,
    marginTop: 115,
    position: "absolute",
    left: 115,
  },
  textoMail: {
    color: "grey",
    fontSize: 19,
    marginTop: 150,
    position: "absolute",
    left: 115,
  },
  scroll: {
    height: 110,
    width: 353,
    left: 20,
    paddingTop: 6,
    position: "absolute",
    top: 205,
  },
  cuadroLoginProgresivo: {
    height: 163,
    width: 353,
    marginTop: 325,
    position: "absolute",
    borderWidth: 1.5,
    borderColor: "#29364d",
    borderRadius: 15,
    left: 20,
    padding: 15,
  },
  texto: {
    fontSize: 15,
    color: "#29364d",
    width: 250,
    alignSelf: "center",
    textAlign: "center",
  },
  botonGradient: {
    justifyContent: "center",
    width: 180,
    height: 44,
    alignSelf: "center",
    borderRadius: 15,
    marginTop: 15,
  },
});

export default Perfil;
