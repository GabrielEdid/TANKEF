// Importaciones de React Native y React
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  Modal,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { ActivityIndicator } from "react-native-paper";
// Importaciones de Hooks
import { UserContext } from "../../hooks/UserContext";
import { APIPut } from "../../API/APIService";
// Importaciones de Componentes
import DropDown from "../../components/DropDown";
import SpecialInput from "../../components/SpecialInput";
import { AntDesign } from "@expo/vector-icons";

const LoginProgresivo2 = ({ navigation }) => {
  // Estados locales
  const { user, setUser } = useContext(UserContext); //Contexo
  const [isLoading, setIsLoading] = useState(false); // Estado para manejar el indicador de carga

  // Función para verificar si los campos están completos
  const verificarCampos = () => {
    return (
      user.ocupacion !== "" &&
      user.estadoCivil !== "" &&
      user.nacionalidad !== "" &&
      user.firmaElectronica !== "" &&
      user.RFC !== ""
    );
  };

  const updateUser = async (userId, userData) => {
    setIsLoading(true);
    const url = `/api/v1/users/${userId}`;

    try {
      const response = await APIPut(url, userData);
      if (response.error) {
        throw new Error(response.error);
      }

      console.log("Usuario actualizado:", response.data);
      setIsLoading(false);
      navigation.navigate("MainFlow", {
        screen: "Perfil",
        params: { screen: "PerfilMain" },
      });
    } catch (error) {
      console.error("Hubo un problema al actualizar el usuario:", error);
      Alert.alert(
        "Hubo un problema al completar tus datos",
        "Verificalos y vuelve a intentarlo.",
        [{ text: "Entendido" }],
        { cancelable: true }
      );
      setIsLoading(false);
    }
  };

  // Manejador para el botón Siguiente
  const handleSiguiente = async () => {
    if (!verificarCampos()) {
      Alert.alert(
        "Campos Incompletos",
        "Introduce todos tus datos para continuar.",
        [{ text: "Entendido" }],
        { cancelable: true }
      );
    } else {
      console.log("Datos de usuario:", user);
      // Datos de usuario a actualizar
      const userData = {
        marital_status: user.estadoCivil,
        nationality: user.nacionalidad,
        fiel: user.firmaElectronica,
        rfc: user.RFC,
        job: user.ocupacion,
        name: user.nombre,
        last_name_1: user.apellidoPaterno,
        last_name_2: user.apellidoMaterno,
        phone: user.telefono,
        curp: user.CURP,
      };

      try {
        await updateUser(user.userID, userData);
      } catch (error) {
        console.error("Error al actualizar:", error);
        // Aquí puedes manejar los errores, por ejemplo, mostrando un alerta
      }
    }
  };

  // Manejador para volver a la pantalla anterior
  const handleGoBack = () => {
    // Reinicia los valores del usuario
    setUser({
      ...user,
      ocupacion: "",
      estadoCivil: "",
    });
    navigation.navigate("PerfilScreen", {
      screen: "PerfilMain",
    });
  };

  // Componente visual
  return (
    // Cerrar el teclado cuando se toca fuera de un input
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.background}>
        {/*Titulo*/}
        <View style={styles.tituloContainer}>
          <Text style={styles.titulo}>TANKEF</Text>
        </View>

        {/* Boton de Regresar */}
        {/*<TouchableOpacity onPress={() => handleGoBack()}>
          <AntDesign
            name="arrowleft"
            size={40}
            color="#29364d"
            style={styles.back}
          />
        </TouchableOpacity>*/}

        {/* Mensaje Superior */}
        <View style={{ flex: 1 }}>
          <Text style={styles.texto}>
            ¡Solo faltan un par de datos más{" "}
            <Text style={{ fontWeight: "bold" }}>
              para terminar tu registro!
            </Text>
          </Text>
          <View
            style={styles.container}
            automaticallyAdjustKeyboardInsets={true}
          >
            {/* Campos de entrada para datos del usuario */}
            <View style={{ zIndex: 500 }}>
              <DropDown
                field="Estado Civil"
                context="estadoCivil"
                dropdown={"civil"}
              />
            </View>
            {/* Campo de entrada para la ocupación del usuario, se tiene con view para que no se obstruya */}
            <View style={{ zIndex: 400, marginTop: -7.5 }}>
              <DropDown
                field="Ocupación"
                context="ocupacion"
                dropdown={"ocupacion"}
              />
            </View>
            <SpecialInput
              field="Nacionalidad"
              context="nacionalidad"
              editable={true}
            />
            <SpecialInput
              field="Firma Electrónica"
              context="firmaElectronica"
              editable={true}
            />
            <SpecialInput field="RFC" context="RFC" editable={true} />
          </View>
        </View>
        {/* Botón de Continuar */}
        <TouchableOpacity
          style={styles.botonGrande}
          onPress={() => handleSiguiente()}
          disabled={isLoading}
        >
          <Text style={styles.textoBotonGrande}>GUARDAR</Text>
        </TouchableOpacity>

        {/* Modal de carga */}
        <Modal transparent={true} animationType="fade" visible={isLoading}>
          <View style={styles.overlay}>
            <ActivityIndicator size={75} color="white" />
          </View>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
};

// Estilos de la Pantalla
const styles = StyleSheet.create({
  tituloContainer: {
    height: 105,
    backgroundColor: "white",
  },
  background: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
  },
  imagen: {
    width: 90,
    height: 90,
    alignSelf: "center",
    marginTop: 60,
    position: "absolute",
  },
  titulo: {
    fontFamily: "conthrax",
    fontSize: 27,
    color: "#29364d",
    marginTop: 70,
    position: "absolute",
  },
  container: {
    padding: 20,
    marginTop: 15,
    alignSelf: "center",
    justifyContent: "space-around",
    width: "100%",
    backgroundColor: "white",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.6,
    shadowRadius: 5,
    elevation: 8,
  },
  texto: {
    fontSize: 18,
    marginTop: 10,
    textAlign: "center",
    color: "#29364d",
    alignSelf: "center",
  },
  botonGrande: {
    width: "100%",
    height: 60,
    alignSelf: "center",
    justifyContent: "center",
    backgroundColor: "#29364d",
    borderRadius: 25,
    marginBottom: 20,
    zIndex: -10,
  },
  textoBotonGrande: {
    color: "white",
    textAlign: "center",
    fontSize: 20,
    fontFamily: "conthrax",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
});

export default LoginProgresivo2;
