// Importaciones de React Native y React
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  ScrollView,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useState, useContext, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
// Importaciones de Hooks y Componentes
import { APIGet } from "../../API/APIService";
import { UserContext } from "../../hooks/UserContext";
import { Feather, Ionicons, Entypo, FontAwesome5 } from "@expo/vector-icons";
import CuadroRedUsuario from "../../components/CuadroRedUsuario";
import Post from "../../components/Post";
import ModalPost from "../../components/ModalPost";

const Inicio = () => {
  // Estados y Contexto
  const { user, setUser } = useContext(UserContext);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [posts, setPosts] = useState([]);

  const fetchFeed = async () => {
    const url = `/api/v1/feed`;

    const result = await APIGet(url);

    if (result.error) {
      console.error("Error al obtener el feed:", result.error);
    } else {
      const sortedPosts = result.data.data.sort((a, b) => b.id - a.id); // Ordena los posts de más nuevo a más viejo
      setPosts(sortedPosts); // Guardar los datos de las publicaciones en el estado
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchFeed();
    }, [])
  );

  // Función para convertir la primera letra de cada palabra en mayúscula y el resto minuscula
  function titleCase(str) {
    return str
      .toLowerCase()
      .split(" ")
      .map(function (word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(" ");
  }

  const handleFocus = () => {
    setIsModalVisible(true);
  };

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
    Sliders: require("../../../assets/images/Sliders.png"),
    // ... más imágenes
  };

  /*useEffect(() => {
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
  }, []);*/

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
            start={{ x: 0.8, y: 0.8 }}
            end={{ x: 0, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </MaskedView>
        <Text style={styles.tituloPantalla}>Inicio</Text>
        <TouchableOpacity>
          <Feather
            name="bell"
            size={25}
            color="#060B4D"
            style={{ marginTop: 50, marginRight: 15 }}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          {/*<Image
            style={[styles.fotoPerfil, { marginTop: 65 }]}
            source={user.avatar ? { uri: user.avatar } : imageMap["Blank"]}
        />*/}
          <Image style={styles.sliders} source={imageMap["Sliders"]} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.postContainer}
        activeOpacity={1}
        onPress={() => handleFocus()}
      >
        <Image
          style={styles.fotoPerfil}
          source={user.avatar ? { uri: user.avatar } : imageMap["Blank"]}
        />
        <TextInput
          style={styles.input}
          placeholder="¿En que estas pensando?"
          onPressIn={() => handleFocus()}
          editable={false}
        />
        <MaskedView
          style={{ flex: 0.22 }}
          maskElement={
            <Ionicons
              name="ios-image"
              size={30}
              color="white"
              style={{
                transform: [{ scaleX: -1 }],
              }}
            />
          }
        >
          <LinearGradient
            colors={["#060B4D", "#060B4D"]}
            start={{ x: 0.7, y: 0.7 }}
            end={{ x: 0, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </MaskedView>
      </TouchableOpacity>
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
            <Text style={[styles.texto, { color: "#060B4D" }]}>
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

          {/* TEMPLATE DE POSTS EN FEED
          <Post
            tipo={"compartir"}
            nombre={"Antonio Stark Rivera"}
            tiempo={"3 horas"}
            foto={imageMap["Antonio"]}
            body={
              "Explorar el mundo de las finanzas es embarcarse en un viaje fascinante hacia la libertad financiera. La clave está en la educación continua y la toma de decisiones informadas. Invertir no solo se trata de aumentar tus activos, sino también de comprender los riesgos y cómo gestionarlos. Recuerda: diversificar es vital para equilibrar tu cartera. Y lo más importante, nunca es tarde para empezar a planificar tu futuro financiero. ¡Hagamos de las finanzas una herramienta para alcanzar nuestros sueños! #FinanzasInteligentes #LibertadFinanciera 💹📊"
            }
            imagen={imageMap["Test"]}
            comentarios={3}
          />
          <Post
            tipo={"compartir"}
            nombre={"Jose Antonio Quill"}
            tiempo={"2 días"}
            foto={imageMap["Quill"]}
            body={
              "Invertir es dar el primer paso hacia la libertad financiera. Al elegir sabiamente, tus ahorros pueden crecer exponencialmente. ¿Sabías que empezar joven y con constancia es clave para el éxito? Diversifica tus inversiones para minimizar riesgos y maximizar ganancias. ¡No esperes más, comienza hoy mismo a construir tu futuro! #Inversiones #LibertadFinanciera #CrecimientoEconómico 📈💼🌟"
            }
            comentarios={10}
          />*/}
          {posts.map((post) => (
            <Post
              key={post.id}
              postId={post.id}
              tipo={"compartir"}
              nombre={
                titleCase(post.user.name) +
                " " +
                titleCase(post.user.first_last_name) +
                " " +
                titleCase(post.user.second_last_name)
              } // Reemplazar con datos reales si están disponibles
              tiempo={post.created_at} // Reemplazar con datos reales si están disponibles
              foto={
                post.user.avatar ? { uri: post.user.avatar } : imageMap["Blank"]
              } // Reemplazar con datos reales si están disponibles
              body={post.body}
              comentarios={post.count_reactions}
              personal={false}
              imagen={post.image}
            />
          ))}
        </ScrollView>
      </TouchableWithoutFeedback>
      <ModalPost
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
      />
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
    letterSpacing: -4,
    fontSize: 35,
    marginTop: 40,
  },
  tituloPantalla: {
    flex: 1,
    marginTop: 45,
    marginLeft: 0,
    fontSize: 25,
    color: "#060B4D",
    fontFamily: "opensansbold",
    fontWeight: "bold",
  },
  postContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    marginTop: 3,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  fotoPerfil: {
    width: 35,
    height: 35,
    borderRadius: 18,
  },
  sliders: {
    width: 25,
    height: 23,
    marginTop: 50,
  },
  input: {
    borderRadius: 20,
    borderColor: "#D5D5D5",
    borderWidth: 1.5,
    marginLeft: 10,
    paddingHorizontal: 15,
    flex: 1,
    fontFamily: "opensans",
    color: "#060B4D",
    fontSize: 15,
  },
  scrollV: {
    flex: 1,
    marginTop: 3,
    backgroundColor: "white",
  },
  // Estilos de lo que se ha eliminado
  /*scrollH: {
    height: 110,
    width: "100%",
    paddingTop: 6,
    position: "absolute",
  },
  cuadroInvertir: {
    flexDirection: "row",
    backgroundColor: "#060B4D",
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
  },*/
});

export default Inicio;
