// Importaciones de React Native y React
import { Image, Text } from "react-native";
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
  iconWidth = 25,
  iconHeight = 25
) => ({
  headerShown: false,
  tabBarLabel: ({ focused, color }) => (
    <Text
      style={{
        color: focused ? "#29364d" : color,
        fontSize: 13,
      }}
    >
      {label}
    </Text>
  ),
  tabBarIcon: ({ focused, color, size }) => (
    <Image
      source={iconSource}
      style={{
        width: focused ? iconWidth * 1.2 : iconWidth, // Aumentar tamaño si está enfocado
        height: focused ? iconHeight * 1.2 : iconHeight,
        tintColor: focused ? "#29364d" : color,
      }}
    />
  ),
});

function MainFlow() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Inicio"
        component={Inicio}
        options={createTabScreenOptions(
          require("./assets/images/Inicio.png"),
          "Inicio"
        )}
      />
      <Tab.Screen
        name="Mi Red"
        component={MiRed}
        options={createTabScreenOptions(
          require("./assets/images/MiRed.png"),
          "Mi Red",
          35,
          25
        )}
      />
      <Tab.Screen
        name="Crear"
        component={Crear}
        options={createTabScreenOptions(
          require("./assets/images/Crear.png"),
          "Crear"
        )}
      />
      <Tab.Screen
        name="Movimientos"
        component={Movimientos}
        options={createTabScreenOptions(
          require("./assets/images/Movimientos.png"),
          "Movimientos"
        )}
      />
      <Tab.Screen
        name="Perfil"
        component={Perfil}
        options={createTabScreenOptions(
          require("./assets/images/Perfil.png"),
          "Perfil"
        )}
      />
    </Tab.Navigator>
  );
}

function MyDrawer() {
  return (
    <Drawer.Navigator drawerContent={(props) => <SettingsDrawer />}>
      {/* Your Drawer Screens */}
      <Drawer.Screen name="Perfil" component={Perfil} />
    </Drawer.Navigator>
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
  /*const initialRouteName =
    userInfo && userInfo.loggedIn === true ? "AuthPinPad" : "InitialScreen";*/

  // Comnentar esta linea, se utiliza para pruebas y emepzar de la pagina deseada
  const initialRouteName = "MainFlow";

  // Proporcionar el UserProvider para el contexto de usuario
  return (
    <Stack.Navigator initialRouteName={initialRouteName}>
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

// Componente principal de la aplicación
export default function App() {
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
        <Drawer.Navigator
          screenOptions={{
            drawerPosition: "right",
          }}
          drawerContent={(props) => <SettingsDrawer {...props} />}
        >
          <Drawer.Screen
            name="LoginFlow"
            component={LoginFlow}
            options={{ headerShown: false }}
          />
        </Drawer.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}
