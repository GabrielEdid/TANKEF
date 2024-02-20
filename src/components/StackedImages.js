// Importaciones de React Native y React
import React, { useCallback, useState } from "react";
import { View, Image, StyleSheet, Text } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
// Importaciones de Componentes y Hooks
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
    // Contenedor de las imágenes
    <View style={styles.container}>
      {/* Mapea las imagenes y las renderiza una por una */}
      {images.map((imgUrl, index) => (
        <View key={index} style={styles.imageWrapper}>
          <View style={styles.borderWrapper}>
            <Image source={{ uri: imgUrl }} style={styles.image} />
          </View>
        </View>
      ))}
    </View>
  );
};

// Estilos del componente
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
});

export default StackedImages;
