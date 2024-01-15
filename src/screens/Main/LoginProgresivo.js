// Importaciones de React Native y React
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Modal,
} from "react-native";
import { Camera } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";
// Importaciones de Hooks y Componentes
import { Feather } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";

const LoginProgresivo = () => {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [cameraOpened, setCameraOpened] = useState(false);
  const cameraRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [frontIdImage, setFrontIdImage] = useState(null);
  const [backIdImage, setBackIdImage] = useState(null);
  const [faceImage, setFaceImage] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(status === "granted");
    })();
  }, []);

  const openCamera = (setImageStateCallback) => {
    setCurrentImageSetter(() => setImageStateCallback); // Guarda la callback de actualización de estado
    setCameraOpened(true);
  };

  const [currentImageSetter, setCurrentImageSetter] = useState(null);

  const takePicture = async () => {
    console.log("takePicture called"); // Verifica que la función es llamada

    if (cameraRef.current) {
      console.log("Camera ref is valid"); // Verifica que cameraRef.current no es null

      try {
        console.log("Trying to take a picture..."); // Informa antes de tomar la foto
        const photo = await cameraRef.current.takePictureAsync();
        console.log("Picture taken", photo.uri); // Informa y muestra la URI de la foto tomada

        const croppedPhoto = await cropImage(photo.uri);
        console.log("Picture cropped", croppedPhoto.uri); // Informa y muestra la URI de la foto recortada

        currentImageSetter(croppedPhoto.uri); // Actualiza el estado de la imagen correspondiente
        setCameraOpened(false); // Cierra la cámara
      } catch (error) {
        console.error("Error taking picture", error); // Muestra el error en caso de fallo
      }
    } else {
      console.log("Camera ref is not valid"); // Informa si cameraRef.current es null
    }
  };

  const cropImage = async (uri) => {
    // Ajusta según las dimensiones de tu área delimitada
    const manipResult = await ImageManipulator.manipulateAsync(
      uri,
      [{ crop: { originX: 120, originY: 1500, width: 1750, height: 1200 } }],
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
    <View style={styles.background}>
      {/*Titulo*/}
      <View style={styles.tituloContainer}>
        <Text style={styles.titulo}>TANKEF</Text>
      </View>
      {/* Incentivo a Completar datos */}
      <View style={{ flex: 1 }}>
        <Text style={styles.header}>
          ¡Termina de registrar todos tus datos para{" "}
          <Text style={{ fontWeight: "bold" }}>
            comenzar a realizar movimientos!
          </Text>
        </Text>
        {/* Contenedor Principal */}
        <View style={styles.container}>
          <ScrollView>
            {/* Indicaciones */}
            <Text style={[styles.texto, { flex: 0 }]}>
              Para continuar, se requieren fotos de tu{" "}
              <Text style={{ fontWeight: "bold" }}>
                identificación y tu rostro{" "}
              </Text>
              para verificar tu identidad.
            </Text>
            {/* Seccion INE por Delante */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 10,
              }}
            >
              <Text style={styles.texto}>
                Foto del{" "}
                <Text style={{ fontWeight: "bold" }}>frente de tu INE</Text>
              </Text>
              <TouchableOpacity
                onPress={() => openCamera(setFrontIdImage)}
                style={styles.button}
              >
                <Text style={styles.buttonText}>
                  {!frontIdImage ? "ABRIR CÁMARA" : "RETOMAR IMAGEN"}
                </Text>
              </TouchableOpacity>
              {frontIdImage ? (
                <Feather
                  style={styles.checkMark}
                  name="check-circle"
                  size={30}
                  color="#21b6d5"
                />
              ) : null}
            </View>
            {frontIdImage && (
              <View>
                <Image
                  source={{ uri: frontIdImage }}
                  style={styles.previewImage}
                />
                <Text style={[styles.texto, { fontSize: 15 }]}>
                  Asegurate de que aparezca la identificacion completa en la
                  imagen
                </Text>
              </View>
            )}
            {/* Seccion INE por Detrás */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 15,
              }}
            >
              <Text style={styles.texto}>
                Foto de la parte{" "}
                <Text style={{ fontWeight: "bold" }}>trasera de tu INE</Text>
              </Text>
              <TouchableOpacity
                onPress={() => openCamera(setBackIdImage)}
                style={styles.button}
              >
                <Text style={styles.buttonText}>
                  {!backIdImage ? "ABRIR CÁMARA" : "RETOMAR IMAGEN"}
                </Text>
              </TouchableOpacity>
              {backIdImage ? (
                <Feather
                  style={styles.checkMark}
                  name="check-circle"
                  size={30}
                  color="#21b6d5"
                />
              ) : null}
            </View>

            {backIdImage && (
              <View>
                <Image
                  source={{ uri: backIdImage }}
                  style={styles.previewImage}
                />
                <Text style={[styles.texto, { fontSize: 15 }]}>
                  Asegurate de que aparezca la identificacion completa en la
                  imagen
                </Text>
              </View>
            )}

            {/* Seccion Rostro */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 15,
              }}
            >
              <Text style={styles.texto}>
                Foto de tu <Text style={{ fontWeight: "bold" }}>rostro</Text>
              </Text>
              <TouchableOpacity
                onPress={() => openCamera(setFaceImage)}
                style={styles.button}
              >
                <Text style={styles.buttonText}>
                  {!faceImage ? "ABRIR CÁMARA" : "RETOMAR IMAGEN"}
                </Text>
              </TouchableOpacity>
              {faceImage ? (
                <Feather
                  style={styles.checkMark}
                  name="check-circle"
                  size={30}
                  color="#21b6d5"
                />
              ) : null}
            </View>

            {faceImage && (
              <View>
                <Image
                  source={{ uri: faceImage }}
                  style={styles.previewImage}
                />
                <Text style={[styles.texto, { fontSize: 15 }]}>
                  Asegurate de que tu rostro se muestre de manera clara y bien
                  alumbrado
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
      <Modal
        animationType="slide"
        transparent={false}
        visible={cameraOpened}
        onRequestClose={() => setCameraOpened(false)} // Esto permite cerrar el modal con el botón de retroceso en Android
      >
        <Camera style={styles.camera} ref={cameraRef}>
          <View style={styles.cameraContainer}>
            <View style={styles.shadedArea1} />
            <View style={styles.shadedArea2} />
            <View style={styles.shadedArea3} />
            <View style={styles.shadedArea4} />
            <TouchableOpacity
              onPress={takePicture}
              style={styles.captureButton}
            >
              <Text style={styles.captureButtonText}>CAPTURAR</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setCameraOpened(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>CERRAR</Text>
            </TouchableOpacity>
          </View>
        </Camera>
      </Modal>

      {frontIdImage && backIdImage && faceImage ? (
        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => handleSiguiente()}
        >
          <Text style={styles.nextButtonText}>SIGUIENTE</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  tituloContainer: {
    height: 105,
    backgroundColor: "white",
  },
  background: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
  },
  titulo: {
    fontFamily: "conthrax",
    fontSize: 27,
    color: "#29364d",
    marginTop: 70,
  },
  header: {
    fontSize: 18,
    textAlign: "center",
    color: "#29364d",
    marginTop: 10,
  },
  container: {
    padding: 10,
    marginTop: 15,
    width: "100%",
    height: "88%",
    backgroundColor: "white",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.6,
    shadowRadius: 5,
    elevation: 8,
  },
  texto: {
    flex: 1,
    fontSize: 18,
    color: "#29364d",
    marginTop: 10,
  },
  button: {
    flex: 1,
    backgroundColor: "white",
    padding: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#21b6d5",
    width: "55%",
    marginLeft: 10,
    justifyContent: "flex-end",
  },
  buttonText: {
    color: "#21b6d5",
    alignSelf: "center",
    fontSize: 14,
    fontFamily: "conthrax",
    textAlign: "center",
  },
  checkMark: {
    alignSelf: "center",
    marginHorizontal: 5,
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
    alignSelf: "center",
    margin: 20,
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    paddingHorizontal: 20,
  },
  captureButtonText: {
    fontSize: 14,
    color: "#29364d",
    fontFamily: "conthrax",
  },
  closeButton: {
    position: "absolute",
    top: 50,
    right: 20,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 15,
  },
  closeButtonText: {
    color: "#29364d",
    fontFamily: "conthrax",
    fontWeight: "bold",
  },
  shadedArea1: {
    position: "absolute",
    left: 0,
    width: 20,
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  shadedArea2: {
    position: "absolute",
    right: 0,
    width: 20,
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  shadedArea3: {
    position: "absolute",
    top: -117.5,
    left: 20,
    right: 20,
    height: "50%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  shadedArea4: {
    position: "absolute",
    bottom: -117.5,
    left: 20,
    right: 20,
    height: "50%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  shadedArea: {
    position: "absolute",
    top: 50,
    aspectRatio: 1.5,
    height: 235,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    margin: 20,
    justifyContent: "flex-start",
  },
  previewImage: {
    width: "100%",
    height: 200,
    marginTop: 20,
    borderRadius: 10,
  },
  nextButton: {
    width: "100%",
    height: 60,
    justifyContent: "center",
    backgroundColor: "#29364d",
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.37,
    shadowRadius: 5,
    elevation: 8,
    alignSelf: "center",
    marginBottom: 20,
    marginTop: 15,
  },
  nextButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 20,
    fontFamily: "conthrax",
  },
});

export default LoginProgresivo;
