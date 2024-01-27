// Importaciones de React Native y React
import { Image, View, Dimensions, Animated } from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserProvider } from "./src/hooks/UserContext";
import { setToken, getToken } from "./src/API/APIService";
// Importar pantallas de la aplicación
import InitialScreen from "./src/screens/LogIn/InitialScreen";
import Registro1 from "./src/screens/LogIn/Registro1";
import Registro2 from "./src/screens/LogIn/Registro2";
import Registro3 from "./src/screens/LogIn/Registro3";
import Registro4 from "./src/screens/LogIn/Registro4";
import SetPinPad from "./src/screens/LogIn/SetPinPad";
import ConfirmSetPinPad from "./src/screens/LogIn/ConfirmSetPinPad";
import OlvideContrasena from "./src/screens/LogIn/OlivideContrasena";
import AuthPinPad from "./src/screens/LogIn/AuthPinPad";
import Inicio from "./src/screens/Main/Inicio";
import MiRed from "./src/screens/Main/MiRed";
import VerPerfiles from "./src/screens/Main/VerPerfiles";
import Crear from "./src/screens/Main/Crear";
import CrearModal from "./src/components/CrearModal";
import Movimientos from "./src/screens/Main/Movimientos";
import Perfil from "./src/screens/Main/Perfil";
import SolicitudesConexion from "./src/screens/Main/SolicitudesConexion";
import MisConexiones from "./src/screens/Main/MisConexiones";
import LoginProgresivo from "./src/screens/Main/LoginProgresivo";
import LoginProgresivo2 from "./src/screens/Main/LoginProgresivo2";
import EditarPerfil from "./src/screens/Main/EditarPerfil";
// Importar Componnetes de la aplicación
import SettingsDrawer from "./src/components/SettingsDrawer";

// Crear un Stack, Tab y Drawer Navigators para la navegación
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// Obtener el ancho de la pantalla
const screenWidth = Dimensions.get("window").width;
const tabBarIconWidth = screenWidth / 5;

const Placeholder = () => null;

// Estilos comunes para los íconos y textos de la tabBar
const createTabScreenOptions = (
  iconSource,
  label,
  customFocusedTab,
  iconWidth = 25,
  iconHeight = 25
) => ({
  headerShown: false,
  tabBarIcon: ({ focused, color, size }) => {
    const isFocused = customFocusedTab ? customFocusedTab === label : focused;
    return (
      <View style={{ alignContent: "center", alignItems: "flex-start" }}>
        <Image
          style={{
            height: 5,
            width: tabBarIconWidth,
            marginBottom: label === "Inicio" ? 8 : 7,
            tintColor: isFocused ? "#060B4D" : "#9CA1AA",
            backgroundColor: isFocused ? "#060B4D" : "#ffffff",
          }}
        />
        <Image
          source={
            isFocused && label === "Crear"
              ? require("./assets/images/Crear2.png")
              : iconSource
          }
          style={{
            zIndex: 1000,
            marginTop: 10,
            marginBottom: label === "MiRed" || "Crear" ? 0 : 5,
            alignSelf: "center",
            width: iconWidth,
            height: iconHeight,
            tintColor: isFocused ? "#060B4D" : "#9CA1AA",
          }}
        />
      </View>
    );
  },
});

// Pantalla Perfil con Drawer
function PerfilMain() {
  return (
    <Drawer.Navigator
      screenOptions={{ drawerPosition: "right" }}
      drawerContent={(props) => <SettingsDrawer {...props} />}
    >
      <Drawer.Screen
        name="Perfil"
        component={Perfil}
        options={{ headerShown: false }}
      />
      {/* Agrega otras pantallas si necesitas dentro del Drawer */}
    </Drawer.Navigator>
  );
}

function PerfilLoginProgresivo() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PerfilMain" component={PerfilMain} />
      <Stack.Screen name="LoginProgresivo" component={LoginProgresivo} />
      <Stack.Screen name="LoginProgresivo2" component={LoginProgresivo2} />
      <Stack.Screen name="EditarPerfil" component={EditarPerfil} />
    </Stack.Navigator>
  );
}

function MiRedStackScreen() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MiRedMain" component={MiRed} />
      <Stack.Screen
        name="SolicitudesConexion"
        component={SolicitudesConexion}
      />
      <Stack.Screen name="MisConexiones" component={MisConexiones} />
      <Stack.Screen name="VerPerfiles" component={VerPerfiles} />
    </Stack.Navigator>
  );
}

function MainFlow() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [customFocusedTab, setCustomFocusedTab] = useState("");
  const [previousActiveTab, setPreviousActiveTab] = useState("");

  const handleTabPress = (e, routeName) => {
    if (routeName === "Crear") {
      e.preventDefault();
      if (isModalVisible) {
        setIsModalVisible(false); // Cierra el modal
      } else {
        setPreviousActiveTab(customFocusedTab);
        setIsModalVisible(true);
        setCustomFocusedTab("Crear");
      }
    } else {
      if (isModalVisible) {
        e.preventDefault();
        setIsModalVisible(false); // Cierra el modal
      } else {
        setCustomFocusedTab(routeName);
      }
    }
  };

  return (
    <>
      <Tab.Navigator
        screenOptions={{
          tabBarShowLabel: false,
          tabBarStyle: {
            shadowOffset: { width: 0, height: -2 }, // Desplazamiento de la sombra
            shadowOpacity: 0.3, // Opacidad de la sombra
            shadowRadius: 4, // Radio de la sombra
            elevation: 5, // Elevación para Android
            shadowColor: "#000000", // Color de la sombra
            borderTopColor: "transparent", // Color del borde superior
          },
        }}
      >
        <Tab.Screen
          name="Inicio"
          component={Inicio}
          listeners={{
            tabPress: (e) => handleTabPress(e, "Inicio"),
          }}
          options={createTabScreenOptions(
            require("./assets/images/Inicio.png"),
            "Inicio",
            customFocusedTab,
            27,
            27
          )}
        />
        <Tab.Screen
          name="Mi Red"
          component={MiRedStackScreen}
          listeners={{
            tabPress: (e) => handleTabPress(e, "Mi Red"),
          }}
          options={createTabScreenOptions(
            require("./assets/images/MiRed.png"),
            "Mi Red",
            customFocusedTab,
            35,
            28
          )}
        />
        <Tab.Screen
          name="Crear"
          component={Placeholder}
          listeners={{
            tabPress: (e) => handleTabPress(e, "Crear"),
          }}
          options={createTabScreenOptions(
            require("./assets/images/Crear1.png"),
            "Crear",
            customFocusedTab,
            28,
            28
          )}
        />
        <Tab.Screen
          name="Movimientos"
          component={Movimientos}
          listeners={{
            tabPress: (e) => handleTabPress(e, "Movimientos"),
          }}
          options={createTabScreenOptions(
            require("./assets/images/List.png"),
            "Movimientos",
            customFocusedTab,
            32,
            28
          )}
        />
        <Tab.Screen
          name="Perfil"
          component={PerfilLoginProgresivo}
          listeners={{
            tabPress: (e) => handleTabPress(e, "Perfil"),
          }}
          options={createTabScreenOptions(
            require("./assets/images/Graph.png"),
            "Perfil",
            customFocusedTab,
            32,
            28
          )}
        />
      </Tab.Navigator>
      {isModalVisible && (
        <CrearModal
          isVisible={isModalVisible}
          onClose={() => {
            setIsModalVisible(false);
            setCustomFocusedTab(previousActiveTab);
            setPreviousActiveTab("");
          }}
        />
      )}
    </>
  );
}

function LoginFlow() {
  // Estados para manejar la información del usuario y la carga de datos
  const [userInfo, setUserInfo] = useState(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Ignorar advertencias específicas en modo de desarrollo (Utilizar unicamente en demostraciones y descomentar en desarollo)
  /*if (__DEV__) {
    const originalConsoleWarn = console.warn;
    console.warn = (message) => {
      if (message.indexOf("Some specific warning to ignore") <= -1) {
        originalConsoleWarn(message);
      }
    };
  }*/

  // Función para cargar los datos del usuario desde AsyncStorage
  const loadUserData = async () => {
    try {
      const value = await AsyncStorage.getItem("userInfo");
      if (value !== null) {
        console.log("Información recuperada con éxito");
        const parsedValue = JSON.parse(value);

        // Asignar valores a variables individuales
        const userPin = parsedValue.pin;
        const userLoggedIn = parsedValue.loggedIn;
        setToken(parsedValue.userToken);

        console.log(value);

        return {
          userPin,
          userLoggedIn,
        };
      }
    } catch (error) {
      console.error("Error recuperando la información de usuario", error);
    }
    return null;
  };

  // useEffect para cargar los datos del usuario al iniciar la aplicación
  useEffect(() => {
    loadUserData().then((data) => {
      setUserInfo(data);
      setIsDataLoaded(true);
    });
  }, []);

  // Mostrar pantalla de carga mientras se cargan las fuentes y datos
  if (!isDataLoaded) {
    return <AppLoading />;
  }

  // Determinar la pantalla inicial basada en el estado de inicio de sesión del usuario
  /*const initialRouteName =
    userInfo && userInfo.userLoggedIn === true ? "AuthPinPad" : "InitialScreen";*/

  // Comnentar esta linea, se utiliza para pruebas y emepzar de la pagina deseada
  const initialRouteName = "MainFlow";

  // Proporcionar el UserProvider para el contexto de usuario
  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{
        gestureEnabled: false, // Deshabilita el gesto de deslizar para volver en todas las pantallas
      }}
    >
      {/* Configuración de las pantallas y sus opciones */}
      <Stack.Screen
        name="InitialScreen"
        component={InitialScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OlvideContrasena"
        component={OlvideContrasena}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AuthPinPad"
        component={AuthPinPad}
        initialParams={{
          userPin: userInfo ? userInfo.userPin : undefined,
          userLoggedIn: userInfo ? userInfo.userLoggedIn : undefined,
        }}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ConfirmSetPinPad"
        component={ConfirmSetPinPad}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SetPinPad"
        component={SetPinPad}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Registro1"
        component={Registro1}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Registro2"
        component={Registro2}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Registro3"
        component={Registro3}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Registro4"
        component={Registro4}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MainFlow"
        component={MainFlow}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LoginFlow" component={LoginFlow} />
      <Stack.Screen name="MainFlow" component={MainFlow} />
      {/* Agrega otras pantallas aquí si es necesario */}
    </Stack.Navigator>
  );
}

// Componente principal de la aplicación
export default App = () => {
  // Estado para manejar la carga de fuentes
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // Función para cargar las fuentes
  async function loadFonts() {
    await Font.loadAsync({
      conthrax: require("./assets/fonts/conthrax.ttf"),
      montserrat: require("./assets/fonts/montserrat.ttf"),
    });
    setFontsLoaded(true);
  }

  // useEffect para cargar las fuentes al iniciar la aplicación
  useEffect(() => {
    loadFonts();
  }, []);

  // Mostrar pantalla de carga mientras se cargan las fuentes
  if (!fontsLoaded) {
    return <AppLoading />;
  }

  // Contenedor de navegación para la aplicación
  return (
    <UserProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </UserProvider>
  );
};
