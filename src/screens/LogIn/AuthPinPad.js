// Importaciones de React y React Native
import React, { useState, useEffect, useContext } from "react";
import { Text, View, StyleSheet, Alert, Image } from "react-native";
import { ActivityIndicator } from "react-native-paper";
// Importaciones de Hooks y Componentes
import { APIGet } from "../../API/APIService";
import { UserContext } from "../../hooks/UserContext";
import PinPad from "../../components/PinPad";
import ModalEstatus from "../../components/ModalEstatus";

const AuthPinPad = ({ navigation, route }) => {
  // Estados de la pantalla
  const { userPin, userLoggedIn, modal } = route.params;
  const { user, setUser } = useContext(UserContext);
  const [modalVisible, setModalVisible] = useState(modal);
  const [pin, setPin] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAuthenticationSuccess = () => {
    fetchProfileData();
  };

  useEffect(() => {
    setModalVisible(modal);
  }, [modal]);

  const fetchProfileData = async () => {
    setIsLoading(true);
    const url = "/api/v1/profile";
    const result = await APIGet(url);

    if (result.error) {
      console.error("Error al obtener datos del perfil:", result.error);
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
        valorRed: result.data.data.network_invested_amount,
      });
      setIsLoading(false);
      setPin("");
      navigation.navigate("MainFlow", {
        screen: "Inicio",
      });
    }
  };

  const titleCase = (str) => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  useEffect(() => {
    if (pin.length === 6) {
      if (pin === userPin) {
        fetchProfileData();
      } else {
        setPin("");
      }
    }
  }, [pin, userPin, navigation]);

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
          userPin={userPin}
          onAuthenticationSuccess={handleAuthenticationSuccess}
          onIncorrectPin={() => setPin("")}
        />
      </View>

      {isLoading && (
        <View style={styles.overlay}>
          <ActivityIndicator size={75} color="#060B4D" />
          <Text style={styles.loadingText}>
            Estamos recuperando tus datos{"\n"}Por favor espera...
          </Text>
        </View>
      )}
      {modal && (
        <ModalEstatus
          titulo={"¡Atención!"}
          texto={
            "Debido a tu inactividad, se ha cerrado tu sesión por seguridad. Por favor, vuelve a iniciar sesión."
          }
          imagen={"Alert"}
          visible={modalVisible}
          onAccept={() => setModalVisible(false)}
        />
      )}
    </View>
  );
};

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
  loadingText: {
    fontFamily: "opensanssemibold",
    marginTop: 15,
    color: "white",
    textAlign: "center",
  },
});

export default AuthPinPad;
