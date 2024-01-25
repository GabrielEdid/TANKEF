import React from "react";
import { Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";

const GradientText = () => {
  return (
    <MaskedView
      style={{ flex: 1, height: "auto" }}
      maskElement={<Text style={styles.maskedText}>tankef</Text>}
    >
      <LinearGradient
        colors={["#21B6D5", "#2FF690"]}
        start={{ x: 1, y: 1 }}
        end={{ x: 0, y: -5 }}
        style={StyleSheet.absoluteFill}
      />
    </MaskedView>
  );
};

const styles = StyleSheet.create({
  maskedText: {
    fontFamily: "montserrat-bold",
    fontWeight: "bold",
    fontSize: 38,
    marginTop: 60,
    marginLeft: 20,
    position: "absolute",
  },
});

export default GradientText;
