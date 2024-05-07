// Importaciones de React Native y React
import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ActivityIndicator } from "react-native-paper";
import { FinanceContext } from "../hooks/FinanceContext";
// Importaciones de Componentes
import { Ionicons, FontAwesome } from "@expo/vector-icons";

/**
 * `ObligadoSolidario` es un componente que muestra información de un posible obligado solidario.
 * Es adaptable para ser seleccionado o ser elimiando.
 *
 * Props:
 * - `userID`: Identificador único del usuario asociado a la conexión.
 * - `imagen`: Puede ser una URL de imagen o un recurso local para mostrar como avatar del usuario.
 * - `nombre`: Nombre del usuario a mostrar en la tarjeta de conexión.
 *
 * Ejemplo de uso (o ver en ObligadosSolidarios.js o DefinirCredito.js):
 * <ObligadoSolidario
 *   userID="123"
 *   imagen="https://ruta/a/imagen.jpg"
 *   nombre="John Doe"
 *   select={true} // Maneja si es seleccionable o desechable
 *   button={true} // Maneja si se muestra el botón de eliminar o seleccionar
 * />
 */

const ObligadoSolidario = (props) => {
  const navigation = useNavigation();
  // Estados y Contexto
  const { finance, setFinance } = useContext(FinanceContext);
  const [isVisible, setIsVisible] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selected, setSelected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Si la conexión no es visible, no se renderiza
  if (!isVisible) {
    return null;
  }

  // Determinar la fuente de la imagen
  let imageSource;
  if (typeof props.imagen === "string") {
    // Assuming it's a URL for a network image
    imageSource = { uri: props.imagen };
  } else {
    // Assuming it's a local image requiring require()
    imageSource = props.imagen;
  }

  const handlePress = () => {
    // Si se trata de seleccionar un obligado solidario
    if (props.button && props.select) {
      const isSelected = finance.obligados_solidarios.some(
        (obligado) => obligado.userID === props.userID
      );

      // Si ya está seleccionado, lo eliminamos de la lista
      if (isSelected) {
        const updatedObligados = finance.obligados_solidarios.filter(
          (obligado) => obligado.userID !== props.userID
        );
        setFinance((prevState) => ({
          ...prevState,
          obligados_solidarios: updatedObligados,
        }));
      } else {
        // Si no está seleccionado, lo agregamos a la lista
        const newObligado = {
          userID: props.userID,
          nombre: props.nombre,
          imagen: props.imagen,
        };
        setFinance((prevState) => ({
          ...prevState,
          obligados_solidarios: [
            ...prevState.obligados_solidarios,
            newObligado,
          ],
        }));
      }
      // Alternar el estado de seleccionado
      setSelected(!isSelected);
    }

    // Si se trata de eliminar un obligado solidario
    else if (props.button && !props.select) {
      // Directamente eliminamos el obligado solidario sin alterar el estado de `selected`
      const updatedObligados = finance.obligados_solidarios.filter(
        (obligado) => obligado.userID !== props.userID
      );
      setFinance((prevState) => ({
        ...prevState,
        obligados_solidarios: updatedObligados,
      }));
      // Opcional: manejar si se debe ocultar el componente tras eliminar
      setIsVisible(false);
    }
  };
  // Establece el estado inicial de `selected` basado en si el userID ya está en la lista
  useEffect(() => {
    const isSelected = finance.obligados_solidarios.some(
      (obligado) => obligado.userID === props.userID
    );
    setSelected(isSelected);
  }, [finance.obligados_solidarios, props.userID]);

  // Componente visual
  return (
    // Lo hace un boton
    <View style={styles.container}>
      <View style={{ flexDirection: "row", flex: 1 }}>
        <Image source={imageSource} style={styles.icon} />
        <Text style={styles.textoNombre}>{props.nombre}</Text>
      </View>
      {/* Para Mostrar Boton de Eliminar o Seleccionar */}
      {props.button && (
        <TouchableOpacity
          style={{ alignSelf: "center" }}
          onPress={() => handlePress()}
        >
          {props.select ? (
            <Ionicons
              name="checkmark-circle"
              size={30}
              color={selected ? "#2FF690" : "#E9E9E9"}
            />
          ) : (
            <FontAwesome
              name="trash-o"
              size={25}
              color="#F95C5C"
              style={{ marginRight: 5 }}
            />
          )}
        </TouchableOpacity>
      )}

      {/* Modal para mostrar si se presióna el boton de eliminar */}
      {/*<Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.fullScreenButton}
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}
        >
          <View style={styles.modalView}>
            <Text style={{ fontSize: 13 }}>
              Si eliminas la conexión deberás volver a solicitarla.
            </Text>
            <TouchableOpacity
              style={styles.buttonModal}
              onPress={() => setIsVisible(false)}
            >
              <Text style={{ color: "red" }}>Eliminar Conexión</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ marginTop: 10 }}
              onPress={() => setModalVisible(false)}
            >
              <Text>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
        </Modal>*/}
      {/* Overlay para mostrar un indicator al eliminar */}
      {isLoading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#060B4D" />
        </View>
      )}
    </View>
  );
};

// Estilos del componente
const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    marginTop: 3,
    paddingHorizontal: 20,
    height: 75,
    width: "100%",
    flexDirection: "row",
    position: "relative",
  },
  textoNombre: {
    fontSize: 17,
    fontFamily: "opensansbold",
    alignSelf: "center",
    color: "#060B4D",
    marginLeft: 15,
  },
  icon: {
    height: 45,
    width: 45,
    borderRadius: 50,
    alignSelf: "center",
  },
  linea: {
    backgroundColor: "#cccccc",
    height: 1,
    width: "100%",
    alignSelf: "center",
    position: "absolute",
    top: 80,
  },
  fullScreenButton: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    paddingBottom: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    position: "absolute",
    width: "100%",
    alignSelf: "center",
  },
  buttonModal: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginVertical: 5,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ObligadoSolidario;
