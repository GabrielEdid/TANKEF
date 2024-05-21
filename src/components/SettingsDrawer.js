// Importaciones de React Native y React
import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
// Importaciones de Hooks
import { useInactivity } from "../hooks/InactivityContext";
import { UserContext } from "../hooks/UserContext";

const SettingsDrawer = ({ navigation }) => {
  // Estado global
  const { resetTimeout } = useInactivity();
  const { user, setUser, resetUser } = useContext(UserContext);
  const [aboutText, setAboutText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const fadeAnim = new Animated.Value(0); // Inicialmente invisible

  useEffect(() => {
    resetTimeout();
    const fetchAboutInfo = async () => {
      const url =
        "https://market-web-pr477-x6cn34axca-uc.a.run.app/api/v1/about";
      try {
        const response = await axios.get(url);
        setAboutText(response.data.data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchAboutInfo();
  }, []);

  const toggleModal = () => {
    resetTimeout();
    if (!modalVisible) {
      setModalVisible(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setModalVisible(false);
      });
    }
  };

  // Función para salir de la sesión
  const cerrarSesion = async () => {
    resetTimeout();
    resetUser();
    // Espera a que el estado se actualice antes de guardar en AsyncStorage
    await AsyncStorage.setItem("userInfo", JSON.stringify(user));
    console.log("Información reseteada y guardada con éxito");
    navigation.closeDrawer();
    navigation.navigate("LogIn");
  };

  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <Text style={styles.titulo}>Configuración</Text>
      <TouchableOpacity
        style={{ marginTop: 325 }}
        onPress={() => [navigation.navigate("EditarPerfil"), resetTimeout()]}
      >
        <Text style={styles.texto}>Datos del Perfil</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          toggleModal();
        }}
      >
        <Text style={styles.texto}>About</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => resetTimeout()}>
        <Text style={styles.texto}>FAQs</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => resetTimeout()}>
        <Text style={styles.texto}>Help</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => cerrarSesion()}>
        <Text style={styles.cerrarSesion}>Cerrar Sesión</Text>
      </TouchableOpacity>

      {/* Add more buttons or content as needed */}

      {/* Modal para About */}
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={toggleModal}
      >
        <View style={styles.centeredView}>
          <Animated.View style={[styles.modalView, { opacity: fadeAnim }]}>
            <Text>{aboutText}</Text>
            <TouchableOpacity style={styles.buttonClose} onPress={toggleModal}>
              <Text style={styles.textStyle}>Cerrar</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  titulo: {
    fontSize: 30,
    fontFamily: "opensansbold",
    marginTop: 100,
    position: "absolute",
    color: "#060B4D",
  },
  texto: {
    fontSize: 20,
    fontFamily: "opensans",
    marginBottom: 30,
    color: "#060B4D",
  },
  cerrarSesion: {
    fontSize: 20,
    fontFamily: "opensans",
    color: "red",
    marginBottom: 30,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    margin: 20,
    height: 300,
    width: 300,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonClose: {
    backgroundColor: "#2196F3",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 15,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default SettingsDrawer;
