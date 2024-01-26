import React, { useState } from "react";
import { View, Text, StyleSheet, Modal, TouchableOpacity } from "react-native";

const CrearModal = ({ isVisible, onClose }) => {
  return (
    <TouchableOpacity
      style={styles.fullScreenButton}
      activeOpacity={1}
      onPress={onClose}
    >
      <View style={styles.modalView}>
        <Text style={{ fontSize: 13 }}>
          Si eliminas las conexión deberás volver a solicitarla.
        </Text>
        <TouchableOpacity
          style={styles.buttonModal}
          onPress={onClose} // Suponiendo que onClose maneja el cierre del modal
        >
          <Text style={{ color: "red" }}>Eliminar Conexión</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ marginTop: 10 }} onPress={onClose}>
          <Text>Cancelar</Text>
        </TouchableOpacity>
      </View>
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
    bottom: 80, // Dejar espacio para el Tab Navigator
  },
  modalView: {
    position: "absolute",
    width: "100%",
    alignSelf: "center",
    zIndex: -1, // Poner detrás del TabNavigator
    height: 200,
    backgroundColor: "white",
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
    padding: 20,
    alignItems: "center",
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
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginVertical: 5,
  },
});

export default CrearModal;
