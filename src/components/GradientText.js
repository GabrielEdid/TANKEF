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
        colors={["#2FF690", "#21B6D5"]}
        start={{ x: 0.4, y: 0.4 }}
        end={{ x: 0, y: 0 }}
        style={StyleSheet.absoluteFill}
      />
    </MaskedView>
  );
};

const styles = StyleSheet.create({
  maskedText: {
    fontFamily: "montserrat",
    letterSpacing: -3,
    fontSize: 48,
    marginTop: 60,
    marginLeft: 20,
    position: "absolute",
  },
});

export default GradientText;
