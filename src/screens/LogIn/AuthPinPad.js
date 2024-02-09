// Importaciones de React Native y React
import { Text, View, StyleSheet, Alert, Modal } from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { ActivityIndicator } from "react-native-paper";
// Importaciones de Componentes y Hooks
import { APIGet, setToken } from "../../API/APIService";
import { UserContext } from "../../hooks/UserContext";
import PinPad from "../../components/PinPad";

const AuthPinPad = ({ navigation, route }) => {
  // Estado local y el pin obtenido del AsyncStorage
  const { userPin, userLoggedIn } = route.params; // Se obtiene el pin del AsyncStorage
  const { user, setUser } = useContext(UserContext);
  const [pin, setPin] = useState("");
  const [isProfileLoaded, setIsProfileLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  /*const handleAuthenticationSuccess = () => {
    fetchProfileData(); // Llama a fetchProfileData después de la autenticación exitosa
  };*/

  // Función para convertir la primera letra de cada palabra en mayúscula
  function titleCase(str) {
    return str
      .toLowerCase()
      .split(" ")
      .map(function (word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(" ");
  }

  // Función para obtener los datos del perfil
  const fetchProfileData = async () => {
    setIsLoading(true);
    const url = "/api/v1/profile";

    const result = await APIGet(url);

    if (result.error) {
      console.error("Error al obtener datos del perfil:", result.error);
      // Manejo del error
    } else {
      setUser({
        ...user,
        loggedIn: userLoggedIn,
        pin: userPin,
        userID: result.data.data.id,
        telefono: result.data.data.phone,
        nombre: titleCase(result.data.data.name),
        apellidoPaterno: titleCase(result.data.data.first_last_name),
        apellidoMaterno: titleCase(result.data.data.second_last_name),
        CURP: result.data.data.curp,
        email: result.data.data.email,
        fechaNacimiento: result.data.data.dob,
        avatar: result.data.data.avatar,
        conections: result.data.data.count_conections,
      });
      console.log("Datos del perfil:", result.data);
      setIsProfileLoaded(true);
      setIsLoading(false);
      if (isProfileLoaded) {
        navigation.navigate("MainFlow", {
          screen: "Perfil",
        });
        //Alert.alert("Autenticado", "Bienvenido de vuelta!");
      }
    }
  };

  // Función para comparar el pin introducido con el pin del AsyncStorage
  useEffect(() => {
    if (pin.length === 6) {
      if (pin === userPin) {
        fetchProfileData();
      } else {
        Alert.alert("Acceso Denegado", "PIN incorrecto");
        setPin("");
      }
    }
  }, [pin, userPin, navigation, isProfileLoaded]);

  // Componente visual
  return (
    <View>
      {/* Texto de Introduce tu PIN */}
      <Text style={styles.titulo}>Introduce tu PIN</Text>
      {/* Componente de PinPad, ahí mismo aparece el logo, titulo de Tankef, faceID y olvide mi PIN */}
      <PinPad
        id={true}
        get={pin}
        set={setPin}
        //onAuthenticationSuccess={handleAuthenticationSuccess}
      />
      <Modal transparent={true} animationType="fade" visible={isLoading}>
        <View style={styles.overlay}>
          <ActivityIndicator size={75} color="white" />
          <Text
            style={{
              fontFamily: "opensanssemibold",
              marginTop: 15,
              color: "white",
            }}
          >
            Estamos recuperando tus datos
          </Text>
        </View>
      </Modal>
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
  titulo: {
    marginTop: 210,
    fontSize: 15,
    alignSelf: "center",
    position: "absolute",
    color: "#29364d",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
});

export default AuthPinPad;
