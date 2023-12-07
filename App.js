// Importaciones de React Native y React
import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserProvider } from "./src/hooks/UserContext"; // Contexto para manejar el estado del usuario
// Importar pantallas de la aplicación
import InitialScreen from "./src/screens/InitialScreen";
import Registro1 from "./src/screens/Registro1";
import Registro2 from "./src/screens/Registro2";
import Registro3 from "./src/screens/Registro3";
import Registro4 from "./src/screens/Registro4";
import Main from "./src/screens/Main";
import SetPinPad from "./src/screens/SetPinPad";
import ConfirmSetPinPad from "./src/screens/ConfirmSetPinPad";
import OlvideContrasena from "./src/screens/OlivideContrasena";
import AuthPinPad from "./src/screens/AuthPinPad";

// Crear un Stack Navigator para la navegación
const Stack = createStackNavigator();

function LoginFlow() {
  // Estados para manejar la información del usuario y la carga de datos
  const [userInfo, setUserInfo] = useState(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

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
  const initialRouteName =
    userInfo && userInfo.loggedIn === true ? "AuthPinPad" : "InitialScreen";

  // Proporcionar el UserProvider para el contexto de usuario
  return (
    <UserProvider>
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
          initialParams={{ userPin: userInfo.pin }}
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
          name="Main"
          component={Main}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </UserProvider>
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
    <NavigationContainer>
      <LoginFlow />
    </NavigationContainer>
  );
}

/* POSIBLES PRAGMENTOS DE CODIGO QUE SE PUEDAN USAR DESPUES PARA LA NAVIGATION
    REUBICAR LAS LLAVES Y PARENTESIS DE ANTES 
    //
    //Signup: SignupScreen,
    //Signin: SigninScreen,
  mainFlow: createMaterialBottomTabNavigator({
    trackListFlow: createStackNavigator({
      TrackList: TrackListScreen,
      TrackDetail: TrackDetailScreen,
    }),
    TrackCreate: TrackCreateScreen,
    Account: AccountScreen,
  }),
});*/
