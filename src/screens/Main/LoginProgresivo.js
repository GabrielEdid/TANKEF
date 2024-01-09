import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Button,
  Text,
  Image,
  TouchableOpacity,
  Modal,
} from "react-native";
import { Camera } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";

export default function App() {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [cameraOpened, setCameraOpened] = useState(false);
  const cameraRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(status === "granted");
    })();
  }, []);

  const openCamera = () => {
    setCameraOpened(true);
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      const croppedPhoto = await cropImage(photo.uri);
      setCapturedImage(croppedPhoto.uri); // Guarda la URI de la imagen recortada
      setCameraOpened(false); // Cierra la cámara después de tomar la foto
    }
  };

  const cropImage = async (uri) => {
    // Ajusta según las dimensiones de tu área delimitada
    const manipResult = await ImageManipulator.manipulateAsync(
      uri,
      [{ crop: { originX: 120, originY: 2950, width: 1800, height: 1200 } }],
      { compress: 1, format: ImageManipulator.SaveFormat.PNG }
    );
    return manipResult;
  };

  if (hasCameraPermission === null) {
    return <View />;
  }

  if (hasCameraPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={openCamera} style={styles.button}>
        <Text style={styles.buttonText}>Open Camera</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={false}
        visible={cameraOpened}
        onRequestClose={() => {
          setCameraOpened(false);
        }}
      >
        <Camera style={styles.camera} ref={cameraRef}>
          <View style={styles.cameraContainer}>
            <TouchableOpacity
              onPress={takePicture}
              style={styles.captureButton}
            >
              <Text style={styles.captureButtonText}>Capture</Text>
            </TouchableOpacity>
            <View style={styles.shadedArea} />
          </View>
        </Camera>
      </Modal>

      {capturedImage && (
        <Image source={{ uri: capturedImage }} style={styles.previewImage} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  camera: {
    flex: 1,
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "column",
    justifyContent: "flex-end",
  },
  captureButton: {
    flex: 0,
    alignSelf: "center",
    margin: 20,
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
  },
  captureButtonText: {
    fontSize: 14,
    color: "#000",
  },
  shadedArea: {
    aspectRatio: 1.5,
    height: 235,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    margin: 20,
  },
  previewImage: {
    width: 300, // Ajusta según tus necesidades
    height: 200, // Ajusta según tus necesidades
    marginTop: 20,
    borderRadius: 10, // Opcional: para bordes redondeados
  },
});
