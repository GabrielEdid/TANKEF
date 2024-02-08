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
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import { ActivityIndicator } from "react-native-paper";
// Importaciones de Hooks y Componentes
import { Feather } from "@expo/vector-icons";
import { APIGet, APIPost } from "../../API/APIService";
import { UserContext } from "../../hooks/UserContext";
import Post from "../../components/Post";

const VerPerfiles = ({ route }) => {
  const { userID } = route.params;
  const { user, setUser } = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [estado, setEstado] = useState("inicial"); // Estados: "inicial", "solicitudEnviada"
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    mail: "",
    avatar: null,
  });

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
        "No se pudo hacer el solicitud. Intente nuevamente."
      );
    } else {
      // Continuar en caso de éxito
      setEstado("solicitudEnviada");
    }
  };

  const fetchUserPosts = async () => {
    const url = `/api/v1/users/${userID}/posts`;
    console.log("Fetching user posts from:", url);

    const result = await APIGet(url);

    if (result.error) {
      console.error("Error al obtener posts:", result.error);
    } else {
      const sortedPosts = result.data.data.sort((a, b) => b.id - a.id); // Ordena los posts de más nuevo a más viejo
      setPosts(sortedPosts); // Guardar los datos de las publicaciones en el estado
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserPosts();
    }, [])
  );

  function titleCase(str) {
    return str
      .toLowerCase()
      .split(" ")
      .map(function (word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(" ");
  }

  useEffect(() => {
    if (posts.length > 0) {
      const user = posts[0].user;
      setUserInfo({
        nombre: titleCase(user.name),
        apellidoPaterno: titleCase(user.first_last_name),
        apellidoMaterno: titleCase(user.second_last_name),
        mail: user.email,
        avatar: user.avatar ? user.avatar : imageMap["Blank"],
      });
    }
  }, [posts]);

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
      <ScrollView style={styles.scrollV}>
        {/* Contenedor Imagen, Nombre y Correo de la persona */}
        <View style={{ flexDirection: "row", marginBottom: 15 }}>
          <Image style={styles.fotoPerfil} source={imageMap["Blank"]} />
          <View style={{ marginTop: 5 }}>
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
        <Modal transparent={true} animationType="fade" visible={isLoading}>
          <View style={styles.overlay}>
            <ActivityIndicator size={75} color="#060B4D" />
          </View>
        </Modal>

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
                perfil={user.avatar ? { uri: user.avatar } : imageMap["Blank"]} // Reemplazar con datos reales si están disponibles
                personal={false}
                comentarios={post.count_comments}
              />
            ))}
        </View>
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
    color: "grey",
    fontFamily: "opensans",
    fontSize: 14,
    marginLeft: 1,
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
