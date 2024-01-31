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
} from "react-native";
import React, { useState, useContext } from "react";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
// Importaciones de Hooks y Componentes
import { UserContext } from "../../hooks/UserContext";
import { Ionicons, Feather, AntDesign, Foundation } from "@expo/vector-icons";
import Conexion from "../../components/Conexion";
import Solicitudes from "../../components/Solicitudes";
import Invitaciones from "../../components/Invitaciones";

const screenWidth = Dimensions.get("window").width;
const widthThird = screenWidth / 3;

const MiRed = ({ navigation }) => {
  // Estados y Contexto
  const [text, setText] = useState("");
  const [focus, setFocus] = useState("MiRed");
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
    Sliders: require("../../../assets/images/Sliders.png"),
    // ... más imágenes
  };

  // Componente visual
  return (
    //Fondo
    <View style={{ flex: 1 }}>
      <View style={styles.tituloContainer}>
        {/* Titulo, Campana e Imagen */}
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
          onChangeText={setText}
          value={text}
          maxLength={500}
        />
        <Ionicons
          name="search-sharp"
          size={30}
          color="#060B4D"
          style={styles.search}
        />
        <TouchableOpacity>
          <Foundation
            name="filter"
            size={35}
            color="#060B4D"
            style={styles.filter}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.tabsContainer}>
        {/* Boton Mi Red */}
        <TouchableOpacity style={styles.tab} onPress={() => setFocus("MiRed")}>
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
          {focus === "Solicitudes" ? <View style={styles.focusLine} /> : null}
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
          {focus === "Invitaciones" ? <View style={styles.focusLine} /> : null}
        </TouchableOpacity>
      </View>

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
          <Conexion nombre={"Jose Antonio Quill"} imagen={imageMap["Quill"]} />
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
      <TouchableOpacity onPress={() => navigation.navigate("VerPerfiles")}>
        <Text>Ver otro Perfil (prueba)</Text>
      </TouchableOpacity>
      {/*</ScrollView>*/}
    </View>
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
    fontSize: 40,
    marginTop: 60,
  },
  fotoPerfil: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  sliders: {
    width: 32,
    height: 30,
    marginTop: 70,
  },
  searchContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    marginTop: 3,
    paddingVertical: 10,
    paddingHorizontal: 40,
  },
  input: {
    paddingLeft: 45,
    height: 40,
    borderRadius: 20,
    borderColor: "#D5D5D5",
    borderWidth: 1.5,
    marginLeft: 10,
    paddingHorizontal: 15,
    flex: 1,
    color: "#060B4D",
    fontSize: 18,
    fontFamily: "opensans",
  },
  search: {
    position: "absolute",
    top: 12.5,
    left: 60,
  },
  filter: {
    marginTop: 2.5,
    alignSelf: "center",
    marginLeft: 10,
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    marginTop: 3,
    paddingTop: 30,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    flexDirection: "column",
  },
  tabText: {
    fontSize: 19,
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
