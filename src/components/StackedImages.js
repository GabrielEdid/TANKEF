// Importaciones de React Native y React
import React from "react";
import { View, Image, StyleSheet, Text } from "react-native";
// Importaciones de Componentes y Hooks

const imageSize = 50; // Diameter of the circular images
const overlap = 20; // Overlap size
const borderSize = 2;

const StackedImages = () => {
  const imageMap = {
    Natasha: require("../../assets/images/Fotos_Personas/Natahsa.png"),
    Quill: require("../../assets/images/Fotos_Personas/Quill.png"),
    Clint: require("../../assets/images/Fotos_Personas/Clint.png"),
    Antonio: require("../../assets/images/Fotos_Personas/Antonio.png"),
    Steve: require("../../assets/images/Fotos_Personas/Steve.png"),
    Blank: require("../../assets/images/blankAvatar.jpg"),
    // ... más imágenes
  };

  const imageKeys = ["Steve", "Antonio", "Clint", "Quill", "Natasha", "Blank"];

  return (
    <View style={styles.container}>
      {imageKeys.map((key) => (
        <View key={key} style={styles.imageWrapper}>
          <View style={styles.borderWrapper}>
            <Image source={imageMap[key]} style={styles.image} />
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginBottom: 20,
    marginTop: 5,
    marginLeft: 15,
    alignSelf: "center",
  },
  imageWrapper: {
    width: imageSize,
    height: imageSize,
    borderRadius: imageSize / 2,
    overflow: "hidden",
    alignItems: "center", // Center the image vertically
    marginLeft: -overlap,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  borderWrapper: {
    borderWidth: borderSize,
    borderColor: "white", // Change to the color you want for the border
    borderRadius: imageSize / 2,
    overflow: "hidden",
    width: imageSize,
    height: imageSize,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default StackedImages;
