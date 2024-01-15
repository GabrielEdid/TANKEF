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
import Post from "../../components/Post";

const Perfil = () => {
  const navigation = useNavigation();

  // Mapa para cargar todas las imagenes
  const imageMap = {
    Natasha: require("../../../assets/images/Fotos_Personas/Natahsa.png"),
    Quill: require("../../../assets/images/Fotos_Personas/Quill.png"),
    Clint: require("../../../assets/images/Fotos_Personas/Clint.png"),
    Antonio: require("../../../assets/images/Fotos_Personas/Antonio.png"),
    Steve: require("../../../assets/images/Fotos_Personas/Steve.png"),
    Test: require("../../../assets/images/Test.png"),
    // ... más imágenes
  };

  // Componente visual
  return (
    <>
      <View style={styles.tituloContainer}>
        {/* Boton de Settings */}
        <TouchableOpacity
          onPress={() => navigation.openDrawer()}
          style={styles.settings}
        >
          <Feather name="settings" size={30} color="#29364d" />
        </TouchableOpacity>
        {/* Titulo Superior */}
        <Text style={styles.titulo}>TANKEF</Text>
      </View>
      <ScrollView style={styles.scrollV}>
        {/* Contenedor Imagen, Nombre y Correo de la persona */}
        <View>
          <Image
            style={styles.fotoPerfil}
            source={require("../../../assets/images/Fotos_Personas/Steve.png")}
          />
          <Text style={styles.textoNombre}>Steve Rodgers</Text>
          <Text style={styles.textoMail}>steve.rodgh@gmail.com</Text>
        </View>
        {/* Lista de Datos de Red del Usuario */}
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={styles.scrollH}
        >
          <CuadroRedUsuario titulo="Conexiones" body="75" />
          <CuadroRedUsuario titulo="Valor de Red" body="$253,500.00" />
          <CuadroRedUsuario titulo="Mi Crédito" body="$15,000.00" />
          <CuadroRedUsuario titulo="Mi Inversión" body="$15,000.00" />
          <CuadroRedUsuario titulo="Obligado Solidario" body="$7,500.00" />
        </ScrollView>
        {/* View de LogIn Gradual */}
        <TouchableOpacity
          style={styles.cuadroLoginProgresivo}
          onPress={() =>
            navigation.navigate("PerfilScreen", {
              screen: "LoginProgresivo2",
            })
          }
        >
          {/* Texto Incentivo del Recuadro */}
          <Text style={styles.texto}>
            Termina tu <Text style={{ fontWeight: "bold" }}>registro</Text> para
            poder{" "}
            <Text style={{ fontWeight: "bold" }}>
              solicitar créditos e invertir
            </Text>
            !
          </Text>
          <ProgressBar progress={0.7} />
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
        <View style={{ marginTop: 15 }}>
          <Post
            tipo={"compartir"}
            nombre={"Steve Rodgers"}
            tiempo={"3 horas"}
            foto={imageMap["Steve"]}
            body={
              "Explorar el mundo de las finanzas es embarcarse en un viaje fascinante hacia la libertad financiera. La clave está en la educación continua y la toma de decisiones informadas. Invertir no solo se trata de aumentar tus activos, sino también de comprender los riesgos y cómo gestionarlos. Recuerda: diversificar es vital para equilibrar tu cartera. Y lo más importante, nunca es tarde para empezar a planificar tu futuro financiero. ¡Hagamos de las finanzas una herramienta para alcanzar nuestros sueños! #FinanzasInteligentes #LibertadFinanciera 💹📊"
            }
            perfil={imageMap["Steve"]}
          />
          <Post
            tipo={"compartir"}
            nombre={"Steve Rodgers"}
            tiempo={"3 horas"}
            foto={imageMap["Steve"]}
            body={
              "Explorar el mundo de las finanzas es embarcarse en un viaje fascinante hacia la libertad financiera. La clave está en la educación continua y la toma de decisiones informadas. Invertir no solo se trata de aumentar tus activos, sino también de comprender los riesgos y cómo gestionarlos. Recuerda: diversificar es vital para equilibrar tu cartera. Y lo más importante, nunca es tarde para empezar a planificar tu futuro financiero. ¡Hagamos de las finanzas una herramienta para alcanzar nuestros sueños! #FinanzasInteligentes #LibertadFinanciera 💹📊"
            }
            imagen={imageMap["Test"]}
            perfil={imageMap["Steve"]}
          />
        </View>
      </ScrollView>
    </>
  );
};

// Estilos de la pantalla
const styles = StyleSheet.create({
  tituloContainer: {
    justifyContent: "space-between",
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
  settings: {
    height: 32,
    width: 35,
    marginTop: 70,
    alignSelf: "flex-end",
    right: 20,
  },
  scrollV: {
    paddingHorizontal: 20,
    flex: 1,
    backgroundColor: "white",
  },
  scrollH: {
    height: 110,
    width: "100%",
    paddingTop: 6,
    top: 10,
  },
  fotoPerfil: {
    width: 80,
    height: 80,
    borderRadius: 80,
    marginTop: 10,
  },
  textoNombre: {
    color: "#29364d",
    fontWeight: "bold",
    fontSize: 27,
    marginTop: 10,
    position: "absolute",
    left: 95,
  },
  textoMail: {
    color: "grey",
    fontSize: 19,
    marginTop: 45,
    position: "absolute",
    left: 96,
  },
  cuadroLoginProgresivo: {
    height: 163,
    width: "100%",
    marginTop: 20,
    borderWidth: 1.5,
    borderColor: "#D5D5D5",
    borderRadius: 15,
    padding: 15,
  },
  texto: {
    fontSize: 15,
    color: "#29364d",
    width: "70%",
    alignSelf: "center",
    textAlign: "center",
  },
  botonGradient: {
    justifyContent: "center",
    width: "65%",
    height: 44,
    alignSelf: "center",
    borderRadius: 15,
    top: 15,
  },
});

export default Perfil;
