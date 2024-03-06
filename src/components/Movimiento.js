// Importaciones de React Native y React
import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  Alert,
} from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
// Importaciones de Componentes
import { APIPost, APIDelete } from "../API/APIService";
import { UserContext } from "../hooks/UserContext";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";

/**
 * `Invitaciones` es un componente que muestra información de una Invitación específica enviada al usuario,
 * como una tarjeta interactuable. Ofrece la funcionalidad para navegar a una vista detallada
 * del perfil asociado y la opción de eliminar (con confirmación mediante un modal) o aceptar esta invitación
 * para añadirlo a la red del usuario.
 *
 * Props:
 * - `objectID`: Identificador único del objeto renderizado, se utiliza para eliminar la invitación.
 * - `userID`: Identificador único del usuario asociado a la invitaciones.
 * - `imagen`: Puede ser una URL de imagen o un recurso local para mostrar como avatar del usuario.
 * - `nombre`: Nombre del usuario a mostrar en la tarjeta de invitaciones.
 * - `mail`: Correo electrónico del usuario asociado a la invitaciones.
 *
 * Ejemplo de uso (o ver en MiRed.js):
 * <Invitaciones
 *   userID="123"
 *   objectID="456"
 *   imagen="https://ruta/a/imagen.jpg"
 *   nombre="John Doe"
 *   mail="johndoe@gmail.com"
 * />
 */

const Movimiento = (props) => {
  const navigation = useNavigation();
  // Estados y Contexto
  const { user, setUser } = useContext(UserContext);
  const [isVisible, setIsVisible] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Componente visual
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
        {/* Ensure alignment and spacing */}
        <AntDesign
          name={props.positive === true ? "arrowup" : "arrowdown"}
          size={24}
          color={props.positive === true ? "#2FF690" : "#F33B45"}
        />
        <View style={{ marginLeft: 10, flex: 1 }}>
          <Text style={styles.textoMovimiento}>{props.movimiento}</Text>
          <Text style={styles.textoFecha}>{props.fecha}</Text>
        </View>
        <Text style={styles.textoMonto}>{props.monto}</Text>
      </View>
      <View style={styles.linea} />
    </View>
  );
};

// Estilos del componente
const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 3,
    width: "100%",
    position: "relative",
  },
  textoMovimiento: {
    fontSize: 16,
    color: "#060B4D",
    fontFamily: "opensansbold",
  },
  textoFecha: {
    fontSize: 14,
    color: "#060B4D",
    fontFamily: "opensans",
  },
  textoMonto: {
    fontSize: 16,
    color: "#060B4D",
    alignSelf: "center",
    fontFamily: "opensansbold",
  },
});

export default Movimiento;
