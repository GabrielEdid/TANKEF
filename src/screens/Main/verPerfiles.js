// Importaciones de React Native y React
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  RefreshControl,
} from "react-native";
import React, { useState, useEffect, useContext, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import { ActivityIndicator } from "react-native-paper";
// Importaciones de Hooks y Componentes
import { Feather, EvilIcons } from "@expo/vector-icons";
import { APIGet, APIPost } from "../../API/APIService";
import { UserContext } from "../../hooks/UserContext";
import Post from "../../components/Post";

const VerPerfiles = ({ route }) => {
  const { userID } = route.params;
  const { user, setUser } = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [estado, setEstado] = useState("inicial"); // Estados: "inicial", "solicitudEnviada"
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    mail: "",
    avatar: null,
    friend: false,
  });

  // Mapa para cargar todas las imagenes
  const imageMap = {
    Blank: require("../../../assets/images/blankAvatar.jpg"),
    // ... más imágenes
  };

  const postRequest = async () => {
    const url = "/api/v1/friendship_request";
    const data = {
      contact: {
        email: userInfo.mail,
      },
    };

    const response = await APIPost(url, data);
    if (response.error) {
      // Manejar el error
      console.error("Error al Solicitar Amistad:", response.error);
      Alert.alert(
        "Error",
        "No se pudo hacer la solicitud. Verifique no tener invitaciones pendientes del usuario o intente de nuevo."
      );
    } else {
      // Continuar en caso de éxito
      setEstado("solicitudEnviada");
    }
  };

  const fetchUserPosts = async (currentPage) => {
    setIsFetchingMore(true);
    const url = `/api/v1/users/${userID}/posts?page=${currentPage}`;
    const response = await APIGet(url);

    if (!response.error) {
      // Ordena los posts de más nuevo a más viejo
      const newPosts = response.data.data.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      setUserInfo({
        nombre: titleCase(response.data.profile.name),
        apellidoPaterno: titleCase(response.data.profile.first_last_name),
        apellidoMaterno: titleCase(response.data.profile.second_last_name),
        mail: response.data.profile.email,
        avatar: response.data.profile.avatar
          ? { uri: response.data.profile.avatar }
          : imageMap["Blank"],
        friend: response.data.profile.is_my_friend,
      });

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

  useFocusEffect(
    useCallback(() => {
      fetchUserPosts(page);
    }, [page])
  );

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

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchUserPosts(1).then(() => {
      setIsRefreshing(false);
      setPage(1); // Reinicia a la primera página
    });
  }, []);

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
            size={25}
            color="#060B4D"
            style={{ marginTop: 50, marginRight: 15 }}
          />
        </TouchableOpacity>
      </View>
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
        <View style={{ flexDirection: "row", marginBottom: 15 }}>
          <Image style={styles.fotoPerfil} source={userInfo.avatar} />
          <View style={{ marginTop: 5, alignSelf: "center" }}>
            <Text style={styles.textoNombre}>
              {userInfo.nombre +
                " " +
                userInfo.apellidoPaterno +
                " " +
                userInfo.apellidoMaterno}
            </Text>
            <Text style={styles.textoMail}>{userInfo.mail}</Text>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          {estado === "inicial" && (
            <TouchableOpacity
              style={styles.botonConf}
              onPress={() => postRequest()}
            >
              <Text style={styles.textoBoton}>Conectar</Text>
            </TouchableOpacity>
          )}
          {estado === "solicitudEnviada" && (
            <TouchableOpacity
              style={styles.botonConectado}
              onPress={() => setModalVisible(true)}
            >
              <Text style={[styles.textoBoton, { color: "grey" }]}>
                Solicitud Enviada
              </Text>
            </TouchableOpacity>
          )}
        </View>
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
        </ScrollView> */}
        {/* View de los Posts del Usuario */}
        {userInfo.friend === true && posts.length > 0 && (
          <View style={{ marginTop: 15 }}>
            {!isLoading &&
              posts.map((post) => (
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
                  foto={imageMap["Blank"]} // Reemplazar con datos reales si están disponibles
                  body={post.body}
                  perfil={
                    user.avatar ? { uri: user.avatar } : imageMap["Blank"]
                  } // Reemplazar con datos reales si están disponibles
                  personal={false}
                  comentarios={post.count_comments}
                />
              ))}
          </View>
        )}
        {userInfo.friend === true && posts.length === 0 && (
          <View
            style={{
              marginTop: 150,
              alignSelf: "center",
            }}
          >
            <Text style={styles.textoMensaje}>
              El usuario no tiene publicaciones
            </Text>
          </View>
        )}
        {userInfo.friend === false && (
          <View
            style={{
              marginTop: 150,
              alignSelf: "center",
            }}
          >
            <EvilIcons
              name="lock"
              size={70}
              color="grey"
              style={{ alignSelf: "center", marginBottom: 10 }}
            />
            <Text style={styles.textoMensaje}>
              No puedes ver las publicaciones de un usuario que no esta en tu
              red
            </Text>
          </View>
        )}
        {isFetchingMore && userInfo.friend && (
          <View style={styles.activityIndicatorContainer}>
            <ActivityIndicator size={75} color="#060B4D" />
          </View>
        )}
      </ScrollView>

      {/* Modal para mostrar si se presióna el boton de SOLICITUD ENVIADA*/}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.fullScreenButton}
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}
        >
          <View style={styles.modalView}>
            <Text style={{ fontSize: 13 }}>
              ¿Seguro que deseas eliminar la solicutud de conexión?
            </Text>
            <TouchableOpacity
              style={styles.buttonModal}
              onPress={() => [setEstado("inicial"), setModalVisible(false)]}
            >
              <Text style={{ color: "red" }}>Eliminar Solicitud</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ marginTop: 10 }}
              onPress={() => setModalVisible(false)}
            >
              <Text>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
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
    marginRight: 50,
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
  tresPuntos: {
    alignItems: "center",
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
    marginLeft: 20,
    marginRight: 10,
    width: 80,
    height: 80,
    borderRadius: 80,
    marginTop: 10,
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
  buttonContainer: {
    marginHorizontal: 20,
    alignSelf: "center",
    flex: 1,
    borderRadius: 8,
    flexDirection: "row",
  },
  botonConf: {
    height: 31,
    marginHorizontal: 20,
    alignSelf: "center",
    borderRadius: 8,
    flex: 1,
    borderRadius: 8,
    backgroundColor: "#2FF690",
  },
  botonConectado: {
    height: 31,
    marginHorizontal: 20,
    alignSelf: "center",
    borderRadius: 8,
    flex: 1,
    borderRadius: 8,
    backgroundColor: "#D5D5D5",
  },
  textoBoton: {
    fontSize: 15,
    fontFamily: "opensansbold",
    textAlign: "center",
    paddingTop: 3,
    color: "#060B4D",
  },
  textoMensaje: {
    textAlign: "center",
    color: "grey",
    width: 250,
    fontSize: 15,
    fontFamily: "opensans",
  },
  // Estilos para el Modal que aparece si se elimina una conexión
  fullScreenButton: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    paddingBottom: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    position: "absolute",
    width: "100%",
    alignSelf: "center",
  },
  buttonModal: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginVertical: 5,
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default VerPerfiles;
