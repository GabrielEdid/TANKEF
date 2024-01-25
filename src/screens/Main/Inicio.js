// Importaciones de React Native y React
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
// Importaciones de Hooks y Componentes
import { UserContext } from "../../hooks/UserContext";
import { Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import CuadroRedUsuario from "../../components/CuadroRedUsuario";
import Post from "../../components/Post";

const Inicio = () => {
  // Estados y Contexto
  const { user, setUser } = useContext(UserContext);
  const [text, setText] = useState("");
  const [banners, setBanners] = useState({ investment: "", credit: "" });

  // Mapa para cargar todas las imagenes
  const imageMap = {
    Natasha: require("../../../assets/images/Fotos_Personas/Natahsa.png"),
    Quill: require("../../../assets/images/Fotos_Personas/Quill.png"),
    Clint: require("../../../assets/images/Fotos_Personas/Clint.png"),
    Antonio: require("../../../assets/images/Fotos_Personas/Antonio.png"),
    Steve: require("../../../assets/images/Fotos_Personas/Steve.png"),
    Test: require("../../../assets/images/Test.png"),
    Test2: require("../../../assets/images/Test2.jpg"),
    Test3: require("../../../assets/images/Test3.jpg"),
    Test4: require("../../../assets/images/Test4.jpg"),
    Blank: require("../../../assets/images/blankAvatar.jpg"),
    // ... más imágenes
  };

  useEffect(() => {
    const fetchBanners = async () => {
      const url =
        "https://market-web-pr477-x6cn34axca-uc.a.run.app/api/v1/banners";
      try {
        const response = await axios.get(url);
        setBanners(response.data.data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchBanners();
  }, []);

  // Componente visual
  return (
    <>
      <View style={styles.tituloContainer}>
        {/* Titulo */}
        <MaskedView
          style={{ flex: 1 }}
          maskElement={<Text style={styles.titulo}>tankef</Text>}
        >
          <LinearGradient
            colors={["#2FF690", "#21B6D5"]}
            start={{ x: 0.4, y: 0.4 }}
            end={{ x: 0, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </MaskedView>
        <TouchableOpacity>
          <Feather
            name="bell"
            size={30}
            color="#060B4D"
            style={{ marginTop: 70, marginRight: 10 }}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image
            style={[styles.fotoPerfil, { marginTop: 65 }]}
            source={user.avatar ? { uri: user.avatar } : imageMap["Blank"]}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.postContainer}>
        <Image
          style={styles.fotoPerfil}
          source={user.avatar ? { uri: user.avatar } : imageMap["Blank"]}
        />
        <TextInput
          style={styles.input}
          placeholder="¿En que estas pensando?"
          onChangeText={setText}
          value={text}
          maxLength={{}}
        />
        <MaskedView
          style={{ flex: 0.22 }}
          maskElement={
            <Ionicons
              name="ios-image"
              size={45}
              color="white"
              style={{
                marginTop: -5,
                transform: [{ scaleX: -1 }],
              }}
            />
          }
        >
          <LinearGradient
            colors={["#2FF690", "#21B6D5"]}
            start={{ x: 0.7, y: 0.7 }}
            end={{ x: 0, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </MaskedView>
      </View>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <ScrollView style={styles.scrollV}>
          {/* Lista de Datos de Red del Usuario 
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={styles.scrollH}
          >
            <CuadroRedUsuario titulo="Valor de Red" body="$253,500.00" />
            <CuadroRedUsuario titulo="Mi Crédito" body="$15,000.00" />
            <CuadroRedUsuario titulo="Mi Inversión" body="$15,000.00" />
            <CuadroRedUsuario titulo="Obligado Solidario" body="$7,500.00" />
          </ScrollView> */}

          {/* Anuncio para Invertir 
          <TouchableOpacity style={styles.cuadroInvertir}>
            <Text style={styles.texto}>{banners.investment}</Text>
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
          </TouchableOpacity> */}

          {/* Anuncio para hacer un Crédito 
          <TouchableOpacity style={styles.cuadroCredito}>
            <Text style={[styles.texto, { color: "#29364d" }]}>
              {banners.credit}
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
          </TouchableOpacity> */}
          <Post
            tipo={"compartir"}
            nombre={"Antonio Stark Rivera"}
            tiempo={"3 horas"}
            foto={imageMap["Antonio"]}
            body={
              "Explorar el mundo de las finanzas es embarcarse en un viaje fascinante hacia la libertad financiera. La clave está en la educación continua y la toma de decisiones informadas. Invertir no solo se trata de aumentar tus activos, sino también de comprender los riesgos y cómo gestionarlos. Recuerda: diversificar es vital para equilibrar tu cartera. Y lo más importante, nunca es tarde para empezar a planificar tu futuro financiero. ¡Hagamos de las finanzas una herramienta para alcanzar nuestros sueños! #FinanzasInteligentes #LibertadFinanciera 💹📊"
            }
            imagen={imageMap["Test"]}
          />
          <Post
            tipo={"compartir"}
            nombre={"Jose Antonio Quill"}
            tiempo={"2 días"}
            foto={imageMap["Quill"]}
            body={
              "Invertir es dar el primer paso hacia la libertad financiera. Al elegir sabiamente, tus ahorros pueden crecer exponencialmente. ¿Sabías que empezar joven y con constancia es clave para el éxito? Diversifica tus inversiones para minimizar riesgos y maximizar ganancias. ¡No esperes más, comienza hoy mismo a construir tu futuro! #Inversiones #LibertadFinanciera #CrecimientoEconómico 📈💼🌟"
            }
          />
        </ScrollView>
      </TouchableWithoutFeedback>
    </>
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
    letterSpacing: -3,
    fontSize: 40,
    marginTop: 60,
  },
  postContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    marginTop: 3,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  fotoPerfil: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  input: {
    borderRadius: 20,
    borderColor: "#D5D5D5",
    borderWidth: 1.5,
    marginLeft: 10,
    paddingHorizontal: 15,
    flex: 1,
    color: "#29364d",
    fontSize: 18,
  },
  scrollV: {
    flex: 1,
    marginTop: 3,
    backgroundColor: "white",
  },
  scrollH: {
    height: 110,
    width: "100%",
    paddingTop: 6,
    position: "absolute",
  },
  cuadroInvertir: {
    flexDirection: "row",
    backgroundColor: "#29364d",
    alignContent: "center",
    height: 80,
    width: "100%",
    top: 115,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  cuadroCredito: {
    flexDirection: "row",
    backgroundColor: "#F1F5F9",
    alignSelf: "center",
    height: 80,
    width: "100%",
    top: 125,
    borderRadius: 15,
    borderColor: "#D5D5D5",
    borderWidth: 1.5,
    marginBottom: 140,
    justifyContent: "center",
    alignItems: "center",
  },
  texto: {
    fontSize: 12,
    color: "white",
    alignContent: "center",
    marginHorizontal: 20,
    width: "52%",
    alignSelf: "center",
    flex: 2,
  },
  botonGradient: {
    justifyContent: "center",
    width: "100%",
    height: 38,
    flex: 1.4,
    right: 10,
    borderRadius: 15,
  },
});

export default Inicio;
