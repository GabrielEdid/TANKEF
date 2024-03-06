// Importaciones de React Native y React
import React, { useCallback, useState } from "react";
import { View, Image, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
// Importaciones de Componentes y Hooks
import { MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";
import { APIGet } from "../API/APIService";

// Constantes para los tamaño de las imágenes
const imageSize = 45; // Diameter of the circular images
const overlap = 20; // Overlap size
const borderSize = 2;

/**
 * `StackedImages` es un componente visual que muestra imágenes apiladas horizontalmente.
 * Está diseñado para mostrar avatares o imágenes de perfil de usuarios de manera que se
 * solapen parcialmente, creando un efecto visual de "stack". Este componente es útil para
 * mostrar miembros de un grupo, participantes de un evento, o simplemente para ahorrar espacio
 * al mostrar múltiples imágenes en una vista compacta.
 *
 * Este componente no recibe props externas y realiza una llamada a una API para
 * obtener las imágenes a mostrar.
 *
 * Ejemplo de uso (o ver en MiTankef.js):
 * <StackedImages />
 *
 * Este componente utiliza `useFocusEffect` de React Navigation para actualizar las imágenes
 * cada vez que el componente entra en foco, asegurando que los datos estén siempre actualizados.
 */

const StackedImages = () => {
  const navigation = useNavigation();
  // Estados locales
  const [images, setImages] = useState([]);

  // Mapeo de imágenes
  const imageMap = {
    Blank: require("../../assets/images/blankAvatar.jpg"),
    // ... más imágenes
  };

  // Función para obtener las imágenes de la API
  const fetchDashboard = async () => {
    const url = "/api/v1/dashboard";
    const response = await APIGet(url);
    if (response.error) {
      // Manejar el error
      console.error("Error al obtener el Dashboard:", response.error);
    } else {
      setImages(response.data.data.members);
    }
  };

  // Efecto para obtener las imágenes al cargar el componente
  useFocusEffect(
    useCallback(() => {
      fetchDashboard();
    }, [])
  );

  // Componente visual
  return (
    <View style={styles.container}>
      {/* Si hay miembros en la red se muestran sus imagenes */}
      {images.length > 0 ? (
        images.map((imgUrl, index) => (
          <View key={index} style={styles.imageWrapper}>
            <View style={styles.borderWrapper}>
              <Image source={{ uri: imgUrl }} style={styles.image} />
            </View>
          </View>
        ))
      ) : (
        /* Si no hay miembros en la red se muestra un texto */
        <View style={styles.addButtonContainer}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate("MiRed")}
          >
            <MaterialCommunityIcons
              name="account-plus"
              size={25}
              color="#060B4D"
              style={{ transform: [{ scaleX: -1 }] }}
            />
            <Text style={styles.addButtonText}>Agregar amigo</Text>
          </TouchableOpacity>
          <Text style={styles.addButtonTextInfo}>
            Haz crecer tu red financiera agregando amigos, socios o familiares,
            solicita un crédito, invierte y/o crea tu caja de ahorro presionando
            el icono{" "}
            <FontAwesome name="plus-square-o" size={20} color="#060B4D" />
          </Text>
        </View>
      )}
    </View>
  );
};

// Estilos del componente
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginBottom: 10,
    marginTop: 5,
    marginLeft: 15,
    alignSelf: "center",
  },
  imageWrapper: {
    width: imageSize,
    height: imageSize,
    borderRadius: imageSize / 2,
    overflow: "hidden",
    alignItems: "center",
    marginLeft: -overlap,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  borderWrapper: {
    borderWidth: borderSize,
    borderColor: "white",
    borderRadius: imageSize / 2,
    overflow: "hidden",
    width: imageSize,
    height: imageSize,
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonContainer: {
    marginTop: 5,
    alignItems: "center",
  },
  addButton: {
    backgroundColor: "#2FF690",
    paddingVertical: 5,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
  },
  addButtonText: {
    marginLeft: 5,
    fontFamily: "opensanssemibold",
    color: "#060B4D",
  },
  addButtonTextInfo: {
    marginTop: 10,
    paddingHorizontal: 40,
    textAlign: "center",
    fontFamily: "opensans",
    color: "#060B4D",
  },
});

export default StackedImages;
