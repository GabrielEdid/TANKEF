import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import React, { useState, useContext, useEffect } from "react";
import PinPad from "../components/PinPad";
import { UserContext } from "../hooks/UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign } from "@expo/vector-icons";

const ConfirmSetPinPad = ({ navigation, route }) => {
  const { user, setUser } = useContext(UserContext);
  const { pin, onSetPin } = route.params;
  const [confirmPin, setConfirmPin] = useState("");

  useEffect(() => {
    if (user && user.loggedIn) {
      const userInfo = {
        FireBaseUIDMail: user.FireBaseUIDMail,
        FireBaseUIDTel: user.FireBaseUIDTel,
        pin: user.pin,
        loggedIn: user.loggedIn,
      };

      AsyncStorage.setItem("userInfo", JSON.stringify(userInfo))
        .then(() => console.log("Información guardada con éxito"))
        .catch((error) =>
          console.error("Error guardando la información", error)
        );
    }
  }, [user]);

  const handleConfirmPin = () => {
    if (confirmPin === pin) {
      setUser({ ...user, pin: confirmPin, loggedIn: true });
      navigation.navigate("Main");
    } else {
      alert("Los Pines no Coinciden");
      setConfirmPin(""); // Aquí asumo que quieres resetear confirmPin
      navigation.navigate("SetPinPad");
    }
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{ zIndex: 10 }}
      >
        <AntDesign
          name="arrowleft"
          size={40}
          color="#29364d"
          style={styles.back}
        />
      </TouchableOpacity>
      <Text style={styles.titulo}>Confirma tu PIN</Text>
      <PinPad id={false} get={confirmPin} set={setConfirmPin} />
      {confirmPin.length === 6 ? (
        <TouchableOpacity
          style={styles.botonGrande}
          onPress={() => [handleConfirmPin(), console.log(confirmPin)]}
        >
          <Text style={styles.textoBotonGrande}>GUARDAR PIN</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  back: {
    marginTop: 60,
    marginLeft: 20,
    position: "absolute",
    zIndex: 10000000,
  },
  titulo: {
    marginTop: 210,
    fontSize: 15,
    alignSelf: "center",
    position: "absolute",
    color: "#29364d",
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

export default ConfirmSetPinPad;
