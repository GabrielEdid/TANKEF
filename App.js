import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import InitialScreen from "./src/screens/InitialScreen";

// Create a stack navigator
const Stack = createStackNavigator();

function LoginFlow() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Initial" component={InitialScreen} />
    </Stack.Navigator>
  );
}

// Main App Component
export default function App() {
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
