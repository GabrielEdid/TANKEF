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
import { ActivityIndicator } from "react-native-paper";
// Importaciones de Hooks y Componentes
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
        {/* Boton de Settings */}
        <TouchableOpacity style={styles.tresPuntos}>
          <Text style={{ fontSize: 25 }}>...</Text>
        </TouchableOpacity>
        {/* Titulo Superior */}
        <Text style={styles.titulo}>TANKEF</Text>
      </View>
      <ScrollView style={styles.scrollV}>
        {/* Contenedor Imagen, Nombre y Correo de la persona */}
        <View>
          <Image style={styles.fotoPerfil} source={userInfo.avatar} />
          <Text style={styles.textoNombre}>
            {userInfo.nombre +
              " " +
              userInfo.apellidoPaterno +
              " " +
              userInfo.apellidoMaterno}
          </Text>
          <Text style={styles.textoMail}>{userInfo.mail}</Text>
        </View>

        <View style={styles.buttonContainer}>
          {estado === "inicial" && (
            <TouchableOpacity
              style={styles.botonConf}
              onPress={() => postRequest()}
            >
              <LinearGradient
                colors={["#2FF690", "#21B6D5"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.botonGradient}
              >
                <Text style={styles.textoBoton}>CONECTAR</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
          {estado === "solicitudEnviada" && (
            <TouchableOpacity
              style={styles.botonConectado}
              onPress={() => setModalVisible(true)}
            >
              <Text style={[styles.textoBoton, { color: "grey" }]}>
                SOLICITUD ENVIADA
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
                personal={true}
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
  tresPuntos: {
    alignItems: "center",
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
  buttonContainer: {
    marginTop: 10,
    width: "100%",
    flexDirection: "row",
  },
  botonGradient: {
    width: "100%",
    justifyContent: "center",
    height: 31,
    alignSelf: "center",
    borderRadius: 8,
  },
  botonConf: {
    width: "100%",
    height: 31,
    borderRadius: 8,
  },
  textoBoton: {
    fontSize: 15,
    fontFamily: "conthrax",
    textAlign: "center",
    paddingTop: 1,
    color: "white",
  },
  botonConectado: {
    height: 31,
    width: "100%",
    paddingTop: 7,
    left: 2.5,
    borderRadius: 8,
    backgroundColor: "#D5D5D5",
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
    bottom: 0,
    width: "90%",
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
