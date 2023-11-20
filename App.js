import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import InitialScreen from "./src/screens/InitialScreen";
import Registro1 from "./src/screens/Registro1";
import Registro2 from "./src/screens/Registro2";
import Registro3 from "./src/screens/Registro3";
import Registro4 from "./src/screens/Registro4";
import Main from "./src/screens/Main.js";

// Create a stack navigator
const Stack = createStackNavigator();

function LoginFlow() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="InitialScreen"
        component={InitialScreen}
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
  );
}

// Main App Component
export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  async function loadFonts() {
    await Font.loadAsync({
      conthrax: require("./assets/fonts/conthrax.ttf"),
    });
    setFontsLoaded(true);
  }

  useEffect(() => {
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return <AppLoading />;
  }

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
