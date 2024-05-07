// Importaciones de React Native y React
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
// Importaciones de Hooks y Componentes
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";

// Este "componente" es un modal que se muestra en la parte inferior de la pantalla como la "pantalla" de crear.
// Es practicamente un menú con tres botones que al presionarlos se cierra el modal y se ejecuta la acción correspondiente.
// Es más una pantalla que un componente, NO debe de ser reusado.

const CrearModal = ({ isVisible, onClose }) => {
  const navigation = useNavigation();
  // Animación para el modal
  const [modalY] = useState(new Animated.Value(300));

  // Función para cerrar el modal
  const handleClose = () => {
    Animated.timing(modalY, {
      toValue: 300,
      duration: 500,
      useNativeDriver: true,
    }).start(onClose);
  };

  // Efecto para mostrar el modal
  useEffect(() => {
    if (isVisible) {
      Animated.timing(modalY, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible, modalY]);

  // Componente Visual
  return (
    <TouchableOpacity
      style={styles.fullScreenButton}
      activeOpacity={1}
      onPress={() => handleClose()}
    >
      {/* Vista animada */}
      <Animated.View
        style={[
          styles.modalView,
          {
            transform: [{ translateY: modalY }], // Aplica la animación
          },
        ]}
      >
        {/* Linea en la parte superior para cerrar */}
        <TouchableOpacity
          onPress={() => handleClose()}
          style={{
            height: 10,
            backgroundColor: "#F0F0F0",
            width: 150,
            borderRadius: 10,
            alignSelf: "center",
          }}
          activeOpacity={1}
        />
        {/* Boton Invertir */}
        <TouchableOpacity
          style={styles.buttonModal}
          onPress={() => {
            handleClose();
            navigation.navigate("Crear", {
              screen: "DefinirInversion",
              params: { flujo: "Inversión" },
            });
          }}
        >
          <FontAwesome5 name="money-bill-alt" size={30} color="#060B4D" />
          <Text style={styles.texto}>Invertir</Text>
        </TouchableOpacity>

        {/* Boton Crédito */}
        <TouchableOpacity
          style={styles.buttonModal}
          onPress={() => {
            handleClose();
            navigation.navigate("Crear", {
              screen: "DefinirCredito",
              params: { flujo: "Crédito" },
            });
          }}
        >
          <FontAwesome name="credit-card" size={30} color="#060B4D" />
          <Text style={styles.texto}>Solicitar Crédito</Text>
        </TouchableOpacity>

        {/* Boton Ahorro */}
        <TouchableOpacity
          style={styles.buttonModal}
          onPress={() => {
            handleClose();
            navigation.navigate("Crear", {
              screen: "DefinirCajaAhorro",
              params: { flujo: "Caja de ahorro" },
            });
          }}
        >
          <FontAwesome5 name="piggy-bank" size={30} color="#060B4D" />
          <Text style={styles.texto}>Caja de Ahorro</Text>
        </TouchableOpacity>
      </Animated.View>
    </TouchableOpacity>
  );
};

// Estilos del Componente
const styles = StyleSheet.create({
  fullScreenButton: {
    height: "100%",
    width: "100%",
    position: "absolute",
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
    bottom: 79,
  },
  modalView: {
    position: "absolute",
    width: "100%",
    alignSelf: "center",
    justifyContent: "space-between",
    zIndex: -1,
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
    fontSize: 24,
    fontFamily: "opensansbold",
    textAlign: "center",
    paddingTop: 1,
    color: "#060B4D",
  },
});

export default CrearModal;
