// Importaciones de React Native y React
import { Text, View, StyleSheet, Alert, Image } from "react-native";
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
  const [isLoading, setIsLoading] = useState(false);

  const handleAuthenticationSuccess = () => {
    fetchProfileData(); // Llama a fetchProfileData después de la autenticación exitosa
  };

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
        conexiones: result.data.data.count_conections,
      });
      console.log("Datos del perfil:", result.data);
      setIsLoading(false);
      navigation.navigate("MainFlow", {
        screen: "Perfil",
      });
      //Alert.alert("Autenticado", "Bienvenido de vuelta!");
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
  }, [pin, userPin, navigation]);

  // Componente visual
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require("../../../assets/images/Logo.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>Introduce tu PIN</Text>
        <PinPad
          id={true}
          get={pin}
          set={setPin}
          onAuthenticationSuccess={handleAuthenticationSuccess}
        />
      </View>

      {isLoading && (
        <View style={styles.overlay}>
          <ActivityIndicator size={75} color="#060B4D" />
          <Text
            style={{
              fontFamily: "opensanssemibold",
              marginTop: 15,
              color: "white",
              textAlign: "center",
            }}
          >
            Estamos recuperando tus datos{"\n"}Por favor espera...
          </Text>
        </View>
      )}
    </View>
  );
};

// Estilos de la pantalla
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "space-between",
  },
  content: {
    marginTop: 100,
    flex: 1,
    justifyContent: "center",
  },
  logo: {
    width: 175,
    height: 70,
    alignSelf: "center",
  },
  title: {
    alignSelf: "center",
    marginTop: 40,
    fontSize: 16,
    fontFamily: "opensanssemibold",
    color: "#060B4D",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AuthPinPad;
