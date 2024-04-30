// Importaciones de React Native y React
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState, useContext, useEffect } from "react";
import { ActivityIndicator } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
// Importaciones de Hooks y Componentes
import { Ionicons } from "@expo/vector-icons";
import { ChecarCURP } from "../../hooks/ChecarCURP";
import { APIPost } from "../../API/APIService";
import { UserContext } from "../../hooks/UserContext";

const Registro4 = ({ navigation }) => {
  // Estados locales y contexto global
  const { user, setUser, resetUser } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isCurpVerified, setIsCurpVerified] = useState(false);
  const [gender, setGender] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  // useEffect para cambiar el sexo de la persona a como pide el backend
  useEffect(() => {
    if (user.sexo === "Hombre") {
      setGender("male");
    } else if (user.sexo === "Mujer") {
      setGender("female");
    }
  }, [user.sexo]);

  // Función para crear usuario y manejar el registro
  const createUser = async () => {
    setIsLoading(true); // Activar el indicador de carga
    console.log("Creando usuario: " + user.backEndEstadoNacimiento);
    const url = "/api/v1/account/registrations";
    const body = {
      account_registration: {
        email: user.email,
        email_confirmation: user.confirmEmail,
        password: user.password,
        password_confirmation: user.confirmPassword,
        full_name: user.nombre,
        last_name_1: user.apellidoPaterno,
        last_name_2: user.apellidoMaterno,
        dob: user.fechaNacimiento,
        curp: user.CURP,
        phone: user.telefono,
        gender: gender,
        born_state: user.backEndEstadoNacimiento,
      },
    };

    const result = await APIPost(url, body);

    if (result.error) {
      console.error("Error:", result.error);
      // Manejo de errores
      const errorMessages = result.error.errors
        ? Object.values(result.error.errors).flat().join(". ")
        : result.error;
      Alert.alert("Error al Registrarse", errorMessages);
    } else {
      // Éxito en la solicitud
      console.log("Success:", result.data);
      Alert.alert(
        "¡Tu cuenta ha sido creada con éxito!",
        "Checa tu buzon de entrada para confirmar tu correo e inicia sesión.",
        [{ text: "Entendido" }],
        { cancelable: true }
      );
      navigation.navigate("LogIn");
    }

    setIsLoading(false); // Finalizar el indicador de carga
  };

  // Efecto para verificar el CURP y actualizar el estado en el contexto global
  useEffect(() => {
    if (user.CURP && user.CURP.length === 18) {
      const {
        fechaNacimiento,
        sexo,
        estadoNacimiento,
        backEndEstadoNacimiento,
      } = ChecarCURP(user.CURP);
      setUser({
        ...user,
        fechaNacimiento: fechaNacimiento,
        sexo: sexo,
        estadoNacimiento: estadoNacimiento,
        backEndEstadoNacimiento: backEndEstadoNacimiento,
      });
      setIsCurpVerified(true);
    } else if (isCurpVerified && user.CURP && user.CURP.length !== 18) {
      setUser({
        ...user,
        fechaNacimiento: "CURP Invalido",
        sexo: "CURP Invalido",
        estadoNacimiento: "CURP Invalido",
      });
    }
  }, [user.CURP, setUser]);

  // Manejador para el botón Siguiente
  const handleSiguiente = () => {
    if (!verificarCampos()) {
      // Alerta de campos incompletos
      Alert.alert(
        "Campos Incompletos",
        "Introduce todos tus datos para continuar.",
        [{ text: "Entendido" }],
        { cancelable: true }
      );
    } else if (!verificarContraseñas() || !verificarCorreos()) {
      // Alerta de contraseñas no coinciden
      Alert.alert(
        "Contraseñas o Correos no Coinciden",
        "Las contraseñas y los correos deben coincidir.",
        [{ text: "Entendido" }],
        { cancelable: true }
      );
    } else {
      createUser();
    }
  };

  // Manejador para volver a la pantalla anterior
  const handleCancelar = () => {
    // Reinicia los valores del usuario
    resetUser();
    navigation.navigate("LogIn");
  };

  // Función para verificar si los campos están completos
  const verificarCampos = () => {
    return (
      user.email !== "" &&
      user.confirmEmail !== "" &&
      user.password !== "" &&
      user.confirmPassword !== "" &&
      user.nombre !== "" &&
      user.apellidoPaterno !== "" &&
      user.apellidoMaterno !== "" &&
      user.CURP !== "" &&
      user.fechaNacimiento !== "" &&
      user.sexo !== "" &&
      user.estadoNacimiento !== ""
    );
  };

  // Función para verificar si las contraseñas son iguales
  const verificarContraseñas = () => {
    return user.password === user.confirmPassword;
  };

  // Función para verificar si las contraseñas son iguales
  const verificarCorreos = () => {
    return user.email === user.confirmEmail;
  };

  // Variable para deshabilitar el botón de continuar
  const disabled = !(
    verificarCampos() &&
    verificarContraseñas() &&
    verificarCorreos()
  );

  // Componente Visual
  return (
    <View style={{ flex: 1 }}>
      {/* Titulo, Nombre de Pantalla y Campana */}
      <View style={styles.tituloContainer}>
        <MaskedView
          style={{ flex: 1 }}
          maskElement={<Text style={styles.titulo}>tankef</Text>}
        >
          <LinearGradient
            colors={["#2FF690", "#21B6D5"]}
            start={{ x: 0.4, y: 0.4 }}
            end={{ x: 0, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </MaskedView>
        <TouchableOpacity onPress={() => handleCancelar()}>
          <Text style={[styles.bodySeccion, { marginTop: 50, fontSize: 20 }]}>
            Cancelar
          </Text>
        </TouchableOpacity>
      </View>

      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        scrollEnabled={true}
        enableOnAndroid={true}
        style={styles.scrollV}
        keyboardShouldPersistTaps="handled"
        enableAutomaticScroll={true}
      >
        <View style={styles.seccion}>
          <Text style={styles.tituloSeccion}>Registro</Text>
          <Text style={styles.bodySeccion}>
            Únete a nuestra plataforma financiera para acceder a una amplia gama
            de servicios personalizados.
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <View
            style={{
              marginTop: 5,
              backgroundColor: "white",
              paddingTop: 15,
            }}
          >
            {/* Campos para introducir de la información general */}

            <Text style={styles.tituloCampo}>Correo electrónico</Text>
            <TextInput
              style={styles.input}
              onChangeText={(value) => {
                setUser({ ...user, email: value });
              }}
              value={user.email}
              autoCapitalize="none"
              placeholder="nombre@correo.com"
            />
            <View style={styles.separacion} />

            <Text style={styles.tituloCampo}>Confirmar correo electrónico</Text>
            <TextInput
              style={styles.input}
              onChangeText={(value) => {
                setUser({ ...user, confirmEmail: value });
              }}
              value={user.confirmEmail}
              autoCapitalize="none"
              placeholder="nombre@correo.com"
            />
            <View style={styles.separacion} />

            <Text style={styles.tituloCampo}>Nombre(s)</Text>
            <TextInput
              style={styles.input}
              onChangeText={(value) => {
                setUser({ ...user, nombre: value });
              }}
              value={user.nombre}
              placeholder="Eje. Humberto Arturo"
            />
            <View style={styles.separacion} />

            <Text style={styles.tituloCampo}>Apellido paterno</Text>
            <TextInput
              style={styles.input}
              onChangeText={(value) => {
                setUser({ ...user, apellidoPaterno: value });
              }}
              value={user.apellidoPaterno}
              placeholder="Eje. Flores"
            />
            <View style={styles.separacion} />

            <Text style={styles.tituloCampo}>Apellido materno</Text>
            <TextInput
              style={styles.input}
              onChangeText={(value) => {
                setUser({ ...user, apellidoMaterno: value });
              }}
              value={user.apellidoMaterno}
              placeholder="Eje. Guillán"
            />
            <View style={styles.separacion} />

            <Text style={styles.tituloCampo}>CURP</Text>
            <TextInput
              style={styles.input}
              onChangeText={(value) => {
                setUser({ ...user, CURP: value });
              }}
              maxLength={18}
              value={user.CURP}
              placeholder="18 dígitos"
            />
            <View style={styles.separacion} />

            <Text style={[styles.tituloCampo, { color: "#9a9cb8" }]}>
              Fecha de nacimiento
            </Text>
            <TextInput
              style={styles.input}
              onChangeText={(value) => {
                setUser({ ...user, fechaNacimiento: value });
              }}
              value={user.fechaNacimiento}
              placeholder="Autorelleno"
              editable={false}
            />
            <View style={styles.separacion} />

            <Text style={[styles.tituloCampo, { color: "#9a9cb8" }]}>
              Género
            </Text>
            <TextInput
              style={styles.input}
              onChangeText={(value) => {
                setUser({ ...user, sexo: value });
              }}
              value={user.sexo}
              placeholder="Autorelleno"
              editable={false}
            />
            <View style={styles.separacion} />

            <Text style={[styles.tituloCampo, { color: "#9a9cb8" }]}>
              Ciudad de nacimiento
            </Text>
            <TextInput
              style={styles.input}
              onChangeText={(value) => {
                setUser({ ...user, estadoNacimiento: value });
              }}
              value={user.estadoNacimiento}
              placeholder="Autorelleno"
              editable={false}
            />
            <View style={styles.separacion} />

            <View>
              <Text style={styles.tituloCampo}>Contraseña</Text>
              <TextInput
                style={styles.input}
                onChangeText={(value) => {
                  setUser({ ...user, password: value });
                }}
                value={user.password}
                autoCapitalize="none"
                placeholder="•••••••"
                secureTextEntry={!isPasswordVisible}
              />
              <View style={styles.separacion} />
              {user.password && (
                <TouchableOpacity
                  onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                  style={styles.toggleButton}
                >
                  <Ionicons
                    name={isPasswordVisible ? "eye-off" : "eye"}
                    size={24}
                    color={"#060B4D"}
                  />
                </TouchableOpacity>
              )}
            </View>

            <View>
              <Text style={styles.tituloCampo}>Confirmar contraseña</Text>
              <TextInput
                style={styles.input}
                onChangeText={(value) => {
                  setUser({ ...user, confirmPassword: value });
                }}
                value={user.confirmPassword}
                autoCapitalize="none"
                placeholder="•••••••"
                secureTextEntry={!isConfirmPasswordVisible}
              />
              <View style={styles.separacion} />
              {user.confirmPassword && (
                <TouchableOpacity
                  onPress={() =>
                    setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
                  }
                  style={styles.toggleButton}
                >
                  <Ionicons
                    name={isConfirmPasswordVisible ? "eye-off" : "eye"}
                    size={24}
                    color={"#060B4D"}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
        {/* Boton de Continuar */}
        <View style={{ paddingHorizontal: 20, marginBottom: 20, zIndex: -1 }}>
          <TouchableOpacity
            style={[
              styles.botonContinuar,
              { backgroundColor: disabled ? "#E1E1E1" : "#060B4D" },
            ]}
            onPress={() => {
              handleSiguiente();
            }}
            disabled={disabled}
          >
            <Text
              style={[
                styles.textoBotonContinuar,
                { color: disabled ? "grey" : "white" },
              ]}
            >
              Aceptar
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
      {/* Vista de carga */}
      {isLoading && (
        <View style={styles.overlay}>
          <ActivityIndicator size={75} color="#060B4D" />
        </View>
      )}
    </View>
  );
};

// Estilos de la pantalla
const styles = StyleSheet.create({
  tituloContainer: {
    height: 90,
    paddingHorizontal: 20,
    flexDirection: "row",
    backgroundColor: "white",
  },
  titulo: {
    fontFamily: "montserrat",
    letterSpacing: -4,
    fontSize: 35,
    marginTop: 40,
  },
  tituloPantalla: {
    flex: 1,
    marginTop: 47,
    marginRight: 65,
    fontSize: 24,
    color: "#060B4D",
    fontFamily: "opensanssemibold",
    fontWeight: "bold",
  },
  seccion: {
    marginTop: 5,
    backgroundColor: "white",
    alignItems: "center",
    padding: 15,
  },
  tituloSeccion: {
    fontSize: 25,
    color: "#060B4D",
    fontFamily: "opensanssemibold",
  },
  bodySeccion: {
    marginTop: 10,
    marginBottom: 10,
    fontSize: 14,
    color: "#060B4D",
    fontFamily: "opensanssemibold",
    textAlign: "center",
  },
  tituloCampo: {
    marginTop: 10,
    paddingLeft: 15,
    marginBottom: 10,
    fontSize: 14,
    color: "#060B4D",
    fontFamily: "opensanssemibold",
  },
  input: {
    fontSize: 16,
    width: "100%",
    color: "#060B4D",
    fontFamily: "opensanssemibold",
    paddingLeft: 15,
    marginBottom: 10,
  },
  inputDescription: {
    borderRadius: 10,
    borderColor: "#afb0c4ff",
    borderWidth: 1,
    backgroundColor: "#F7F7F7",
    fontSize: 16,
    height: 120,
    width: "100%",
    color: "#060B4D",
    fontFamily: "opensanssemibold",
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  countryCodeText: {
    fontSize: 17,
    color: "grey",
    fontFamily: "opensanssemibold",
    marginRight: 10,
  },
  vistaTelefonos: {
    flexDirection: "row",
    paddingHorizontal: 15,
    alignItems: "center",
    marginTop: -5,
    marginBottom: 5,
  },
  DropDownPicker: {
    borderColor: "transparent",
    marginTop: -10,
    paddingLeft: 15,
    paddingRight: 20,
    borderRadius: 0,
    alignSelf: "center",
  },
  DropDownText: {
    fontSize: 17,
    fontFamily: "opensanssemibold",
    color: "#060B4D",
    alignSelf: "center",
  },
  DropDownContainer: {
    marginTop: -10,
    paddingHorizontal: 5,
    width: "100%",
    alignSelf: "center",
    borderRadius: 10,
    borderColor: "#060B4D",
  },
  separacion: {
    height: 1,
    width: "100%",
    backgroundColor: "#cecfdbff",
  },
  botonContinuar: {
    backgroundColor: "#060B4D",
    marginTop: 15,
    marginBottom: 20,
    width: "100%",
    alignSelf: "center",
    borderRadius: 5,
  },
  textoBotonContinuar: {
    alignSelf: "center",
    color: "white",
    padding: 10,
    fontFamily: "opensanssemibold",
    fontSize: 16,
  },
  toggleButton: {
    position: "absolute",
    right: 25,
    marginTop: 40,
    justifyContent: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Registro4;
