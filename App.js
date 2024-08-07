// Importaciones de React Native y React
import { Image, View, Dimensions } from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserProvider } from "./src/hooks/UserContext";
import { FinanceProvider } from "./src/hooks/FinanceContext";
import { InactivityProvider } from "./src/hooks/InactivityContext";
import { setToken, getToken } from "./src/API/APIService";
// Importar pantallas de la aplicación
import LogIn from "./src/screens/LogIn/LogIn";
import NumeroTelefonico from "./src/screens/LogIn/NumeroTelefonico";
import ConfirmNumber from "./src/screens/LogIn/ConfirmNumber";
// import Registro3 from "./src/screens/LogIn/Pantallas Login Dejadas/Registro3";
import RegistroDatos from "./src/screens/LogIn/RegistroDatos";
import SetPinPad from "./src/screens/LogIn/SetPinPad";
import ConfirmSetPinPad from "./src/screens/LogIn/ConfirmSetPinPad";
import OlvideContrasena from "./src/screens/LogIn/OlivideContrasena";
import AuthPinPad from "./src/screens/LogIn/AuthPinPad";
import Inicio from "./src/screens/Main/Inicio";
import MiRed from "./src/screens/Main/MiRed";
import VerPerfiles from "./src/screens/Main/VerPerfiles";
import VerPosts from "./src/screens/Main/VerPosts";
// import Crear from "./src/screens/Main/Pantallas Main Dejadas/Crear";
import CrearModal from "./src/components/CrearModal";
import MiTankef from "./src/screens/Main/MiTankef";
import Perfil from "./src/screens/Main/Perfil";
import SolicitudesConexion from "./src/screens/Main/Pantallas Main Dejadas/SolicitudesConexion";
import MisConexiones from "./src/screens/Main/Pantallas Main Dejadas/MisConexiones";
import LoginProgresivo from "./src/screens/Main/Pantallas Main Dejadas/LoginProgresivo";
import LoginProgresivo2 from "./src/screens/Main/Pantallas Main Dejadas/LoginProgresivo2";
import EditarPerfil from "./src/screens/Main/EditarPerfil";
import DefinirInversion from "./src/screens/Credito-Inversion-Ahorro/DefinirInversion";
import Beneficiarios from "./src/screens/Credito-Inversion-Ahorro/Beneficiarios";
import DatosBancarios from "./src/screens/Credito-Inversion-Ahorro/DatosBancarios";
import OrdenPago from "./src/screens/Credito-Inversion-Ahorro/OrdenPago";
import DefinirFirma from "./src/screens/Credito-Inversion-Ahorro/DefinirFirma";
import FirmaDomicilio from "./src/screens/Credito-Inversion-Ahorro/FirmaDomicilio";
import DefinirCredito from "./src/screens/Credito-Inversion-Ahorro/DefinirCredito";
import InfoGeneral from "./src/screens/Credito-Inversion-Ahorro/InfoGeneral";
import DefinirCajaAhorro from "./src/screens/Credito-Inversion-Ahorro/DefinirCajaAhorro";
import Documentacion from "./src/screens/Credito-Inversion-Ahorro/Documentacion";
import ObligadosSolidarios from "./src/screens/Credito-Inversion-Ahorro/ObligadosSolidarios";
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
  tabBarStyle: label === "Crear" ? { display: "none" } : {},
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
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      options={{ gestureEnabled: false }}
    >
      <Stack.Screen name="PerfilMain" component={PerfilMain} />
      <Stack.Screen name="LoginProgresivo" component={LoginProgresivo} />
      <Stack.Screen name="LoginProgresivo2" component={LoginProgresivo2} />
      <Stack.Screen name="EditarPerfil" component={EditarPerfil} />
      <Stack.Screen name="VerPosts" component={VerPosts} />
    </Stack.Navigator>
  );
}

function MiRedStackScreen() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      options={{ gestureEnabled: true }}
    >
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

function InicioStack() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      options={{ gestureEnabled: false }}
    >
      <Stack.Screen name="Incio" component={Inicio} />
      <Stack.Screen name="VerPosts" component={VerPosts} />
      <Stack.Screen name="VerPerfiles" component={VerPerfiles} />
    </Stack.Navigator>
  );
}

function CrearStack() {
  return (
    <InactivityProvider>
      <FinanceProvider>
        <Stack.Navigator
          screenOptions={{ headerShown: false }}
          options={{ gestureEnabled: false }}
        >
          <Stack.Screen name="Placeholder" component={Placeholder} />
          <Stack.Screen name="DefinirInversion" component={DefinirInversion} />
          <Stack.Screen name="DefinirCredito" component={DefinirCredito} />
          <Stack.Screen
            name="DefinirCajaAhorro"
            component={DefinirCajaAhorro}
          />
          <Stack.Screen name="Beneficiarios" component={Beneficiarios} />
          <Stack.Screen name="InfoGeneral" component={InfoGeneral} />
          <Stack.Screen name="Documentacion" component={Documentacion} />
          <Stack.Screen name="DatosBancarios" component={DatosBancarios} />
          <Stack.Screen
            name="ObligadosSolidarios"
            component={ObligadosSolidarios}
          />
          <Stack.Screen name="DefinirFirma" component={DefinirFirma} />
          <Stack.Screen name="FirmaDomicilio" component={FirmaDomicilio} />
          <Stack.Screen name="OrdenPago" component={OrdenPago} />
        </Stack.Navigator>
      </FinanceProvider>
    </InactivityProvider>
  );
}

function MainFlow() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [customFocusedTab, setCustomFocusedTab] = useState("");
  const [previousActiveTab, setPreviousActiveTab] = useState("");

  const shouldTabBarBeVisible = (route) => {
    // Get the current route name
    const routeName = getFocusedRouteNameFromRoute(route) ?? "DefaultRouteName";
    // Define screens where you want to hide the tab bar
    const hideOnScreens = [
      "DefinirInversion",
      "Beneficiarios",
      "DatosBancarios",
    ]; // Add more as needed
    return !hideOnScreens.includes(routeName);
  };

  const handleTabPress = (e, routeName) => {
    if (routeName === "Crear") {
      e.preventDefault();
      if (isModalVisible) {
        // Close the modal and reset focus to the previous tab
        setIsModalVisible(false);
        setCustomFocusedTab(previousActiveTab);
        setPreviousActiveTab("");
      } else {
        // Open the modal and remember the previously focused tab
        setPreviousActiveTab(customFocusedTab);
        setIsModalVisible(true);
        setCustomFocusedTab("Crear");
      }
    } else {
      if (isModalVisible) {
        // Close the modal when switching to another tab
        setIsModalVisible(false);
        setCustomFocusedTab(routeName);
        setPreviousActiveTab("");
      } else {
        setCustomFocusedTab(routeName);
      }
    }
  };

  return (
    <>
      <InactivityProvider>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarShowLabel: false,
            tabBarStyle: {
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 5,
              shadowColor: "#000000",
              borderTopColor: "transparent",
            },
            tabBarVisible: shouldTabBarBeVisible(route),
          })}
        >
          <Tab.Screen
            name="Inicio"
            component={InicioStack}
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
            component={CrearStack}
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
            name="MiTankef"
            component={MiTankef}
            listeners={{
              tabPress: (e) => handleTabPress(e, "MiTankef"),
            }}
            options={createTabScreenOptions(
              require("./assets/images/Graph.png"),
              "MiTankef",
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
              require("./assets/images/Perfil.png"),
              "Perfil",
              customFocusedTab,
              28,
              28
            )}
          />
        </Tab.Navigator>
        {isModalVisible ? (
          <CrearModal
            isVisible={isModalVisible}
            onClose={() => {
              setIsModalVisible(false);
              setCustomFocusedTab(previousActiveTab);
              setPreviousActiveTab("");
            }}
          />
        ) : null}
      </InactivityProvider>
    </>
  );
}

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
  const initialRouteName =
    userInfo && userInfo.userLoggedIn === true ? "AuthPinPad" : "LogIn";

  // Comnentar esta linea, se utiliza para pruebas y emepzar de la pagina deseada
  //const initialRouteName = "MainFlow"; //Prueba para ir a una pantalla directa, MainFlow para saltar authentication

  // Proporcionar el UserProvider para el contexto de usuario
  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{
        gestureEnabled: false, // Deshabilita el gesto de deslizar para volver en todas las pantallas
      }}
    >
      {/* Configuración de las pantallas y sus opciones */}
      {/* BORRAR ESTA PANTALLA DE PRUEBA*/}
      <Stack.Screen
        name="Prueba"
        component={DefinirCredito}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="LogIn"
        component={LogIn}
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
        name="NumeroTelefonico"
        component={NumeroTelefonico}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ConfirmNumber"
        component={ConfirmNumber}
        options={{ headerShown: false }}
      />
      {/* <Stack.Screen
        name="Registro3"
        component={Registro3}
        options={{ headerShown: false }}
      /> */}
      <Stack.Screen
        name="RegistroDatos"
        component={RegistroDatos}
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
      opensans: require("./assets/fonts/opensans.ttf"),
      opensansbold: require("./assets/fonts/opensansbold.ttf"),
      opensanssemibold: require("./assets/fonts/opensanssemibold.ttf"),
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
