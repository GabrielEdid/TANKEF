// Importaciones de React Native y React
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
} from "react-native";
import React, { useState, useEffect, useContext, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { ActivityIndicator } from "react-native-paper";
import MaskedView from "@react-native-masked-view/masked-view";
// Importaciones de Hooks y Componentes
import { APIGet } from "../../API/APIService";
import { UserContext } from "../../hooks/UserContext";
import CuadroRedUsuario from "../../components/CuadroRedUsuario";
import ProgressBar from "../../components/ProgressBar";
import { Feather } from "@expo/vector-icons";
import Post from "../../components/Post";

const Perfil = () => {
  const navigation = useNavigation();
  const [posts, setPosts] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { user, setUser } = useContext(UserContext);

  // Mapa para cargar todas las imagenes
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

  const fetchUserPosts = async () => {
    setIsLoading(true);
    const url = `/api/v1/users/${user.userID}/posts`;

    const result = await APIGet(url);

    if (result.error) {
      console.error("Error al obtener posts:", result.error);
    } else {
      const sortedPosts = result.data.data.sort((a, b) => b.id - a.id);
      setPosts(sortedPosts);
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserPosts();
    }, [])
  );

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
        <Text style={styles.tituloPantalla}>Perfil</Text>
        <TouchableOpacity>
          <Feather
            name="bell"
            size={25}
            color="#060B4D"
            style={{ marginTop: 50, marginRight: 15 }}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          {/*<Image
            style={[styles.fotoPerfil, { marginTop: 65 }]}
            source={user.avatar ? { uri: user.avatar } : imageMap["Blank"]}
        />*/}
          <Image style={styles.sliders} source={imageMap["Sliders"]} />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.scrollV}>
        {/* Contenedor Imagen, Nombre y Correo de la persona */}
        <View style={{ flexDirection: "row" }}>
          <Image
            style={styles.fotoPerfil}
            source={user.avatar ? { uri: user.avatar } : imageMap["Blank"]}
          />
          <View style={{ marginLeft: 10, marginTop: 5 }}>
            <Text style={styles.textoNombre}>
              {user.nombre +
                " " +
                user.apellidoPaterno +
                " " +
                user.apellidoMaterno}
            </Text>
            <Text style={styles.textoMail}>{user.email}</Text>
          </View>
        </View>
        <View
          style={{
            backgroundColor: "#F2F2F2",
            width: "100%",
            height: 3,
            marginTop: 10,
          }}
        />
        {/* Lista de Datos de Red del Usuario 
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
        {/* View de LogIn Gradual *
        <TouchableOpacity
          style={styles.cuadroLoginProgresivo}
          onPress={() => {
            navigation.navigate("LoginProgresivo");
          }}
        >
          {/* Texto Incentivo del Recuadro 
          <Text style={styles.texto}>
            Termina tu <Text style={{ fontWeight: "bold" }}>registro</Text> para
            poder{" "}
            <Text style={{ fontWeight: "bold" }}>
              solicitar créditos e invertir
            </Text>
            !
          </Text>
          <ProgressBar progress={0.7} />
          {/* Boton del Recuadro 
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
        </TouchableOpacity> */}

        <View style={{ marginTop: 5 }}>
          <Modal transparent={true} animationType="fade" visible={isLoading}>
            <View style={styles.overlay}>
              <ActivityIndicator size={75} color="#060B4D" />
            </View>
          </Modal>
          {!isLoading &&
            (posts.length !== 0 ? (
              posts.map((post) => (
                <Post
                  key={post.id}
                  postId={post.id}
                  tipo={"compartir"}
                  nombre={
                    user.nombre +
                    " " +
                    user.apellidoPaterno +
                    " " +
                    user.apellidoMaterno
                  } // Reemplazar con datos reales si están disponibles
                  tiempo={post.created_at} // Reemplazar con datos reales si están disponibles
                  foto={user.avatar ? { uri: user.avatar } : imageMap["Blank"]} // Reemplazar con datos reales si están disponibles
                  body={post.body}
                  personal={true}
                  imagen={post.image}
                />
              ))
            ) : (
              <View
                style={{
                  paddingHorizontal: 40,
                  paddingVertical: 250,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: "opensans",
                    textAlign: "center",
                    color: "#060B4D",
                  }}
                >
                  ¡Bienvenido a{" "}
                  <Text style={{ fontFamily: "opensansbold" }}>Tankef</Text>,
                  recuerda que entre más amigos, familiares y socios, mayores
                  beneficios reciben todos! Para comenzar empieza por contarnos
                  en que estas pensando...
                </Text>
              </View>
            ))}
        </View>
      </ScrollView>
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
    marginTop: 47,
    marginLeft: 0,
    fontSize: 24,
    color: "#060B4D",
    fontFamily: "opensansbold",
    fontWeight: "bold",
  },
  sliders: {
    width: 25,
    height: 23,
    marginTop: 50,
  },
  settings: {
    height: 32,
    width: 35,
    marginTop: 70,
    alignSelf: "flex-end",
    right: 20,
  },
  scrollV: {
    marginTop: 3,
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
    marginLeft: 20,
  },
  textoNombre: {
    color: "#29364d",
    fontFamily: "opensansbold",
    fontSize: 24,
  },
  textoMail: {
    color: "grey",
    fontFamily: "opensans",
    fontSize: 14,
    marginLeft: 1,
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
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Perfil;
