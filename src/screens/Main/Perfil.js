// Importaciones de React Native y React
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React, { useContext, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
// Importaciones de Hooks y Componentes
import { UserContext } from "../../hooks/UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Perfil = ({ navigation }) => {
  // Estado global
  const { user, setUser, resetUser } = useContext(UserContext);

  // Función para salir de la sesión
  const handleOnPress = async () => {
    resetUser();
    // Espera a que el estado se actualice antes de guardar en AsyncStorage
    await AsyncStorage.setItem("userInfo", JSON.stringify(user));
    console.log("Información reseteada y guardada con éxito");
    navigation.navigate("InitialScreen");
  };

  function DrawerContent() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Button
          title="Action 1"
          onPress={() => console.log("Acción 1 ejecutada")}
        />
        <Button
          title="Action 2"
          onPress={() => console.log("Acción 2 ejecutada")}
        />
        {/* Más botones según sea necesario */}
      </View>
    );
  }

  const Drawer = createDrawerNavigator();

  function MyDrawer() {
    return (
      <Drawer.Navigator drawerContent={() => <DrawerContent />}>
        <Drawer.Screen name="Movimientos" component={Movimientos} />
      </Drawer.Navigator>
    );
  }

  // Componente visual
  return (
    //Imagen de Fondo
    <View style={styles.background}>
      {/* Logo, Titulo */}
      <Text style={styles.titulo}>TANKEF</Text>
      {/* Boton de Cerrar Sesion */}
      <TouchableOpacity
        style={{
          marginTop: 600,
          alignSelf: "center",
          alignItems: "center",
        }}
        onPress={() => handleOnPress()}
      >
        <Text style={{ fontSize: 20, fontFamily: "conthrax", color: "red" }}>
          Cerrar Sesión
        </Text>
      </TouchableOpacity>
      <MyDrawer />
    </View>
  );
};

// Estilos de la pantalla
const styles = StyleSheet.create({
  back: {
    marginTop: 60,
    marginLeft: 20,
    position: "absolute",
  },
  background: {
    flex: 1,
    backgroundColor: "white",
  },
  imagen: {
    width: 150,
    height: 150,
    alignSelf: "center",
    marginTop: 300,
    position: "absolute",
  },
  titulo: {
    fontFamily: "conthrax",
    fontSize: 27,
    color: "#29364d",
    marginTop: 70,
    marginLeft: 20,
    position: "absolute",
  },
});

export default Perfil;
