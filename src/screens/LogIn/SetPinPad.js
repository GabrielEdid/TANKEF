import React, { useState, useContext } from "react";
import { Text, View, StyleSheet, TouchableOpacity, Image } from "react-native";
import PinPad from "../../components/PinPad"; // Assuming this is correctly imported
import { UserContext } from "../../hooks/UserContext"; // Assuming context is setup

const SetPinPad = ({ navigation }) => {
  const { user, setUser } = useContext(UserContext);
  const [pin, setPin] = useState("");

  const handleSetPin = (newPin) => {
    setPin(newPin);
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
        <Text style={styles.backText}>Cancelar</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <Image
          source={require("../../../assets/images/Logo.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>Crea tu PIN</Text>
        <PinPad id={false} get={pin} set={setPin} />
      </View>

      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: pin.length === 6 ? "#060B4D" : "#F3F3F3" },
        ]}
        onPress={() => [
          navigation.navigate("ConfirmSetPinPad", {
            pin: pin,
            onSetPin: handleSetPin,
          }),
          console.log("El pin es: " + pin),
        ]}
        disabled={pin.length !== 6}
      >
        <Text
          style={[
            styles.buttonText,
            { color: pin.length === 6 ? "white" : "grey" },
          ]}
        >
          Siguiente
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "space-between",
  },
  backButton: {
    zIndex: 10,
    marginTop: 60,
    marginLeft: 20,
    position: "absolute",
  },
  backText: {
    fontSize: 16,
    fontFamily: "opensanssemibold",
    color: "#060B4D",
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
  button: {
    backgroundColor: "#060B4D",
    marginHorizontal: 20,
    marginBottom: 40,
    borderRadius: 5,
  },
  buttonText: {
    alignSelf: "center",
    padding: 10,
    fontSize: 16,
    color: "white",
    fontFamily: "opensanssemibold",
  },
});

export default SetPinPad;
