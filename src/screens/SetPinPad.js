import {
  Text,
  View,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import PinPad from "../components/PinPad";
import { AntDesign } from "@expo/vector-icons";

const SetPinPad = ({ navigation }) => {
  const [pin, setPin] = useState("");

  const handleSetPin = (newPin) => {
    setPin(newPin);
  };

  return (
    <View>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <AntDesign
          name="arrowleft"
          size={40}
          color="#29364d"
          style={styles.back}
        />
      </TouchableOpacity>
      <Text style={styles.titulo}>Crea tu PIN</Text>
      <PinPad id={false} get={pin} set={setPin} />
      {pin.length === 6 ? (
        <TouchableOpacity
          style={styles.botonGrande}
          onPress={() => [
            navigation.navigate("ConfirmSetPinPad", {
              pin: pin,
              onSetPin: handleSetPin,
            }),
            console.log(pin),
          ]}
        >
          <Text style={styles.textoBotonGrande}>SIGUIENTE</Text>
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

export default SetPinPad;
