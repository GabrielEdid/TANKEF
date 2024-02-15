// Importaciones de React Native y React
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import React, { useState, useContext, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { ActivityIndicator } from "react-native-paper";
import MaskedView from "@react-native-masked-view/masked-view";
// Importaciones de Hooks y Componentes
import { APIGet } from "../../API/APIService";
import { UserContext } from "../../hooks/UserContext";
import CuadroRedUsuario from "../../components/Componentes Olvidados/CuadroRedUsuario";
import ProgressBar from "../../components/Componentes Olvidados/ProgressBar";
import { Feather } from "@expo/vector-icons";
import Post from "../../components/Post";

const Perfil = () => {
  // Estados y contexto
  const navigation = useNavigation();
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user, setUser } = useContext(UserContext); // Contexto de usuario

  // Mapa para cargar todas las imagenes
  const imageMap = {
    Blank: require("../../../assets/images/blankAvatar.jpg"),
    Sliders: require("../../../assets/images/Sliders.png"),
    // ... más imágenes
  };

  // Función para obtener los posts del usuario loggeado, maneja la paginación
  const fetchUserPosts = async (currentPage) => {
    setIsFetchingMore(true);
    const url = `/api/v1/users/${user.userID}/posts?page=${currentPage}`;
    const response = await APIGet(url);

    if (!response.error) {
      // Ordena los posts de más nuevo a más viejo
      const newPosts = response.data.data.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );

      if (currentPage === 1) {
        setPosts(newPosts);
      } else {
        // Filtra los posts que ya están presentes en el estado actual
        const filteredNewPosts = newPosts.filter(
          (newPost) => !posts.some((post) => post.id === newPost.id)
        );

        setPosts((prevPosts) => [...prevPosts, ...filteredNewPosts]);
      }
    } else {
      console.error("Error al obtener posts:", response.error);
    }
    setIsLoading(false);
    setIsFetchingMore(false);
  };

  // Efecto para obtener los posts del usuario loggeado
  useFocusEffect(
    useCallback(() => {
      fetchUserPosts(page);
    }, [page])
  );

  // Función para manejar la carga de más posts
  const handleLoadMore = () => {
    if (!isFetchingMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  // Función para saber si el usuario está cerca del final de la pantalla
  const isCloseToBottom = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }) => {
    const paddingToBottom = 20; // cuánto espacio en la parte inferior antes de cargar más
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  // Función para manejar el refresh de la pantalla con el RefreshControl
  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchUserPosts(1).then(() => {
      setIsRefreshing(false);
      setPage(1); // Reinicia a la primera página
    });
  }, []);

  // Componente visual
  return (
    <>
      {/* Titulo, Nombre de la Pantalla, Notificación y Sliders */}
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
        <Text style={styles.tituloPantalla}>Perfil</Text>
        <TouchableOpacity>
          <Feather
            name="bell"
            size={25}
            color="#060B4D"
            style={{ marginTop: 50, marginRight: 15 }}
          />
        </TouchableOpacity>
        {/* Botón de sliders para abrir el Drawer */}
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Image style={styles.sliders} source={imageMap["Sliders"]} />
        </TouchableOpacity>
      </View>

      {/* Scroll de la pantalla */}
      <ScrollView
        style={styles.scrollV}
        onScroll={({ nativeEvent }) => {
          if (isCloseToBottom(nativeEvent)) {
            handleLoadMore();
          }
        }}
        scrollEventThrottle={400}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor="#060B4D" // Puedes personalizar el color según tu diseño
            colors={["#060B4D"]} // Puedes personalizar el color según tu diseño
          />
        }
      >
        {/* Contenedor Imagen, Nombre y Correo de la persona */}
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "white",
            paddingBottom: 10,
          }}
        >
          <Image
            style={styles.fotoPerfil}
            source={user.avatar ? { uri: user.avatar } : imageMap["Blank"]}
          />
          <View style={{ marginLeft: 10, marginTop: 5, alignSelf: "center" }}>
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

        {/* Lista de Datos de Red del Usuario */}
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={styles.scrollH}
        >
          <CuadroRedUsuario titulo="Conexiones" body={user.conexiones} />
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
            Termina tu{" "}
            <Text style={{ fontFamily: "opensansbold" }}>registro</Text> para
            poder{" "}
            <Text style={{ fontFamily: "opensansbold" }}>
              solicitar créditos e invertir
            </Text>
            !
          </Text>
          <ProgressBar progress={0.7} />
          {/* Boton del Recuadro */}
          <View style={styles.botonCompletar}>
            <Text
              style={{
                fontFamily: "opensansbold",
                color: "#060B4D",
                textAlign: "center",
              }}
            >
              Completar Perfil
            </Text>
          </View>
        </TouchableOpacity>

        {/* Posts del usuario, se maneja la carga y si hay post o no para mostar un mensaje si no hay */}
        {!isLoading &&
          (posts.length !== 0 ? (
            /* Mapeo de los posts del usuario */
            posts.map((post, index) => (
              <View style={{ marginTop: 3, backgroundColor: "white" }}>
                <Post
                  key={index}
                  postId={post.id}
                  tipo={"compartir"}
                  nombre={
                    user.nombre +
                    " " +
                    user.apellidoPaterno +
                    " " +
                    user.apellidoMaterno
                  }
                  tiempo={post.created_at}
                  foto={user.avatar ? { uri: user.avatar } : imageMap["Blank"]}
                  body={post.body}
                  personal={true}
                  imagen={post.image}
                  comentarios={post.count_comments}
                  reacciones={post.count_reactions}
                  liked={post["liked?"]}
                />
              </View>
            ))
          ) : (
            /* Mensaje si no hay posts */
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
                beneficios reciben todos! Para comenzar empieza por contarnos en
                que estas pensando...
              </Text>
            </View>
          ))}

        {/* Activity Indicator para mostrar que se están cargando más posts */}
        {isFetchingMore && (
          <View style={styles.activityIndicatorContainer}>
            <ActivityIndicator size={75} color="#060B4D" />
          </View>
        )}
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
    marginLeft: 5,
    fontSize: 24,
    color: "#060B4D",
    fontFamily: "opensanssemibold",
    fontWeight: "bold",
  },
  sliders: {
    width: 26,
    height: 25,
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
  },
  scrollH: {
    marginTop: 3,
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  fotoPerfil: {
    width: 80,
    height: 80,
    borderRadius: 80,
    marginTop: 10,
    marginLeft: 20,
  },
  textoNombre: {
    color: "#060B4D",
    fontFamily: "opensansbold",
    fontSize: 24,
  },
  textoMail: {
    color: "#060B4D",
    fontFamily: "opensans",
    fontSize: 14,
    marginLeft: 2,
  },
  cuadroLoginProgresivo: {
    backgroundColor: "white",
    height: 163,
    width: "100%",
    marginTop: 3,
    padding: 15,
  },
  texto: {
    fontSize: 15,
    fontFamily: "opensans",
    color: "#060B4D",
    width: "70%",
    alignSelf: "center",
    textAlign: "center",
  },
  botonCompletar: {
    backgroundColor: "#2FF690",
    justifyContent: "center",
    width: "65%",
    height: 44,
    alignSelf: "center",
    borderRadius: 15,
    marginTop: 15,
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  activityIndicatorContainer: {
    paddingVertical: 20,
  },
});

export default Perfil;
