// Importaciones de React Native y React
import { Image, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserProvider } from "./src/hooks/UserContext"; // Contexto para manejar el estado del usuario
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
import Crear from "./src/screens/Main/Crear";
import Movimientos from "./src/screens/Main/Movimientos";
import Perfil from "./src/screens/Main/Perfil";
import SolicitudesConexion from "./src/screens/Main/SolicitudesConexion";
import MisConexiones from "./src/screens/Main/MisConexiones";
import LoginProgresivo from "./src/screens/Main/LoginProgresivo";
// Importar Componnetes de la aplicación
import SettingsDrawer from "./src/components/SettingsDrawer";

// Crear un Stack y Tab Navigator para la navegación
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// Estilos comunes para los íconos y textos de la tabBar
const createTabScreenOptions = (
  iconSource,
  label,
  iconWidth = 20,
  iconHeight = 20
) => ({
  headerShown: false,
  tabBarLabel: ({ focused, color }) => (
    <Text
      style={{
        marginBottom: -7,
        color: focused ? "#29364d" : color,
        fontSize: 12,
        fontWeight: "500",
        alignSelf: "center",
      }}
    >
      {label}
    </Text>
  ),
  tabBarIcon: ({ focused, color, size }) => (
    <View style={{ alignContent: "center", alignItems: "flex-start" }}>
      <Image
        style={{
          height: 5,
          width: 78,
          marginTop: -1,
          tintColor: focused ? "#29364d" : color,
          backgroundColor: focused ? "#29364d" : "#ffffff",
        }}
      />
      <Image
        source={iconSource}
        style={{
          marginTop: 10,
          marginBottom: 5,
          alignSelf: "center",
          width: iconWidth, // Aumentar tamaño si está enfocado
          height: iconHeight,
          tintColor: focused ? "#29364d" : color,
        }}
      />
    </View>
  ),
});

// Pantalla Perfil con Drawer
function PerfilDrawer() {
  return (
    <Drawer.Navigator
      screenOptions={{ drawerPosition: "right" }}
      drawerContent={(props) => <SettingsDrawer {...props} />}
    >
      <Drawer.Screen
        name="PerfilScreen"
        component={PerfilLoginProgresivo}
        options={{ headerShown: false }}
      />
    </Drawer.Navigator>
  );
}

function PerfilLoginProgresivo() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PerfilMain" component={Perfil} />
      <Stack.Screen name="LoginProgresivo" component={LoginProgresivo} />
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
    </Stack.Navigator>
  );
}

function MainFlow() {
  return (
    <Tab.Navigator
      screenOptions={{
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
        options={createTabScreenOptions(
          require("./assets/images/Inicio.png"),
          "Inicio",
          20,
          20
        )}
      />
      <Tab.Screen
        name="Mi Red"
        component={MiRedStackScreen}
        options={createTabScreenOptions(
          require("./assets/images/MiRed.png"),
          "Mi Red",
          27,
          20
        )}
      />
      <Tab.Screen
        name="Crear"
        component={Crear}
        options={createTabScreenOptions(
          require("./assets/images/Crear.png"),
          "Crear",
          20,
          20
        )}
      />
      <Tab.Screen
        name="Movimientos"
        component={Movimientos}
        options={createTabScreenOptions(
          require("./assets/images/Movimientos.png"),
          "Movimientos",
          18,
          20
        )}
      />
      <Tab.Screen
        name="Perfil"
        component={PerfilDrawer}
        options={createTabScreenOptions(
          require("./assets/images/Perfil.png"),
          "Perfil",
          20,
          20
        )}
      />
    </Tab.Navigator>
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
        console.log(value);
        return JSON.parse(value);
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
  /*onst initialRouteName =
    userInfo && userInfo.loggedIn === true ? "AuthPinPad" : "InitialScreen";*/

  // Comnentar esta linea, se utiliza para pruebas y emepzar de la pagina deseada
  const initialRouteName = "Registro3";

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
        initialParams={{ userPin: userInfo ? userInfo.pin : undefined }}
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
