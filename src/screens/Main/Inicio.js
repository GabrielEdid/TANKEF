// Importaciones de React Native y React
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useState, useContext, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { ActivityIndicator } from "react-native-paper";
import MaskedView from "@react-native-masked-view/masked-view";
// Importaciones de Hooks y Componentes
import { APIGet } from "../../API/APIService";
import { UserContext } from "../../hooks/UserContext";
import { Feather, Ionicons } from "@expo/vector-icons";
import Post from "../../components/Post";
import ModalPost from "../../components/ModalPost";

const Inicio = () => {
  // Estados y Contexto
  const { user, setUser } = useContext(UserContext); // Contexto de Usuario
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1); // Estado para manejar la paginación
  const [isFetchingMore, setIsFetchingMore] = useState(false); // Estado para saber si se están cargando más posts
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mapa para cargar todas las imagenes
  const imageMap = {
    Blank: require("../../../assets/images/blankAvatar.jpg"),
    // ... más imágenes
  };

  // Función para obtener los posts del feed
  const fetchFeed = async (currentPage) => {
    setIsFetchingMore(true);
    const url = `/api/v1/feed?page=${currentPage}`;
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

  // Función para manejar la carga de más posts
  const handleLoadMore = () => {
    if (!isFetchingMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

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

  // Efecto para cargar los posts del feed al cargar la pantalla
  useFocusEffect(
    useCallback(() => {
      fetchFeed(page);
    }, [page])
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

  // Función para manejar el foco del input para crear un post
  const handleFocus = () => {
    setIsModalVisible(true);
  };

  // Función para manejar la acción de refrescar y jalar mas posts
  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchFeed(1).then(() => {
      setIsRefreshing(false);
      setPage(1); // Reinicia a la primera página
    });
  }, []);

  // Componente visual
  return (
    <>
      {/* Titulo, Nombre de Pantalla y Campana*/}
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
        <Text style={styles.tituloPantalla}>Inicio</Text>
        <TouchableOpacity>
          <Feather
            name="bell"
            size={25}
            color="#060B4D"
            style={{ marginTop: 50 }}
          />
        </TouchableOpacity>
      </View>
      {/* Contenedor de Crear Post, Parece como un input y mas pero es inactivo */}
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
        <Ionicons
          name="image"
          size={30}
          color="#060B4D"
          style={{
            transform: [{ scaleX: -1 }],
            alignSelf: "center",
          }}
        />
      </TouchableOpacity>
      {/* Contenedor y Scrollview de Posts */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
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
              tintColor="#060B4D" // Usado en iOS
              colors={["#060B4D"]} // Usado en Android
            />
          }
        >
          {/* Se verifica que los posts esten cargados, no este cargando y que hayan posts */}
          {!isLoading &&
            (posts.length !== 0 ? (
              posts.map((post, index) => (
                <View style={{ backgroundColor: "white" }}>
                  <Post
                    key={index}
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
                      post.user.avatar
                        ? { uri: post.user.avatar }
                        : imageMap["Blank"]
                    } // Reemplazar con datos reales si están disponibles
                    body={post.body}
                    comentarios={post.count_comments}
                    reacciones={post.count_reactions}
                    personal={post.user.id === user.userID ? true : false}
                    imagen={post.image}
                    liked={post["liked?"]}
                  />
                </View>
              ))
            ) : (
              /* Si no hay posts se da un mensaje */
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

          {/* Si se está cargando más posts se muestra un ActivityIndicator */}
          {isFetchingMore && (
            <View style={styles.activityIndicatorContainer}>
              <ActivityIndicator size={75} color="#060B4D" />
            </View>
          )}
        </ScrollView>
      </TouchableWithoutFeedback>
      {/* Se importa el Modal para crear un post */}
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
    marginTop: 47,
    marginRight: 35,
    fontSize: 24,
    color: "#060B4D",
    fontFamily: "opensanssemibold",
    fontWeight: "bold",
  },
  sliders: {
    width: 25,
    height: 23,
    marginTop: 50,
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
  input: {
    borderRadius: 20,
    borderColor: "#D5D5D5",
    borderWidth: 1.5,
    marginHorizontal: 10,
    paddingHorizontal: 15,
    flex: 1,
    fontFamily: "opensans",
    color: "#060B4D",
    fontSize: 15,
  },
  scrollV: {
    flex: 1,
    marginTop: 3,
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

export default Inicio;
