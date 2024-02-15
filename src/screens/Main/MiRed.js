// Importaciones de React Native y React
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Keyboard,
  TouchableWithoutFeedback,
  RefreshControl,
} from "react-native";
import React, { useState, useContext, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { ActivityIndicator } from "react-native-paper";
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

const MiRed = () => {
  // Estados y Contexto
  const [text, setText] = useState("");
  const [focus, setFocus] = useState("MiRed");
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [network, setNetwork] = useState([]);
  const [pending, setPending] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const { user, setUser } = useContext(UserContext); // Contexto del usuario

  // Mapa para cargar todas las imagenes
  const imageMap = {
    Blank: require("../../../assets/images/blankAvatar.jpg"),
    // ... más imágenes
  };

  // Seccion de Funciones

  // Funcion para obtener las busquedas del searchbar
  const fetchSearch = async (query) => {
    const url = `/api/v1/search?query=${query}`;

    const result = await APIGet(url);

    if (result.error) {
      console.error("Error al obtener la busqueda:", result.error);
    } else {
      const filteredResults = result.data.data
        .filter((post) => post.id !== user.userID) // Filtrar los posts donde post.id es igual a user.userID
        .sort((a, b) => b.id - a.id);
      console.log("Resultados de la busqueda:", filteredResults);
      setSearchResults(filteredResults);
    }
  };

  // Funcion para obtener los miembros de la red del usuario loggeado
  const fetchNetwork = async () => {
    setIsLoading(true);
    const url = `/api/v1/network/members`;

    const result = await APIGet(url);

    if (result.error) {
      console.error("Error al obtener la red del usuario:", result.error);
    } else {
      const filteredResults = result.data.data.sort((a, b) => b.id - a.id);
      console.log("Resultados de la red:", filteredResults);
      setNetwork(filteredResults);
      setUser({ ...user, conexiones: network.length });
    }
    setIsLoading(false);
  };

  // Funcion para obtener las solicitudes pendientes del usuario loggeado
  const fetchPending = async () => {
    setIsLoading(true);
    const url = `/api/v1/network/requests_pending`;

    const result = await APIGet(url);

    if (result.error) {
      console.error(
        "Error al obtener las solicitudes pendientes:",
        result.error
      );
    } else {
      // Filtrar los resultados para que salagan de mas nuevo a mas viejo
      const filteredResults = result.data.data.sort((a, b) => b.id - a.id);
      console.log("Resultados de las solicitudes pendientes:", filteredResults);
      setPending(filteredResults);
    }
    setIsLoading(false);
  };

  // Funcion para obtener las invitaciones pendientes del usuario loggeado
  const fetchInvitations = async () => {
    setIsLoading(true);
    const url = `/api/v1/network/invitations`;

    const result = await APIGet(url);

    if (result.error) {
      console.error("Error al obtener las invitaciones:", result.error);
    } else {
      const filteredResults = result.data.data.sort((a, b) => b.id - a.id);
      console.log("Resultados de las invitaciones:", filteredResults);
      setInvitations(filteredResults);
    }
    setIsLoading(false);
  };

  // Efecto para cargar la red del usuario loggeado
  useEffect(() => {
    let counter = 0;
    if (focus === "MiRed" && counter === 0) {
      fetchNetwork();
      counter++;
    }
  }, []);

  // Efecto para cargar las solicitudes pasadas en el parametro fetchFunction con los RefreshControl
  const onRefresh = async (fetchFunction) => {
    setRefreshing(true);
    try {
      await fetchFunction();
    } catch (e) {
      console.error(e);
    }
    setRefreshing(false);
  };

  // Funcion para convertir la primera letra de cada palabra en mayuscula
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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{ flex: 1 }}>
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
          <Text style={styles.tituloPantalla}>Mi Red</Text>
          <TouchableOpacity>
            <Feather
              name="bell"
              size={25}
              color="#060B4D"
              style={{ marginTop: 50 }}
            />
          </TouchableOpacity>
        </View>

        {/* Barra de Busqueda, input*/}
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
                fetchSearch(text);
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

        {/* Vista para mostarr los Resultados de la busqueda si se empieza a buscar */}
        {isSearching && (
          <View style={styles.searchResultsContainer}>
            <ScrollView>
              {/* Se mapean los resultados de la API y se muestran con su componente */}
              {searchResults.map((search, index) => (
                <SearchResult
                  key={index}
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

        {/* Vista para mostrar los Tabs de Mi Red, Solicitudes e Invitaciones */}
        {!isSearching && (
          <View style={styles.tabsContainer}>
            {/* Boton Mi Red */}
            <TouchableOpacity
              style={styles.tab}
              onPress={() => [setFocus("MiRed"), fetchNetwork()]}
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
              onPress={() => [setFocus("Solicitudes"), fetchPending()]}
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
              onPress={() => [setFocus("Invitaciones"), fetchInvitations()]}
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

        {/* Si esta cargando los elementos mostrar un Activity Indicator */}
        {isLoading && (
          <View style={{ marginTop: 150 }}>
            <ActivityIndicator size={75} color="#060B4D" />
          </View>
        )}

        {/* Si no esta cargando mostrar los elementos de la red, solicitudes o invitaciones */}
        {!isLoading && (
          <>
            {/* Si el estado es MiRed se llama a la API y muestran los resulados del network del usuario */}
            {focus === "MiRed" && (
              <ScrollView
                style={{ flex: 1 }}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={() => onRefresh(fetchNetwork)}
                    tintColor="#060B4D" // Usado en iOS
                    colors={["#060B4D"]} // Usado en Android
                  />
                }
              >
                {/* Se mapean los resultados de la API y se muestran con su componente */}
                {network.length > 0 ? (
                  network.map((network, index) => (
                    <Conexion
                      key={index}
                      userID={network.id}
                      nombre={titleCase(network.full_name)}
                      imagen={
                        network.avatar ? network.avatar : imageMap["Blank"]
                      }
                      mail={network.email}
                    />
                  ))
                ) : (
                  /* Si no hay resultados mostrar un mensaje de que no hay miembros en la red */
                  <Text
                    style={{
                      marginTop: 150,
                      fontSize: 16,
                      fontFamily: "opensans",
                      color: "#060B4D",
                      textAlign: "center",
                    }}
                  >
                    No tienes miembros en tu red.{"\n"}¡Invita a tus amigos y
                    conocidos!
                  </Text>
                )}
              </ScrollView>
            )}

            {/* Si el estado es Solicitudes se llama a la API y muestran los resulados de las solicitudes pendientes del usuario */}
            {focus === "Solicitudes" && (
              <ScrollView
                style={{ flex: 1 }}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={() => onRefresh(fetchPending)}
                    tintColor="#060B4D" // Usado en iOS
                    colors={["#060B4D"]} // Usado en Android
                  />
                }
              >
                {/* Se mapean los resultados de la API y se muestran con su componente */}
                {pending.length > 0 ? (
                  pending.map((pending, index) => (
                    <Solicitudes
                      key={index}
                      objectID={pending.id}
                      userID={pending.user_id}
                      nombre={titleCase(pending.full_name)}
                      imagen={
                        pending.avatar ? pending.avatar : imageMap["Blank"]
                      }
                      mail={pending.email}
                    />
                  ))
                ) : (
                  /* Si no hay resultados mostrar un mensaje de que no hay solicitudes pendientes */
                  <Text
                    style={{
                      marginTop: 150,
                      fontSize: 16,
                      fontFamily: "opensans",
                      color: "#060B4D",
                      textAlign: "center",
                    }}
                  >
                    No tienes solicitudes por ser aceptadas
                  </Text>
                )}
              </ScrollView>
            )}

            {/* Si el estado es Invitaciones se llama a la API y muestran los resulados de las invitaciones pendientes del usuario */}
            {focus === "Invitaciones" && (
              <ScrollView
                style={{ flex: 1 }}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={() => onRefresh(fetchInvitations)}
                    tintColor="#060B4D" // Usado en iOS
                    colors={["#060B4D"]} // Usado en Android
                  />
                }
              >
                {/* Se mapean los resultados de la API y se muestran con su componente */}
                {invitations.length > 0 ? (
                  invitations.map((invitation, index) => (
                    <Invitaciones
                      key={index}
                      userID={invitation.user_id}
                      objectID={invitation.id}
                      nombre={titleCase(invitation.full_name)}
                      imagen={
                        invitation.avatar
                          ? invitation.avatar
                          : imageMap["Blank"]
                      }
                      mail={invitation.email}
                    />
                  ))
                ) : (
                  /* Si no hay resultados mostrar un mensaje de que no hay invitaciones pendientes */
                  <Text
                    style={{
                      marginTop: 150,
                      fontSize: 16,
                      fontFamily: "opensans",
                      color: "#060B4D",
                      textAlign: "center",
                    }}
                  >
                    No tienes invitaciones pendientes
                  </Text>
                )}
              </ScrollView>
            )}
          </>
        )}
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
