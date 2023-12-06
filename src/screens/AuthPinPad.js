import { Text, View, StyleSheet, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import PinPad from "../components/PinPad";

const AuthPinPad = ({ navigation, route }) => {
  const { userPin } = route.params;
  const [pin, setPin] = useState("");

  useEffect(() => {
    if (pin.length === 6) {
      if (pin === userPin) {
        navigation.navigate("Main");
      } else {
        Alert.alert("Acceso Denegado", "PIN incorrecto");
        setPin("");
      }
    }
  }, [pin, userPin, navigation]);

  return (
    <View>
      <Text style={styles.titulo}>Introduce tu PIN</Text>
      <PinPad id={true} get={pin} set={setPin} />
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
});

export default AuthPinPad;
