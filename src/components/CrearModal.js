// Importaciones de React Native y React
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
// Importaciones de Hooks y Componentes
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";

const CrearModal = ({ isVisible, onClose }) => {
  const [modalY] = useState(new Animated.Value(300)); // Ajusta el valor inicial según la altura de tu modal

  const handleClose = () => {
    Animated.timing(modalY, {
      toValue: 300,
      duration: 500,
      useNativeDriver: true,
    }).start(onClose); // Llama a onClose después de que la animación termine
  };

  useEffect(() => {
    if (isVisible) {
      Animated.timing(modalY, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible, modalY]);

  return (
    <TouchableOpacity
      style={styles.fullScreenButton}
      activeOpacity={1}
      onPress={() => handleClose()}
    >
      <Animated.View
        style={[
          styles.modalView,
          {
            transform: [{ translateY: modalY }], // Aplica la animación
          },
        ]}
      >
        {/* Linea en la parte superior */}
        <TouchableOpacity onPress={() => handleClose()}>
          <View
            style={{
              height: 10,
              backgroundColor: "#F0F0F0",
              width: 150,
              borderRadius: 10,
              alignSelf: "center",
            }}
          ></View>
        </TouchableOpacity>
        {/* Boton Invertir */}
        <TouchableOpacity
          style={styles.buttonModal}
          onPress={() => handleClose()}
        >
          <FontAwesome5 name="money-bill-alt" size={30} color="#060B4D" />
          <Text style={styles.texto}>Invertir</Text>
        </TouchableOpacity>
        {/* Boton Crédito */}
        <TouchableOpacity
          style={styles.buttonModal}
          onPress={() => handleClose()}
        >
          <FontAwesome name="credit-card" size={30} color="#060B4D" />
          <Text style={styles.texto}>Solicitar Crédito</Text>
        </TouchableOpacity>
        {/* Boton Ahorro */}
        <TouchableOpacity
          style={styles.buttonModal}
          onPress={() => handleClose()}
        >
          <FontAwesome5 name="piggy-bank" size={30} color="#060B4D" />
          <Text style={styles.texto}>Caja de Ahorro</Text>
        </TouchableOpacity>
      </Animated.View>
    </TouchableOpacity>
  );
};

// Estilos para el Modal que aparece si se elimina una conexión
const styles = StyleSheet.create({
  fullScreenButton: {
    height: "100%",
    width: "100%",
    position: "absolute",
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
    bottom: 79, // Dejar espacio para el Tab Navigator
  },
  modalView: {
    position: "absolute",
    width: "100%",
    alignSelf: "center",
    justifyContent: "space-between",
    zIndex: -1, // Poner detrás del TabNavigator
    height: 250,
    backgroundColor: "white",
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonModal: {
    flexDirection: "row",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginVertical: 5,
  },
  texto: {
    marginLeft: 15,
    marginTop: 2,
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    paddingTop: 1,
    color: "#060B4D",
  },
});

export default CrearModal;
