// Importaciones de React Native y React
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useState, useContext } from "react";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
// Importaciones de Hooks y Componentes
import { APIGet } from "../../API/APIService";
import { UserContext } from "../../hooks/UserContext";
import { Ionicons, Feather, AntDesign, Foundation } from "@expo/vector-icons";
import Conexion from "../../components/Conexion";
import Solicitudes from "../../components/Solicitudes";
import Invitaciones from "../../components/Invitaciones";
import SearchResult from "../../components/SearchResult";

const screenWidth = Dimensions.get("window").width;
const widthThird = screenWidth / 3;

const MiRed = ({ navigation }) => {
  // Estados y Contexto
  const [text, setText] = useState("");
  const [focus, setFocus] = useState("MiRed");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const { user, setUser } = useContext(UserContext);

  // Mapa para cargar todas las imagenes
  const imageMap = {
    Antonio: require("../../../assets/images/Fotos_Personas/Antonio.png"),
    Natasha: require("../../../assets/images/Fotos_Personas/Natahsa.png"),
    Quill: require("../../../assets/images/Fotos_Personas/Quill.png"),
    Clint: require("../../../assets/images/Fotos_Personas/Clint.png"),
    Blank: require("../../../assets/images/blankAvatar.jpg"),
    Bruce: require("../../../assets/images/Fotos_Personas/Bruce.png"),
    Carol: require("../../../assets/images/Fotos_Personas/Carol.png"),
    Jane: require("../../../assets/images/Fotos_Personas/Jane.png"),
    Blank: require("../../../assets/images/blankAvatar.jpg"),
    Sliders: require("../../../assets/images/Sliders.png"),
    // ... más imágenes
  };

  const fetchQuery = async (query) => {
    const url = `/api/v1/search?query=${query}`;

    const result = await APIGet(url);

    if (result.error) {
      console.error("Error al obtener la busqueda:", result.error);
    } else {
      const filteredResults = result.data.data
        .filter((post) => post.id !== user.userID) // Filtrar los posts donde post.id es igual a user.userID
        .sort((a, b) => b.id - a.id);
      console.log("Resultados de la busqueda:", filteredResults);
      setSearchResults(filteredResults); // Guardar los datos de las publicaciones en el estado
    }
  };

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
    //Fondo
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{ flex: 1 }}>
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
          <Text style={styles.tituloPantalla}>Mi Red</Text>
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

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.input}
            placeholder="Buscar"
            placeholderTextColor="#060B4D"
            onChangeText={(text) => {
              setText(text);
              if (text.length > 0) {
                const focus = focus;
                setIsSearching(true);
                setFocus(null);
                fetchQuery(text);
              } else if (text.length === 0) {
                setIsSearching(false);
                setFocus("MiRed");
              }
            }}
            value={text}
            maxLength={500}
          />
          <Ionicons
            name="search-sharp"
            size={25}
            color="#060B4D"
            style={styles.search}
          />
          <TouchableOpacity>
            <Foundation
              name="filter"
              size={30}
              color="#060B4D"
              style={styles.filter}
            />
          </TouchableOpacity>
        </View>

        {isSearching && (
          <View style={styles.searchResultsContainer}>
            <ScrollView>
              {searchResults.map((search) => (
                <SearchResult
                  key={search.id}
                  userID={search.id}
                  nombre={titleCase(search.full_name)}
                  imagen={
                    search.avatar ? { uri: search.avatar } : imageMap["Blank"]
                  }
                />
              ))}
            </ScrollView>
          </View>
        )}

        {!isSearching && (
          <View style={styles.tabsContainer}>
            {/* Boton Mi Red */}
            <TouchableOpacity
              style={styles.tab}
              onPress={() => setFocus("MiRed")}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: focus === "MiRed" ? "#060B4D" : "#C4C6C9" },
                ]}
              >
                Mi Red
              </Text>
              {focus === "MiRed" ? <View style={styles.focusLine} /> : null}
            </TouchableOpacity>

            {/* Boton Solicitudes */}
            <TouchableOpacity
              style={styles.tab}
              onPress={() => setFocus("Solicitudes")}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: focus === "Solicitudes" ? "#060B4D" : "#C4C6C9" },
                ]}
              >
                Solicitudes
              </Text>
              {focus === "Solicitudes" ? (
                <View style={styles.focusLine} />
              ) : null}
            </TouchableOpacity>

            {/* Boton Invitaciones */}
            <TouchableOpacity
              style={styles.tab}
              onPress={() => setFocus("Invitaciones")}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: focus === "Invitaciones" ? "#060B4D" : "#C4C6C9" },
                ]}
              >
                Invitaciones
              </Text>
              {focus === "Invitaciones" ? (
                <View style={styles.focusLine} />
              ) : null}
            </TouchableOpacity>
          </View>
        )}

        {focus === "MiRed" ? (
          <View style={{ flex: 1 }}>
            <Conexion
              nombre={"Natasha Ocasio Romanoff"}
              imagen={imageMap["Natasha"]}
            />
            <Conexion
              nombre={"Antonio Stark Rivera"}
              imagen={imageMap["Antonio"]}
            />
            <Conexion
              nombre={"Jose Antonio Quill"}
              imagen={imageMap["Quill"]}
            />
          </View>
        ) : null}

        {focus === "Solicitudes" ? (
          <View style={{ flex: 1 }}>
            <Solicitudes
              nombre={"Bruce García Banner"}
              imagen={imageMap["Bruce"]}
            />
            <Solicitudes
              nombre={"Carol Danvers Miller"}
              imagen={imageMap["Carol"]}
            />
          </View>
        ) : null}

        {focus === "Invitaciones" ? (
          <View style={{ flex: 1 }}>
            <Invitaciones
              nombre={"Janet Foster Cruz"}
              imagen={imageMap["Jane"]}
            />
          </View>
        ) : null}

        {/*<TouchableOpacity
        style={styles.administrar}
        onPress={() => navigation.navigate("SolicitudesConexion")}
      >
        <Text style={styles.texto}>Administar mi Red</Text>
        <Text style={styles.subTexto}>3 conexiones nuevas</Text>
        <AntDesign
          name="arrowright"
          size={30}
          color="#29364d"
          style={styles.arrow}
        />
      </TouchableOpacity>
      <ScrollView style={styles.scroll}>
        <Notificacion
          nombre="Natahsa Ocasio Romanoff"
          body="ha dado me gusta a tu ultima publicación."
          imagen={imageMap["Natasha"]}
          tiempo="45 minutos"
        />
        <Notificacion
          nombre="Jose Antonio Quill"
          body="ha dado me gusta a tu ultima publicación."
          imagen={imageMap["Quill"]}
          tiempo="1 hora"
        />
        <Notificacion
          nombre="Clint Branton López"
          body="ha dado me gusta a tu ultima publicación."
          imagen={imageMap["Clint"]}
          tiempo="1 hora"
        />
        <Notificacion
          nombre="Clint Branton López"
          body="ha comentado en tu ultima publicación."
          imagen={imageMap["Clint"]}
          tiempo="1 hora"
        />
        */}
        {/*</ScrollView>*/}
      </View>
    </TouchableWithoutFeedback>
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
  fotoPerfil: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  sliders: {
    width: 25,
    height: 23,
    marginTop: 50,
  },
  searchContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    marginTop: 3,
    paddingVertical: 10,
    paddingHorizontal: 40,
  },
  searchResultsContainer: {
    width: "100%",
    height: "100%",
    zIndex: 1,
    flex: 1,
  },
  input: {
    paddingLeft: 40,
    borderRadius: 20,
    borderColor: "#D5D5D5",
    borderWidth: 1.5,
    marginLeft: 10,
    paddingHorizontal: 15,
    flex: 1,
    color: "#060B4D",
    fontSize: 15,
    fontFamily: "opensans",
  },
  search: {
    position: "absolute",
    top: 12.5,
    left: 60,
  },
  filter: {
    marginTop: 0,
    alignSelf: "center",
    marginLeft: 10,
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    marginTop: 3,
    paddingTop: 20,
    zIndex: -1,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    flexDirection: "column",
  },
  tabText: {
    fontSize: 17,
    fontFamily: "opensansbold",
  },
  focusLine: {
    height: 7,
    width: widthThird,
    marginTop: 18,
    backgroundColor: "#060B4D",
  },
  administrar: {
    flexDirection: "row",
    height: 50,
    width: "100%",
    borderColor: "#D5D5D5",
    borderWidth: 1,
    marginTop: 20,
    alignSelf: "center",
    borderRadius: 15,
    color: "#29364d",
    paddingHorizontal: 20,
  },
  texto: {
    flex: 2,
    fontSize: 18,
    color: "#29364d",
    marginTop: 13,
  },
  subTexto: {
    fontSize: 11,
    color: "#C0C0C0",
    marginTop: 17.5,
    right: 10,
  },
  arrow: {
    top: 10,
  },
  scroll: {
    flex: 1,
    width: "100%",
    paddingTop: 5,
  },
});

export default MiRed;
