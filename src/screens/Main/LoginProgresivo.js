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
import { AntDesign } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";

const LoginProgresivo = ({ navigation }) => {
  // Estados locales
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [cameraOpened, setCameraOpened] = useState(false);
  const cameraRef = useRef(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [frontIdImage, setFrontIdImage] = useState(null);
  const [backIdImage, setBackIdImage] = useState(null);
  const [faceImage, setFaceImage] = useState(null);

  // Mapa para cargar todas las imagenes
  const imageMap = {
    Tarjeta: require("../../../assets/images/tarjeta.png"),
    Cara: require("../../../assets/images/fondoCara.png"),
    // ... más imágenes
  };

  // Permisos de la cámara
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(status === "granted");
    })();
  }, []);

  // Función para abrir la cámara
  const openCamera = (
    setImageStateCallback,
    type = Camera.Constants.Type.back
  ) => {
    setCurrentImageSetter(() => setImageStateCallback);
    setCameraType(type);
    setCameraOpened(true);
  };

  // Estado donde se guarda el setter de la imagen que se va a tomar en el momento
  const [currentImageSetter, setCurrentImageSetter] = useState(null);

  // Función para tomar la foto
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

  // Función para recortar la imagen dependiendo si es INE o Rostro
  const cropImage = async (uri) => {
    // Estos valores dependen de la posición y tamaño del óvalo en tu diseño
    {
      (await cameraType) === Camera.Constants.Type.back
        ? (manipResult = await ImageManipulator.manipulateAsync(
            uri,
            [
              {
                // Cortar par INE
                crop: {
                  originX: 120,
                  originY: 1500,
                  width: 1750,
                  height: 1200,
                },
              },
            ],
            { compress: 1, format: ImageManipulator.SaveFormat.PNG }
          ))
        : (manipResult = await ImageManipulator.manipulateAsync(
            uri,
            [
              {
                // Cortar par Rostro
                crop: {
                  originX: 60,
                  originY: 700,
                  width: 1690,
                  height: 2100,
                },
              },
            ],
            { compress: 1, format: ImageManipulator.SaveFormat.PNG }
          ));
    }
    return manipResult;
  };

  // Perimisos de la camara
  if (hasCameraPermission === null) {
    return <View />;
  }

  if (hasCameraPermission === false) {
    return <Text>No access to camera</Text>;
  }

  // Componente visual
  return (
    <View style={styles.background}>
      {/* Titulo */}
      <View style={styles.tituloContainer}>
        <Text style={styles.titulo}>TANKEF</Text>
      </View>

      {/* Boton de regresar */}
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <AntDesign
          name="arrowleft"
          size={40}
          color="#29364d"
          style={styles.back}
        />
      </TouchableOpacity>

      {/* Incentivo a Completar datos */}
      <View style={{ flex: 1 }}>
        <Text style={styles.header}>
          ¡Termina de registrar todos tus datos para{" "}
          <Text style={{ fontWeight: "bold" }}>
            comenzar a realizar movimientos!
          </Text>
        </Text>

        {/* Linea de Separación */}
        <View style={styles.linea}></View>
        {/* Contenedor Principal Scrolleable */}
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Indicaciones */}
          <Text style={styles.texto}>
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
            <Text style={styles.textoBanner}>
              Foto del{" "}
              <Text style={{ fontWeight: "bold" }}>frente de tu INE</Text>
            </Text>
            {/* Boton de Abirir Camara */}
            <TouchableOpacity
              onPress={() => openCamera(setFrontIdImage)}
              style={styles.button}
            >
              <Text style={styles.buttonText}>
                {!frontIdImage ? "ABRIR CÁMARA" : "RETOMAR IMAGEN"}
              </Text>
            </TouchableOpacity>
            {/* Palomita de listo */}
            {frontIdImage ? (
              <Feather
                style={styles.checkMark}
                name="check-circle"
                size={30}
                color="#29364d"
              />
            ) : null}
          </View>
          {/* Visualización de la Imagen tomada */}
          {frontIdImage && (
            <View>
              <Image
                source={{ uri: frontIdImage }}
                style={styles.previewCardImage}
              />
              {/* Mensaje de la Imagen */}
              <Text style={[styles.texto, { fontSize: 15 }]}>
                Asegurate de que aparezca la identificacion completa en la
                imagen y que no tenga reflejos.
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
            <Text style={styles.textoBanner}>
              Foto de la parte{" "}
              <Text style={{ fontWeight: "bold" }}>trasera de tu INE</Text>
            </Text>
            {/* Boton de Abirir Camara */}
            <TouchableOpacity
              onPress={() => openCamera(setBackIdImage)}
              style={styles.button}
            >
              <Text style={styles.buttonText}>
                {!backIdImage ? "ABRIR CÁMARA" : "RETOMAR IMAGEN"}
              </Text>
            </TouchableOpacity>
            {/* Palomita de listo */}
            {backIdImage ? (
              <Feather
                style={styles.checkMark}
                name="check-circle"
                size={30}
                color="#29364d"
              />
            ) : null}
          </View>
          {/* Visualización de la Imagen tomada */}
          {backIdImage && (
            <View>
              <Image
                source={{ uri: backIdImage }}
                style={styles.previewCardImage}
              />
              {/* Mensaje de la Imagen */}
              <Text style={[styles.texto, { fontSize: 15 }]}>
                Asegurate de que aparezca la identificacion completa en la
                imagen y que no tenga reflejos.
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
            <Text style={styles.textoBanner}>
              Foto de tu <Text style={{ fontWeight: "bold" }}>rostro</Text>
            </Text>
            {/* Boton de Abirir Camara */}
            <TouchableOpacity
              onPress={() =>
                openCamera(setFaceImage, Camera.Constants.Type.front)
              }
              style={styles.button}
            >
              <Text style={styles.buttonText}>
                {!faceImage ? "ABRIR CÁMARA" : "RETOMAR IMAGEN"}
              </Text>
            </TouchableOpacity>
            {/* Palomita de listo */}
            {faceImage ? (
              <Feather
                style={styles.checkMark}
                name="check-circle"
                size={30}
                color="#29364d"
              />
            ) : null}
          </View>
          {/* Visualización de la Imagen tomada */}
          {faceImage && (
            <View>
              <Image
                source={{ uri: faceImage }}
                style={styles.previewFaceImage}
              />
              {/* Mensaje de la Imagen */}
              <Text style={[styles.texto, { fontSize: 15 }]}>
                Asegurate de que tu rostro se muestre de manera clara y bien
                alumbrado
              </Text>
            </View>
          )}
          <View style={{ height: 30 }} />
        </ScrollView>
        {/* Fin del Contenedor Principal */}
      </View>

      {/* Modal de la Cámara */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={cameraOpened}
        onRequestClose={() => setCameraOpened(false)} // Esto permite cerrar el modal con el botón de retroceso en Android
      >
        <Camera style={styles.camera} type={cameraType} ref={cameraRef}>
          <View style={styles.cameraContainer}>
            {/* Evalua si abrir camara frontal o trasera dependiendo del estado de cameraType */}
            {cameraType === Camera.Constants.Type.front ? (
              <>
                {/* Estilos de camara frontal */}
                <Image source={imageMap.Cara} style={styles.ovalImage} />
                <View style={styles.ovalOverlay}></View>
              </>
            ) : (
              <>
                {/* Estilos de camara trasera */}
                <View style={styles.shadedArea1} />
                <View style={styles.shadedArea2} />
                <View style={styles.shadedArea3} />
                <View style={styles.shadedArea4} />
                <Image source={imageMap.Tarjeta} style={styles.shadedArea} />
              </>
            )}
            {/* Boton de Capturar */}
            <TouchableOpacity
              onPress={takePicture}
              style={styles.captureButton}
            >
              <Text style={styles.captureButtonText}>CAPTURAR</Text>
            </TouchableOpacity>
            {/* Boton de Cerrar */}
            <TouchableOpacity
              onPress={() => setCameraOpened(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>CERRAR</Text>
            </TouchableOpacity>
          </View>
        </Camera>
      </Modal>

      {/* Boton de Siguiente, se evalua si ya estan todas las imagenes listas */}
      {frontIdImage && backIdImage && faceImage ? (
        <>
          {/* Linea de Separación, aparece cuando todas las imagenes estan listas junto con el boton */}
          <View style={[styles.linea, { marginTop: 0 }]}></View>
          <TouchableOpacity
            style={styles.nextButton}
            onPress={() => navigation.navigate("LoginProgresivo2")}
          >
            <Text style={styles.nextButtonText}>SIGUIENTE</Text>
          </TouchableOpacity>
        </>
      ) : null}
    </View>
  );
};

// Estilos de la Pantalla
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
  linea: {
    backgroundColor: "#cccccc",
    height: 1,
    width: "100%",
    alignSelf: "center",
    marginTop: 10,
  },
  texto: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    color: "#29364d",
    marginTop: 10,
  },
  textoBanner: {
    flex: 1,
    fontSize: 18,
    color: "#29364d",
    marginTop: 10,
  },
  button: {
    flex: 1,
    backgroundColor: "#29364d",
    padding: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#29364d",
    width: "55%",
    marginLeft: 10,
    justifyContent: "flex-end",
  },
  buttonText: {
    color: "white",
    alignSelf: "center",
    fontSize: 14,
    fontFamily: "conthrax",
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
    top: 288,
    width: 382,
    height: 257,
    backgroundColor: "transparent",
    margin: 5,
    justifyContent: "flex-start",
  },
  ovalImage: {
    position: "absolute",
    width: "125%",
    alignSelf: "center",
    height: "100%",
    top: "0",
    tintColor: "rgba(0, 0, 0, 0.5)",
  },
  ovalOverlay: {
    position: "absolute",
    left: "7%",
    right: "7%",
    top: "17%",
    bottom: "32%",
    borderWidth: 18,
    borderColor: "white",
    borderRadius: 200,
    borderStyle: "dashed",
    aspectRatio: 1,
  },
  previewCardImage: {
    aspectRatio: 1750 / 1200,
    width: "80%",
    alignSelf: "center",
    marginTop: 20,
    borderRadius: 10,
  },
  previewFaceImage: {
    aspectRatio: 1690 / 2100,
    width: "80%",
    alignSelf: "center",
    marginTop: 20,
    borderRadius: "2000",
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
