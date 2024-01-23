// Importaciones de React Native y React
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
// Importaciones de Hooks y Componentes
import { UserContext } from "../../hooks/UserContext";
import CuadroRedUsuario from "../../components/CuadroRedUsuario";
import ProgressBar from "../../components/ProgressBar";
import { Feather } from "@expo/vector-icons";
import Post from "../../components/Post";

const Perfil = () => {
  const navigation = useNavigation();
  const [posts, setPosts] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
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
    // ... más imágenes
  };

  const fetchUserPosts = async () => {
    const url = `https://market-web-pr477-x6cn34axca-uc.a.run.app/api/v1/users/${user.userID}/posts`;

    try {
      const response = await axios.get(url);
      const sortedPosts = response.data.data.sort((a, b) => b.id - a.id); // Ordena los posts de más nuevo a más viejo
      setPosts(sortedPosts); // Guardar los datos de las publicaciones en el estado
    } catch (error) {
      console.error("Error:", error);
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
            source={user.avatar ? { uri: user.avatar } : imageMap["Blank"]}
          />
          <Text style={styles.textoNombre}>
            {user.nombre +
              " " +
              user.apellidoPaterno +
              " " +
              user.apellidoMaterno}
          </Text>
          <Text style={styles.textoMail}>{user.email}</Text>
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
          onPress={() => {
            navigation.navigate("LoginProgresivo");
          }}
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
          {posts.map((post) => (
            <Post
              postID={post.id}
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
              perfil={user.avatar ? { uri: user.avatar } : imageMap["Blank"]} // Reemplazar con datos reales si están disponibles
              personal={true}
            />
          ))}
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
