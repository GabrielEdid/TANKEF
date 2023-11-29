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
import ChecarCURP from "../hooks/ChecarCURP";

const Registro3 = ({ navigation }) => {
  const { user, setUser } = useContext(UserContext);
  const [nombre, setNombre] = useState("");
  const [CURP, setCURP] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [estadoNacimiento, setEstadoNacimiento] = useState("");
  const [sexo, setSexo] = useState("");
  const [estadoCivil, setEstadoCivil] = useState("");
  const [ocupacion, setOcupacion] = useState("");

  const verificarCampos = () => {
    return (
      nombre !== "" &&
      CURP !== "" &&
      fechaNacimiento !== "" &&
      estadoNacimiento !== "" &&
      sexo !== "" &&
      estadoCivil !== "" &&
      ocupacion !== "" &&
      CURP !== "CURP incorrecto"
    );
  };

  const handleSiguiente = () => {
    if (!verificarCampos()) {
      Alert.alert(
        "Campos Incompletos", // Aquí puedes poner el título que desees
        "Introduce todos tus datos para continuar.",
        [{ text: "Entendido" }],
        { cancelable: true }
      );
    } else {
      navigation.navigate("Registro4");
    }
  };

  useEffect(() => {
    if (CURP.length === 18) {
      // Ejecutar lógica para procesar CURP
    } else {
      setFechaNacimiento("");
      setEstadoNacimiento("");
      setSexo("");
    }
  }, [CURP]);

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
              set={setNombre}
            />
            <SpecialInput
              field="CURP"
              context="CURP"
              editable={true}
              set={setCURP}
            />
            {CURP.length === 18 && (
              <ChecarCURP
                curp={CURP}
                fecha={setFechaNacimiento}
                estado={setEstadoNacimiento}
                sexo={setSexo}
              />
            )}
            <SpecialInput
              field="Fecha de Nacimiento"
              context="fechaNacimiento"
              editable={false}
              value={{ ...user, fechaNacimiento }}
              set={setFechaNacimiento}
            />
            <SpecialInput
              field="Estado de Nacimiento"
              context="estadoNacimiento"
              editable={false}
              value={{ ...user, estadoNacimiento }}
              set={setEstadoNacimiento}
            />
            <SpecialInput
              field="Sexo"
              context="sexo"
              editable={false}
              set={setSexo}
              value={{ ...user, sexo }}
            />
            <DropDown
              field="Estado Civil"
              context="estadoCivil"
              set={setEstadoCivil}
              dropdown={"civil"}
            />
            <DropDown
              field="Ocupación"
              context="ocupacion"
              set={setOcupacion}
              dropdown={"ocupacion"}
            />
          </View>
        </View>
        {/* Boton Craer Cuenta */}
        <TouchableOpacity
          style={styles.botonGrande}
          onPress={() => handleSiguiente()}
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
