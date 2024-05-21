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
import { FinanceContext } from "../hooks/FinanceContext";
// Importaciones de Componentes
import { useInactivity } from "../hooks/InactivityContext";
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
 * Ejemplo de uso (o ver en ObligadosSolidarios.js):
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
  const { resetTimeout } = useInactivity();
  const { finance, setFinance } = useContext(FinanceContext);
  const [selected, setSelected] = useState(false);

  // Determinar la fuente de la imagen
  let imageSource;
  if (typeof props.imagen === "string") {
    imageSource = { uri: props.imagen };
  } else {
    imageSource = props.imagen;
  }

  const handlePress = () => {
    resetTimeout();
    // Si se trata de seleccionar un obligado solidario
    if (props.button && props.select) {
      const isSelected = finance.obligados_solidarios.includes(props.userID);

      // Si ya está seleccionado, lo eliminamos de la lista
      if (isSelected) {
        const updatedObligados = finance.obligados_solidarios.filter(
          (id) => id !== props.userID
        );
        setFinance((prevState) => ({
          ...prevState,
          obligados_solidarios: updatedObligados,
        }));
      } else {
        // Si no está seleccionado, lo agregamos a la lista
        setFinance((prevState) => ({
          ...prevState,
          obligados_solidarios: [
            ...prevState.obligados_solidarios,
            props.userID,
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
        (id) => id !== props.userID
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
    const isSelected = finance.obligados_solidarios.includes(props.userID);
    setSelected(isSelected);
  }, [finance.obligados_solidarios, props.userID]);

  // Componente visual
  return (
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
});

export default ObligadoSolidario;
