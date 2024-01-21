// Importaciones de React Native y React
import React, { useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
// Importaciones de Hooks
import { UserContext } from "../hooks/UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SettingsDrawer = ({ navigation }) => {
  // Estado global
  const { user, setUser, resetUser } = useContext(UserContext);

  // Función para salir de la sesión
  const cerrarSesion = async () => {
    resetUser();
    // Espera a que el estado se actualice antes de guardar en AsyncStorage
    await AsyncStorage.setItem("userInfo", JSON.stringify(user));
    console.log("Información reseteada y guardada con éxito");
    navigation.navigate("InitialScreen");
  };

  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <Text style={styles.titulo}>Configuración</Text>
      <TouchableOpacity
        style={{ marginTop: 325 }}
        onPress={() =>
          navigation.navigate("PerfilScreen", {
            screen: "LoginProgresivo",
          })
        }
      >
        <Text style={styles.texto}>Editar Perfil</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => {}}>
        <Text style={styles.texto}>Contact</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => {}}>
        <Text style={styles.texto}>Help</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => {}}>
        <Text style={styles.texto}>FAQs</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => cerrarSesion()}>
        <Text style={styles.cerrarSesion}>Cerrar Sesión</Text>
      </TouchableOpacity>

      {/* Add more buttons or content as needed */}
    </View>
  );
};

const styles = StyleSheet.create({
  titulo: {
    fontSize: 25,
    fontFamily: "conthrax",
    marginTop: 70,
    position: "absolute",
    color: "#29364d",
  },
  texto: {
    fontSize: 20,
    fontFamily: "conthrax",
    marginBottom: 30,
    color: "#29364d",
  },
  cerrarSesion: {
    fontSize: 20,
    fontFamily: "conthrax",
    color: "red",
    marginBottom: 30,
  },
});

export default SettingsDrawer;
