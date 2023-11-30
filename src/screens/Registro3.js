import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../hooks/UserContext";
import { AntDesign } from "@expo/vector-icons";
import SpecialInput from "../components/SpecialInput";
import DropDown from "../components/DropDown";
import { ChecarCURP } from "../hooks/ChecarCURP";

const Registro3 = ({ navigation }) => {
  const { user, setUser } = useContext(UserContext);

  const verificarCampos = () => {
    return (
      user.nombre !== "" &&
      user.CURP !== "" &&
      user.CURP !== "CURP incorrecto" &&
      user.fechaNacimiento !== "" &&
      user.fechaNacimiento !== "CURP incorrecto" &&
      user.estadoNacimiento !== "" &&
      user.estadoNacimiento !== "CURP incorrecto" &&
      user.sexo !== "" &&
      user.sexo !== "CURP incorrecto" &&
      user.estadoCivil !== "" &&
      user.ocupacion !== ""
    );
  };

  const handleSiguiente = () => {
    if (!verificarCampos()) {
      Alert.alert(
        "Campos Incompletos",
        "Introduce todos tus datos para continuar.",
        [{ text: "Entendido" }],
        { cancelable: true }
      );
    } else {
      navigation.navigate("Registro4");
    }
  };

  useEffect(() => {
    if (user.CURP && user.CURP.length === 18) {
      const { fechaNacimiento, sexo, estadoNacimiento } = ChecarCURP(user.CURP);
      setUser({
        ...user,
        fechaNacimiento,
        sexo,
        estadoNacimiento,
      });
    }
  }, [user.CURP, setUser]);

  /*useEffect(() => {
    if (user.CRUP === 18) {
      // Ejecutar lógica para procesar CURP
    } else {
      setUser({ ...user, fechaNacimiento: "" });
      setUser({ ...user, estadoNacimiento: "" });
      setUser({ ...user, sexo: "" });
    }
  }, [user.CURP]);

  useEffect(() => {
    if (user.CURP && user.CURP.length === 18) {
      ChecarCURP();
    }
  }, [user.CURP]);*/

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.background}>
        {/* Logo, Titulo y Avance */}
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign
            name="arrowleft"
            size={40}
            color="#29364d"
            style={styles.back}
          />
        </TouchableOpacity>
        <Image
          source={require("../../assets/images/Logo_Tankef.png")}
          style={styles.imagen}
        />
        <Text style={styles.titulo}>TANKEF</Text>
        <View style={styles.container}>
          <Image
            source={require("../../assets/images/LoginFlow3.png")}
            style={styles.imagenAvance}
          />
          {/* Entradas de Input */}
          <View
            style={{
              marginTop: 80,
              height: 100,
            }}
            automaticallyAdjustKeyboardInsets={true}
          >
            <SpecialInput
              field="Nombre Completo"
              context="nombre"
              editable={true}
              set=""
            />
            <SpecialInput field="CURP" context="CURP" editable={true} />
            {/*<ChecarCURP />*/}
            <SpecialInput
              field="Fecha de Nacimiento"
              context="fechaNacimiento"
              editable={false}
            />
            <SpecialInput
              field="Estado de Nacimiento"
              context="estadoNacimiento"
              editable={false}
            />
            <SpecialInput field="Sexo" context="sexo" editable={false} />
            <DropDown
              field="Estado Civil"
              context="estadoCivil"
              dropdown={"civil"}
            />
            <DropDown
              field="Ocupación"
              context="ocupacion"
              dropdown={"ocupacion"}
            />
          </View>
        </View>
        {/* Boton Craer Cuenta */}
        <TouchableOpacity
          style={styles.botonGrande}
          onPress={() => [handleSiguiente(), console.log(user)]}
        >
          <Text style={styles.textoBotonGrande}>SIGUIENTE</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  back: {
    marginTop: 60,
    marginLeft: 20,
    position: "absolute",
  },
  background: {
    backgroundColor: "white",
    flex: 1,
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
    fontSize: 25,
    color: "#29364d",
    marginTop: 160,
    alignSelf: "center",
    position: "absolute",
  },
  imagenAvance: {
    width: 300,
    height: 35,
    alignSelf: "center",
    marginTop: 20,
    position: "absolute",
  },
  container: {
    position: "absolute",
    alignSelf: "center",
    height: 520,
    width: 330,
    marginTop: 210,
    backgroundColor: "white",
    flex: 1,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.6,
    shadowRadius: 5,
    elevation: 8,
  },
  texto: {
    fontSize: 16,
    color: "#29364d",
    marginTop: 100,
    alignSelf: "center",
    position: "absolute",
  },
  botonGrande: {
    marginTop: 750,
    width: 350,
    height: 60,
    alignSelf: "center",
    justifyContent: "center",
    backgroundColor: "#29364d",
    borderRadius: 25,
    position: "absolute",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.37,
    shadowRadius: 5,
    elevation: 8,
  },
  textoBotonGrande: {
    color: "white",
    textAlign: "center",
    fontSize: 20,
    fontFamily: "conthrax",
  },
});

export default Registro3;
