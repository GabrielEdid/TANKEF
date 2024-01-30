// Importaciones de React Native y React
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  ScrollView,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useState, useContext, useEffect } from "react";
// Importaciones de Hooks y Componentes
import { UserContext } from "../hooks/UserContext";
import { Entypo, FontAwesome5, FontAwesome } from "@expo/vector-icons";

const ModalPost = ({ isModalVisible, setIsModalVisible }) => {
  // Estados y Contexto
  const { user, setUser } = useContext(UserContext);
  const [text, setText] = useState("");
  const [modalQuien, setModalQuien] = useState(false);

  const handleFocus = () => {
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    // Aquí podrías necesitar lógica adicional para reenfocar en el TextInput si es necesario
  };

  // Mapa para cargar todas las imagenes
  const imageMap = {
    Blank: require("../../assets/images/blankAvatar.jpg"),
    // ... más imágenes
  };

  // Componente visual
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isModalVisible}
      onRequestClose={handleModalClose}
    >
      <View style={styles.modalView}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <TouchableOpacity
            style={{
              flex: 1,
              justifyContent: "center",
            }}
            onPress={() => handleModalClose()}
          >
            <Entypo name="cross" size={35} color="#060B4D" />
          </TouchableOpacity>
          <Text
            style={{
              flex: 1,
              fontSize: 30,
              color: "#060B4D",
              textAlign: "center",
            }}
          >
            Post
          </Text>
          <TouchableOpacity
            style={[
              { flex: 0.9, justifyContent: "center", alignItems: "center" },
              styles.botonCompartir,
            ]} // Adjusted for centering the text
            onPress={() => handleModalClose()}
          >
            <Text
              style={{
                fontSize: 17,
                color: "white",
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              Compartir
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: "row", marginTop: 20 }}>
          <Image
            style={styles.fotoPerfilModal}
            source={user.avatar ? { uri: user.avatar } : imageMap["Blank"]}
          />
          <View>
            <Text style={styles.textoNombre}>
              {"Nombre" +
                user.nombre +
                " " +
                user.apellidoPaterno +
                " " +
                user.apellidoMaterno}
            </Text>
            <Text
              style={[
                styles.textoNombre,
                { fontSize: 12, fontWeight: "regular" },
              ]}
            >
              conexiones
            </Text>
          </View>
        </View>

        <Text style={{ marginTop: 10, color: "#060B4D", fontSize: 15 }}>
          Compartir a{" "}
          <TouchableOpacity
            onPress={() => setModalQuien(true)}
            style={{
              backgroundColor: "#2FF690",
              padding: 5,
              marginTop: -7.5,
            }}
          >
            <Text>Toda la Red</Text>
          </TouchableOpacity>
        </Text>

        <Modal animationType="slide" transparent={true} visible={modalQuien}>
          <TouchableOpacity
            style={styles.fullScreenButton}
            activeOpacity={1}
            onPress={() => setModalQuien(false)}
          >
            <View style={styles.modalQuienView}>
              <TouchableOpacity onPress={() => setModalQuien(false)}>
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
                onPress={() => setModalQuien(false)}
              >
                <FontAwesome5 name="money-bill-alt" size={30} color="#060B4D" />
                <Text style={styles.texto}>Invertir</Text>
              </TouchableOpacity>
              {/* Boton Crédito */}
              <TouchableOpacity
                style={styles.buttonModal}
                onPress={() => setModalQuien(false)}
              >
                <FontAwesome name="credit-card" size={30} color="#060B4D" />
                <Text style={styles.texto}>Solicitar Crédito</Text>
              </TouchableOpacity>
              {/* Boton Ahorro */}
              <TouchableOpacity
                style={styles.buttonModal}
                onPress={() => setModalQuien(false)}
              >
                <FontAwesome5 name="piggy-bank" size={30} color="#060B4D" />
                <Text style={styles.texto}>Caja de Ahorro</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    </Modal>
  );
};

// Estilos de la pantalla
const styles = StyleSheet.create({
  modalView: {
    marginTop: 60,
    flex: 1,
    backgroundColor: "white",
    borderRadius: 20,
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
  botonCompartir: {
    backgroundColor: "#060B4D",
    paddingVertical: 10,
    padding: 10,
    borderRadius: 5,
  },
  fotoPerfilModal: {
    width: 57,
    height: 57,
    borderRadius: 30,
  },
  textoNombre: {
    fontSize: 18,
    color: "#060B4D",
    fontWeight: "bold",
    marginLeft: 10,
  },
  modalQuienView: {
    width: "100%",
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
    position: "absolute", // Posición absoluta
    bottom: 0, // En la parte inferior de la pantalla
    justifyContent: "flex-end", // Alinea los hijos al final
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
  fullScreenButton: {
    height: "100%",
    width: "100%",
    position: "absolute",
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
});

export default ModalPost;
