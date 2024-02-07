// Importaciones de React Native y React
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
// Importaciones de Componentes

const SearchResult = ({ nombre, imagen, userID }) => {
  const navigation = useNavigation();
  // Estados y Contexto

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigation.navigate("VerPerfiles", { userID: userID })}
    >
      <View style={{ flexDirection: "row", flex: 1 }}>
        <Image source={imagen} style={styles.icon} />
        <Text style={styles.textoNombre}>{nombre}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    marginTop: 3,
    paddingHorizontal: 20,
    height: 85,
    width: "100%",
    flexDirection: "row",
  },
  textoNombre: {
    fontSize: 20,
    fontFamily: "opensansbold",
    alignSelf: "center",
    color: "#060B4D",
    marginLeft: 10,
  },
  icon: {
    height: 48,
    width: 48,
    borderRadius: 50,
    alignSelf: "center",
  },
});

export default SearchResult;
