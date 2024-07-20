// Importaciones de React Native y React
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Modal,
  Alert,
  ScrollView,
} from "react-native";
import React, { useState, useCallback, useEffect, useContext } from "react";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import { useFocusEffect } from "@react-navigation/native";
import RadioForm from "react-native-simple-radio-button";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { useRoute } from "@react-navigation/native";
import { ActivityIndicator } from "react-native-paper";
// Importaciones de Componentes y Hooks
import ModalEstatus from "../../components/ModalEstatus";
import { useInactivity } from "../../hooks/InactivityContext";
import { FinanceContext } from "../../hooks/FinanceContext";
import {
  Feather,
  FontAwesome,
  AntDesign,
  MaterialIcons,
} from "@expo/vector-icons";
import { APIPut, APIGet, APIPost } from "../../API/APIService";

// Se mide la pantalla para determinar medidas
const screenWidth = Dimensions.get("window").width;
const widthHalf = screenWidth / 2;
const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ALLOWED_EXTENSIONS = ["pdf", "jpg", "jpeg", "png", "bmp"];

const Documentacion = ({ navigation }) => {
  const route = useRoute();
  const { flujo, idInversion } = route.params;
  // Estados y Contexto
  const { resetTimeout } = useInactivity();
  const { finance, setFinance, resetFinance } = useContext(FinanceContext);
  //const [modalVisible, setModalVisible] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [documentsLoaded, setDocumentsLoaded] = useState(false);
  const [addAccount, setAddAccount] = useState(false);
  const [initial, setInitial] = useState(-1);
  const [failedRequests, setFailedRequests] = useState({
    documents: false,
    bankAccount: false,
  });

  // Función para manejar el botón de continuar
  const handleSubmit = async () => {
    resetTimeout();
    setLoading(true);
    setDisabled(true);

    await sendDocuments();

    if (addAccount || !finance.accountID) {
      setLoading(false);
      navigation.navigate("DatosBancarios", {
        flujo: flujo,
        idInversion: idInversion,
        sendDocuments: sendDocuments.bind(this),
        addAccount: addAccount,
      });
      return;
    }

    await sendBankAccount();

    if (!failedRequests.documents && !failedRequests.bankAccount) {
      if (flujo === "Crédito") {
        navigation.navigate("DefinirCredito", {
          flujo: flujo,
          idInversion: idInversion,
        });
        setFinance({
          ...finance,
          paso: finance.paso + 1,
        });
      } else {
        setModalVisible(true);
      }
    }

    setLoading(false);
    setDisabled(false);
  };

  // Función para subir la documentación
  const sendDocuments = async () => {
    const key =
      flujo === "Inversión"
        ? "investment"
        : flujo === "Crédito"
        ? "credit"
        : "box_saving";

    const url = `/api/v1/${
      flujo === "Inversión"
        ? "investments"
        : flujo === "Crédito"
        ? "credits"
        : "box_savings"
    }/${idInversion}`;

    let body;

    if (documentsLoaded) {
      body = {
        [key]: {
          accept_documentation_1:
            finance.actuoComo === "Actúo a nombre y por cuenta propia.",
          accept_documentation_2:
            finance.actuoComo === "Actúo a nombre y por cuenta de un tercero.",
          ...(flujo === "Crédito" && {
            research_credit_bureau: finance.aceptarSIC,
          }),
        },
      };
    } else {
      const formData = new FormData();
      formData.append(`${key}[official_identification]`, {
        uri: finance.identificacion,
        type: "image/jpeg",
        name: "identificacion.jpeg",
      });
      formData.append(`${key}[curp]`, {
        uri: finance.CURP,
        type: "image/jpeg",
        name: "CURP.jpeg",
      });
      formData.append(`${key}[proof_sat]`, {
        uri: finance.situacionFiscal,
        type: "image/jpeg",
        name: "situacionFiscal.jpeg",
      });
      formData.append(`${key}[proof_address]`, {
        uri: finance.comprobanteDomicilio,
        type: "image/jpeg",
        name: "comprobanteDomicilio.jpeg",
      });
      formData.append(
        `${key}[accept_documentation_1]`,
        finance.actuoComo === "Actúo a nombre y por cuenta propia."
          ? "true"
          : "false"
      );
      formData.append(
        `${key}[accept_documentation_2]`,
        finance.actuoComo === "Actúo a nombre y por cuenta de un tercero."
          ? "true"
          : "false"
      );
      if (flujo === "Crédito") {
        formData.append(`${key}[research_credit_bureau]`, finance.aceptarSIC);
      }

      body = formData;
    }

    try {
      const response = await APIPut(url, body);

      if (response.error) {
        setFailedRequests((prev) => ({ ...prev, documents: true }));
        Alert.alert(
          "Error",
          "No se pudieron agregar los documentos. Intente nuevamente."
        );
        return false; // Devuelve falso en caso de error
      } else {
        setFailedRequests((prev) => ({ ...prev, documents: false }));
        return true; // Devuelve verdadero en caso de éxito
      }
    } catch (error) {
      setFailedRequests((prev) => ({ ...prev, documents: true }));
      Alert.alert("Error", "Ocurrió un error al procesar la solicitud.");
      return false; // Devuelve falso en caso de excepción
    }
  };

  const sendBankAccount = async () => {
    const key =
      flujo === "Inversión"
        ? "investment"
        : flujo === "Crédito"
        ? "credit"
        : "box_saving";

    const url = `/api/v1/${
      flujo === "Inversión"
        ? "investments"
        : flujo === "Crédito"
        ? "credits"
        : "box_savings"
    }/${idInversion}/bank_accounts`;

    const data = {
      [key]: {
        bank_account_id: finance.accountID,
      },
    };

    try {
      const response = await APIPost(url, data);

      if (response.error) {
        setFailedRequests((prev) => ({ ...prev, bankAccount: true }));
        Alert.alert(
          "Error",
          "No se pudieron guardar los datos de la cuenta bancaria. Intente nuevamente."
        );
      } else {
        setFailedRequests((prev) => ({ ...prev, bankAccount: false }));
      }
    } catch (error) {
      setFailedRequests((prev) => ({ ...prev, bankAccount: true }));
      Alert.alert(
        "Error",
        "Hubo un problema al enviar los datos. Por favor, intenta de nuevo."
      );
    }
  };

  // Funcion para manejar el boton de cancelar
  const handleCancelar = () => {
    resetTimeout();
    Alert.alert(
      `¿Deseas cancelar ${flujo === "Crédito" ? `el ${flujo}` : `la ${flujo}`}`,
      `Si cancelas ${
        flujo === "Crédito" ? `el ${flujo}` : `la ${flujo}`
      }, perderás la información ingresada hasta el momento.`,
      [
        {
          text: `Si`,
          onPress: () => [cancelar()],
          style: "destructive",
        },
        {
          text: `No`,
        },
      ],
      { cancelable: true }
    );

    const cancelar = async () => {
      setLoading(true);
      const url = `/api/v1/${
        flujo === "Inversión"
          ? "investments"
          : flujo === "Crédito"
          ? "credits"
          : "box_savings"
      }/${idInversion}/cancel`;
      const data = "";

      const response = await APIPost(url, data);
      if (response.error) {
        // Manejar el error
        setLoading(false);
        console.error(
          "Error al eliminar la caja de ahorro o inversion:",
          response.error
        );
        Alert.alert(
          "Error",
          `No se pudo eliminar la ${flujo}. Intente nuevamente.`
        );
      } else {
        setLoading(false);
        console.log(
          "Caja de ahorro o Inversión eliminada exitosamente:",
          response
        );
        navigation.navigate("Inicio");
        resetFinance();
      }
    };
  };

  // Efecto para deshabilitar el botón si algún campo está vacío, maneja todos los casos posibles
  useEffect(() => {
    let camposLlenos = false;
    // Checar si el flujo es "Crédito" para manejar el aceptar SIC
    if (flujo === "Crédito") {
      if (finance.accounts.length > 0) {
        camposLlenos =
          (finance.CURP &&
            finance.situacionFiscal &&
            finance.comprobanteDomicilio &&
            finance.identificacion &&
            finance.actuoComo &&
            finance.accountID &&
            finance.aceptarSIC) ||
          (finance.isThereIdentificacion &&
            finance.isThereCURP &&
            finance.isThereSituacionFiscal &&
            finance.isThereComprobanteDomicilio &&
            finance.actuoComo &&
            finance.accountID &&
            finance.aceptarSIC);
      } else {
        camposLlenos =
          (finance.CURP &&
            finance.situacionFiscal &&
            finance.comprobanteDomicilio &&
            finance.identificacion &&
            finance.actuoComo &&
            addAccount &&
            finance.aceptarSIC) ||
          (finance.isThereIdentificacion &&
            finance.isThereCURP &&
            finance.isThereSituacionFiscal &&
            finance.isThereComprobanteDomicilio &&
            finance.actuoComo &&
            addAccount &&
            finance.aceptarSIC);
      }
    } else {
      if (finance.accounts.length > 0) {
        camposLlenos =
          (finance.CURP &&
            finance.situacionFiscal &&
            finance.comprobanteDomicilio &&
            finance.identificacion &&
            finance.actuoComo &&
            finance.accountID) ||
          (finance.isThereIdentificacion &&
            finance.isThereCURP &&
            finance.isThereSituacionFiscal &&
            finance.isThereComprobanteDomicilio &&
            finance.actuoComo &&
            finance.accountID);
      } else {
        camposLlenos =
          (finance.CURP &&
            finance.situacionFiscal &&
            finance.comprobanteDomicilio &&
            finance.identificacion &&
            finance.actuoComo &&
            addAccount) ||
          (finance.isThereIdentificacion &&
            finance.isThereCURP &&
            finance.isThereSituacionFiscal &&
            finance.isThereComprobanteDomicilio &&
            finance.actuoComo &&
            addAccount);
      }
    }
    setDisabled(!camposLlenos);
  }, [
    finance.CURP,
    finance.situacionFiscal,
    finance.comprobanteDomicilio,
    finance.identificacion,
    finance.actuoComo,
    finance.accountID,
    finance.isThereIdentificacion,
    finance.isThereCURP,
    finance.isThereSituacionFiscal,
    finance.isThereComprobanteDomicilio,
    finance.aceptarSIC,
  ]);

  const disabledAgregar =
    (finance.accounts.length > 0 &&
      !addAccount &&
      finance.isThereCURP &&
      finance.isThereComprobanteDomicilio &&
      finance.isThereIdentificacion &&
      finance.isThereSituacionFiscal &&
      finance.actuoComo &&
      (finance.aceptarSIC || flujo !== "Crédito")) ||
    (finance.accounts.length > 0 &&
      !addAccount &&
      finance.CURP &&
      finance.comprobanteDomicilio &&
      finance.identificacion &&
      finance.situacionFiscal &&
      finance.actuoComo &&
      (finance.aceptarSIC || flujo !== "Crédito"));

  // Función para obtener la existencia de documentos de la inversión o caja de ahorro
  const fetchDocuments = async () => {
    const url = `/api/v1/${
      flujo === "Inversión"
        ? "investments"
        : flujo === "Crédito"
        ? "credits"
        : "box_savings"
    }/${idInversion}`;

    try {
      const result = await APIGet(url);
      if (result.error) {
        console.error(
          "Error al obtener la inversion o caja de ahorro:",
          result.error
        );
        setDocumentsLoaded(false);
      } else {
        console.log(
          "Resultado de documentos",
          result.data.data.attached_documents_user
        );
        const docs = result.data.data.attached_documents_user;

        // Assuming the order of documents is always the same
        const allDocsPresent =
          docs.length === 4 && docs.every((doc) => doc.attached);

        setDocumentsLoaded(allDocsPresent);
        console.log("Documentos cargados?:", allDocsPresent);

        setFinance((prevState) => ({
          ...prevState,
          documents: docs,
        }));
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
      setDocumentsLoaded(false);
    }
  };

  // Function to update document statuses based on their order
  const updateDocumentStatuses = (documents) => {
    resetTimeout();
    const statusKeys = [
      "isThereIdentificacion",
      "isThereCURP",
      "isThereSituacionFiscal",
      "isThereComprobanteDomicilio",
    ];

    const updatedStatus = documents.reduce((acc, doc, index) => {
      // Ensure that the index has a corresponding status key to prevent errors
      if (index < statusKeys.length) {
        acc[statusKeys[index]] = doc.attached;
      }
      return acc;
    }, {});

    // Update the context state with the new statuses
    setFinance((prevState) => ({
      ...prevState,
      ...updatedStatus,
    }));
  };

  // useEffect to handle document status updates
  useEffect(() => {
    if (finance.documents) {
      updateDocumentStatuses(finance.documents);
    }
  }, [finance.documents]);

  // Función para obtener las cuentas bancarias del usuario
  const fetchAccounts = async () => {
    const url = `/api/v1/users/bank_accounts`;

    const result = await APIGet(url);

    if (result.error) {
      console.error(
        "Error al obtener las cuentas de banco del usuario:",
        result.error
      );
      setAddAccount(true);
    } else {
      if (result.data.data.length === 0) {
        setAddAccount(true);
      } else {
        console.log(
          "Resultado de las cuentas de banco del usuario:",
          result.data.data
        );
        setAddAccount(false);
        setFinance((prevState) => ({
          ...prevState,
          accounts: result.data.data || [], // Ensure fallback to empty array if data is undefined
        }));
      }
    }
  };

  useEffect(() => {
    setInitial(-1);
    setFinance({ ...finance, accountID: "" });
  }, [addAccount]);

  // Efecto para obtener los documentos de la inversión o caja de ahorro, y las cuentas bancarias del usuario se ejecuta al cargar la pantalla
  useFocusEffect(
    useCallback(() => {
      fetchDocuments();
      fetchAccounts();
    }, [])
  );

  // Función para agregar una cuenta bancaria
  const handleAgregar = () => {
    resetTimeout();
    console.log(finance.CURP);
    if (!disabledAgregar) {
      Alert.alert(
        "Campos Faltantes",
        "Por favor, completa la información solicitada para poder agregar una cuenta bancaria nueva."
      );
    } else {
      setFinance({ ...finance, accountID: "", alias: "" });
      navigation.navigate("DatosBancarios", {
        flujo: flujo,
        idInversion: idInversion,
        sendDocuments: sendDocuments.bind(this),
        addAccount: addAccount, // Variable manages if the user has to add a new bank account or not
      });
    }
  };

  // Función para mostrar las opciones de subida de documentos
  const showUploadOptions = (setType) => {
    resetTimeout();
    Alert.alert(
      "Seleccionar Documento",
      "Elige de donde deseas subir tu documento:",
      [
        {
          text: "Cancelar",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Galería de Fotos",
          onPress: () => pickImage(setType),
        },
        {
          text: "Documentos",
          onPress: () => pickDocument(setType),
        },
      ],
      { cancelable: true }
    );
  };

  // Función para seleccionar un documento
  const pickDocument = async (setType) => {
    resetTimeout();
    let result = await DocumentPicker.getDocumentAsync({});
    if (!result.canceled && result.assets) {
      const selectedDocument = result.assets[0];

      // Get the file extension
      const extension = selectedDocument.name.split(".").pop().toLowerCase();

      if (!ALLOWED_EXTENSIONS.includes(extension)) {
        Alert.alert(
          "Error",
          "Formato de archivo no permitido. Solo se permiten PDF, JPG, JPEG, PNG o BMP."
        );
        return;
      }

      if (selectedDocument.size > MAX_FILE_SIZE_BYTES) {
        Alert.alert("Error", "El documento excede el tamaño máximo de 10MB.");
        return;
      }

      console.log("Documento seleccionado:", selectedDocument);

      if (setType === "fiscal") {
        setFinance({
          ...finance,
          situacionFiscal: selectedDocument.uri,
          nombreSituacionFiscal: selectedDocument.name,
        });
      } else if (setType === "domicilio") {
        setFinance({
          ...finance,
          comprobanteDomicilio: selectedDocument.uri,
          nombreComprobanteDomicilio: selectedDocument.name,
        });
      } else if (setType === "identificacion") {
        setFinance({
          ...finance,
          identificacion: selectedDocument.uri,
          nombreIdentificacion: selectedDocument.name,
        });
      } else if (setType === "curp") {
        setFinance({
          ...finance,
          CURP: selectedDocument.uri,
          nombreCURP: selectedDocument.name,
        });
      }
    } else {
      console.log("Operación cancelada o no se seleccionó ningún documento");
    }
  };

  // Función para seleccionar una imagen
  const pickImage = async (setType) => {
    resetTimeout();
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.2,
    });

    if (!result.canceled) {
      const selectedImage = result.assets[0];

      // Get the file extension
      const extension = selectedImage.uri.split(".").pop().toLowerCase();

      if (!ALLOWED_EXTENSIONS.includes(extension)) {
        Alert.alert(
          "Error",
          "Formato de archivo no permitido. Solo se permiten PDF, JPG, JPEG, PNG o BMP."
        );
        return;
      }

      if (selectedImage.fileSize > MAX_FILE_SIZE_BYTES) {
        Alert.alert("Error", "La imagen excede el tamaño máximo de 10MB.");
        return;
      }

      console.log("Imagen seleccionada:", selectedImage);

      if (setType === "fiscal") {
        setFinance({
          ...finance,
          situacionFiscal: selectedImage.uri,
          nombreSituacionFiscal: "Constancia Seleccionada",
        });
      } else if (setType === "domicilio") {
        setFinance({
          ...finance,
          comprobanteDomicilio: selectedImage.uri,
          nombreComprobanteDomicilio: "Comprobante Seleccionado",
        });
      } else if (setType === "identificacion") {
        setFinance({
          ...finance,
          identificacion: selectedImage.uri,
          nombreIdentificacion: "Identificación Seleccionada",
        });
      } else if (setType === "curp") {
        setFinance({
          ...finance,
          CURP: selectedImage.uri,
          nombreCURP: "CURP Seleccionado",
        });
      }
    } else {
      console.log("Operación cancelada o no se seleccionó ninguna imagen");
    }
  };

  const [dataAceptar] = useState([
    {
      label: `Si acepto${finance.focus === "network" ? "(*)" : ""}`,
      value: "true",
    },
  ]);

  // Datos para el radio button
  const [dataActuo] = useState([
    {
      label: "Actúo a nombre y por cuenta propia.",
      value: "Actúo a nombre y por cuenta propia.",
    },
    {
      label: `Actúo a nombre y por cuenta de un tercero${
        finance.focus === "network" ? "(**)" : "(*)"
      }.`,
      value: "Actúo a nombre y por cuenta de un tercero.",
    },
  ]);

  // Componente Visual
  return (
    <View style={{ flex: 1 }}>
      {/* Titulo, Nombre de Pantalla y Campana */}
      <View style={styles.tituloContainer}>
        {/* <MaskedView
          style={{ flex: 0.6 }}
          maskElement={<Text style={styles.titulo}>tankef</Text>}
        >
          <LinearGradient
            colors={["#2FF690", "#21B6D5"]}
            start={{ x: 1, y: 1 }}
            end={{ x: 0, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </MaskedView> */}
        <Text
          style={[
            styles.tituloPantalla,
            {
              fontSize: flujo === "Caja de ahorro" ? 20 : 24,
              // marginRight:
              //   flujo === "Caja de ahorro"
              //     ? 55
              //     : flujo === "Crédito"
              //     ? -20
              //     : 10, // Descomentar si se regresa el titulo
            },
          ]}
        >
          {flujo}
        </Text>
      </View>

      <View style={{ flex: 1 }}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          onScroll={() => resetTimeout()}
          scrollEventThrottle={400}
        >
          <View style={{ flex: 1 }}>
            <View style={styles.seccion}>
              <Text style={styles.tituloSeccion}>Documentación</Text>
              <Text style={styles.bodySeccion}>
                Proporciona la documentación solicitadada en cualquiera de los
                siguientes formatos para continuar: {"\n"}PDF, JPG, JPEG, PNG,
                BMP.
              </Text>
            </View>
            <View
              style={{
                marginTop: 3,
                backgroundColor: "white",
              }}
            >
              <Text style={styles.tituloCampo}>Identificación vigente</Text>
              {!finance.isThereIdentificacion ? (
                !finance.identificacion ? (
                  <TouchableOpacity
                    style={{ flexDirection: "row" }}
                    onPress={() => showUploadOptions("identificacion")}
                  >
                    <Text style={styles.input}>Selecciona documento</Text>
                    <Feather name="upload" size={20} color="#060B4D" />
                  </TouchableOpacity>
                ) : (
                  <>
                    <View
                      style={{
                        flexDirection: "row",
                        paddingBottom: 7.5,
                      }}
                    >
                      <FontAwesome
                        name="image"
                        size={20}
                        color="#060B4D"
                        style={{ marginLeft: 15 }}
                      />
                      <Text
                        style={{
                          flex: 1,
                          paddingHorizontal: 15,
                          fontSize: 16,
                          color: "#060B4D",
                          fontFamily: "opensans",
                        }}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {finance.nombreIdentificacion}
                      </Text>
                      <TouchableOpacity
                        onPress={() => [
                          setFinance({
                            ...finance,
                            identificacion: "",
                            nombreIdentificacion: "",
                          }),
                          resetTimeout(),
                        ]}
                      >
                        <FontAwesome
                          name="trash-o"
                          size={25}
                          color="#F95C5C"
                          style={{ marginRight: 15 }}
                        />
                      </TouchableOpacity>
                    </View>
                  </>
                )
              ) : (
                <>
                  <View
                    style={{
                      flexDirection: "row",
                      paddingBottom: 7.5,
                    }}
                  >
                    <Text style={styles.textoAprobado}>Aprobado</Text>
                    <AntDesign
                      name="checkcircleo"
                      size={25}
                      color="#30cc18"
                      style={{ marginRight: 15 }}
                    />
                  </View>
                </>
              )}
              <View style={styles.separacion} />

              <Text style={styles.tituloCampo}>CURP</Text>
              {!finance.isThereCURP ? (
                !finance.CURP ? (
                  <TouchableOpacity
                    style={{ flexDirection: "row" }}
                    onPress={() => showUploadOptions("curp")}
                  >
                    <Text style={styles.input}>Selecciona documento</Text>
                    <Feather name="upload" size={20} color="#060B4D" />
                  </TouchableOpacity>
                ) : (
                  <>
                    <View
                      style={{
                        flexDirection: "row",
                        paddingBottom: 7.5,
                      }}
                    >
                      <FontAwesome
                        name="image"
                        size={20}
                        color="#060B4D"
                        style={{ marginLeft: 15 }}
                      />
                      <Text
                        style={{
                          flex: 1,
                          paddingHorizontal: 15,
                          fontSize: 16,
                          color: "#060B4D",
                          fontFamily: "opensans",
                        }}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {finance.nombreCURP}
                      </Text>
                      <TouchableOpacity
                        onPress={() => [
                          setFinance({ ...finance, CURP: "", nombreCURP: "" }),
                          resetTimeout(),
                        ]}
                      >
                        <FontAwesome
                          name="trash-o"
                          size={25}
                          color="#F95C5C"
                          style={{ marginRight: 15 }}
                        />
                      </TouchableOpacity>
                    </View>
                  </>
                )
              ) : (
                <>
                  <View
                    style={{
                      flexDirection: "row",
                      paddingBottom: 7.5,
                    }}
                  >
                    <Text style={styles.textoAprobado}>Aprobado</Text>

                    <AntDesign
                      name="checkcircleo"
                      size={25}
                      color="#30cc18"
                      style={{ marginRight: 15 }}
                    />
                  </View>
                </>
              )}
              <View style={styles.separacion} />

              <Text style={styles.tituloCampo}>
                Constancia de Situación Fiscal (SAT)
              </Text>
              {!finance.isThereSituacionFiscal ? (
                !finance.situacionFiscal ? (
                  <TouchableOpacity
                    style={{ flexDirection: "row" }}
                    onPress={() => showUploadOptions("fiscal")}
                  >
                    <Text style={styles.input}>Selecciona documento</Text>
                    <Feather name="upload" size={20} color="#060B4D" />
                  </TouchableOpacity>
                ) : (
                  <>
                    <View
                      style={{
                        flexDirection: "row",
                        paddingBottom: 7.5,
                      }}
                    >
                      <FontAwesome
                        name="image"
                        size={20}
                        color="#060B4D"
                        style={{ marginLeft: 15 }}
                      />
                      <Text
                        style={{
                          flex: 1,
                          paddingHorizontal: 15,
                          fontSize: 16,
                          color: "#060B4D",
                          fontFamily: "opensans",
                        }}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {finance.nombreSituacionFiscal}
                      </Text>
                      <TouchableOpacity
                        onPress={() => [
                          setFinance({
                            ...finance,
                            situacionFiscal: "",
                            nombreSituacionFiscal: "",
                          }),
                          resetTimeout(),
                        ]}
                      >
                        <FontAwesome
                          name="trash-o"
                          size={25}
                          color="#F95C5C"
                          style={{ marginRight: 15 }}
                        />
                      </TouchableOpacity>
                    </View>
                  </>
                )
              ) : (
                <>
                  <View
                    style={{
                      flexDirection: "row",
                      paddingBottom: 7.5,
                    }}
                  >
                    <Text style={styles.textoAprobado}>Aprobado</Text>

                    <AntDesign
                      name="checkcircleo"
                      size={25}
                      color="#30cc18"
                      style={{ marginRight: 15 }}
                    />
                  </View>
                </>
              )}
              <View style={styles.separacion} />

              <Text style={styles.tituloCampo}>
                Comprobante de domicilio (no más de tres meses)
              </Text>
              {!finance.isThereComprobanteDomicilio ? (
                !finance.comprobanteDomicilio ? (
                  <TouchableOpacity
                    style={{ flexDirection: "row" }}
                    onPress={() => showUploadOptions("domicilio")}
                  >
                    <Text style={styles.input}>Selecciona documento</Text>
                    <Feather name="upload" size={20} color="#060B4D" />
                  </TouchableOpacity>
                ) : (
                  <>
                    <View
                      style={{
                        flexDirection: "row",
                        paddingBottom: 7.5,
                      }}
                    >
                      <FontAwesome
                        name="image"
                        size={20}
                        color="#060B4D"
                        style={{ marginLeft: 15 }}
                      />
                      <Text
                        style={{
                          flex: 1,
                          paddingHorizontal: 15,
                          fontSize: 16,
                          color: "#060B4D",
                          fontFamily: "opensans",
                        }}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {finance.nombreComprobanteDomicilio}
                      </Text>
                      <TouchableOpacity
                        onPress={() => [
                          setFinance({
                            ...finance,
                            comprobanteDomicilio: "",
                            nombreComprobanteDomicilio: "",
                          }),
                          resetTimeout(),
                        ]}
                      >
                        <FontAwesome
                          name="trash-o"
                          size={25}
                          color="#F95C5C"
                          style={{ marginRight: 15 }}
                        />
                      </TouchableOpacity>
                    </View>
                  </>
                )
              ) : (
                <>
                  <View
                    style={{
                      flexDirection: "row",
                      paddingBottom: 7.5,
                    }}
                  >
                    <Text style={styles.textoAprobado}>Aprobado</Text>

                    <AntDesign
                      name="checkcircleo"
                      size={25}
                      color="#30cc18"
                      style={{ marginRight: 15 }}
                    />
                  </View>
                </>
              )}
              <View style={styles.separacion} />
              {!addAccount && (
                <>
                  <Text style={styles.tituloCampo}>
                    Elige una cuenta bancaria
                  </Text>
                  <RadioForm
                    radio_props={finance.accounts.map((account) => ({
                      label: account.short_name,
                      value: account.id,
                    }))}
                    initial={initial}
                    onPress={(value) => {
                      const selectedAccount = finance.accounts.find(
                        (account) => account.id === value
                      );
                      setFinance({
                        ...finance,
                        accountID: value,
                        alias: selectedAccount.short_name,
                      });
                      resetTimeout();
                      console.log(
                        "Selected:",
                        value,
                        selectedAccount.short_name
                      );
                    }}
                    buttonColor={"#060B4D"}
                    buttonSize={10}
                    selectedButtonColor={"#060B4D"}
                    labelStyle={[styles.input, { color: "#060B4D" }]}
                    animation={false}
                    style={{
                      alignSelf: "baseline",
                      marginTop: 10,
                      marginLeft: 15,
                    }}
                  />
                  <View style={styles.separacion} />
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      paddingVertical: 10,
                    }}
                    onPress={() => handleAgregar()}
                  >
                    <MaterialIcons
                      name="add-circle"
                      size={25}
                      color="#060B4D"
                    />
                    <Text
                      style={{
                        fontSize: 16,
                        color: "#060B4D",
                        fontFamily: "opensanssemibold",
                        paddingLeft: 10,
                      }}
                    >
                      Agregar cuenta bancaria
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
            <View style={styles.contenedores}>
              {flujo === "Crédito" && (
                <>
                  <Text style={styles.subTexto}>
                    Acepto se me investigue en la Sociedad de Información
                    Crediticia (SIC)
                  </Text>
                  <RadioForm
                    key={finance.aceptarSIC}
                    radio_props={dataAceptar}
                    initial={-1}
                    onPress={(value) => [
                      setFinance({
                        ...finance,
                        aceptarSIC: value,
                      }),
                      resetTimeout(),
                    ]}
                    buttonColor={"#060B4D"}
                    buttonSize={10}
                    selectedButtonColor={"#060B4D"}
                    labelStyle={{
                      fontSize: 15,
                      color: "#060B4D",
                      fontFamily: "opensanssemibold",
                    }}
                    animation={false}
                    style={{ alignSelf: "baseline", marginTop: 10 }}
                  />
                  <View style={[styles.separacion, { marginVertical: 10 }]} />
                </>
              )}
              <Text style={styles.subTexto}>
                Declaro que soy el propietario real de los recursos y/o
                beneficiario de la inversión, por lo que el origen procedencia
                de los recursos que Tu Kapital en Evolución, SAPI de CV, SOFOM,
                ENR, recibirá respecto de los servicios que le solicite proceden
                de fuentes lícitas y son de mi propiedad.
              </Text>
              <RadioForm
                radio_props={dataActuo}
                initial={-1}
                onPress={(value) =>
                  setFinance({ ...finance, actuoComo: value })
                }
                buttonColor={"#060B4D"}
                buttonSize={10}
                selectedButtonColor={"#060B4D"}
                labelStyle={{
                  fontSize: 15,
                  color: "#060B4D",
                  fontFamily: "opensanssemibold",
                  marginBottom: 10,
                }}
                animation={false}
                style={{ alignSelf: "baseline", marginTop: 20 }}
              />
              {finance.focus === "network" && (
                <Text
                  style={[styles.subTexto, { fontSize: 12, marginTop: 10 }]}
                >
                  (*) Unicamente se llevará acabo si se decide realizar el
                  crédito por comité
                </Text>
              )}
              <Text style={[styles.subTexto, { fontSize: 12, marginTop: 10 }]}>
                {finance.focus === "network" ? "(**)" : "(*)"} En caso de actuar
                a nombre de un tercero, es necesario la siguiente información:
                Identificación oficial vigente, datos generales y comprobante de
                domicilio recientes.
              </Text>
            </View>
          </View>
          {/* Boton de Aceptar */}
          <TouchableOpacity
            style={[
              styles.botonContinuar,
              {
                backgroundColor: disabled ? "#D5D5D5" : "#060B4D",
                marginBottom: 0,
              },
            ]}
            onPress={() => handleSubmit()}
            disabled={disabled}
          >
            <Text
              style={[
                styles.textoBotonContinuar,
                { color: disabled ? "grey" : "white" },
              ]}
            >
              Aceptar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.botonContinuar,
              {
                backgroundColor: "white",
                marginBottom: 30,
              },
            ]}
            onPress={() => {
              handleCancelar();
            }}
          >
            <Text style={[styles.textoBotonContinuar, { color: "#F95C5C" }]}>
              Cancelar {flujo}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/*<Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Image
              style={{ width: 150, height: 150, marginBottom: 10 }}
              source={require("../../../assets/images/Validacion.png")}
            />
            <Text style={styles.modalText}>Validación</Text>
            <Text style={styles.modalTextBody}>
              Estamos validando tu información. {"\n"}Te notificaremos pronto.
            </Text>
            <TouchableOpacity
              style={[
                styles.botonContinuar,
                { marginBottom: 0, width: "100%" },
              ]}
              onPress={() => [
                setModalVisible(false),
                navigation.navigate("MiTankef"),
              ]}
            >
              <Text style={[styles.textoBotonContinuar, { color: "white" }]}>
                Aceptar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>*/}
      {loading && (
        <View style={styles.overlay}>
          <ActivityIndicator size={75} color="#060B4D" />
        </View>
      )}
      <ModalEstatus
        titulo={"¡Atención!"}
        texto={
          "Tu documentación ha sido recibida, estamos en proceso de validación, te notificaremos para proceder con el siguiente paso.\n¡Gracias por tu paciencia!"
        }
        imagen={"Alert"}
        visible={modalVisible}
        onAccept={() => [
          setModalVisible(false),
          resetFinance(),
          navigation.navigate("MiTankef"),
        ]}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};

// Estilos de la pantalla
const styles = StyleSheet.create({
  tituloContainer: {
    paddingHorizontal: 20,
    flexDirection: "row",
    backgroundColor: "white",
    paddingBottom: 10,
  },
  titulo: {
    fontFamily: "montserrat",
    letterSpacing: -4,
    fontSize: 35,
    marginTop: 40,
  },
  tituloPantalla: {
    flex: 1,
    marginTop: 47,
    fontSize: 24,
    textAlign: "center", // Ajuste para centrar el título, eliminar si se regresa el titulo
    color: "#060B4D",
    fontFamily: "opensanssemibold",
    fontWeight: "bold",
  },
  seccion: {
    marginTop: 3,
    backgroundColor: "white",
    alignItems: "center",
    padding: 15,
  },
  tituloSeccion: {
    fontSize: 25,
    color: "#060B4D",
    fontFamily: "opensanssemibold",
  },
  bodySeccion: {
    marginTop: 10,
    marginBottom: 10,
    fontSize: 14,
    color: "#060B4D",
    fontFamily: "opensanssemibold",
    textAlign: "center",
  },
  tituloCampo: {
    marginTop: 10,
    paddingLeft: 15,
    marginBottom: 10,
    fontSize: 14,
    color: "#060B4D",
    fontFamily: "opensanssemibold",
  },
  contenedores: {
    backgroundColor: "white",
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: "center",
    marginTop: 3,
  },
  texto: {
    color: "#060B4D",
    textAlign: "center",
    fontFamily: "opensans",
    fontSize: 16,
  },
  subTexto: {
    color: "#060B4D",
    fontFamily: "opensanssemibold",
    alignSelf: "baseline",
    fontSize: 12,
    paddingHorizontal: 15,
  },
  input: {
    paddingLeft: 15,
    fontSize: 16,
    marginBottom: 10,
    fontFamily: "opensanssemibold",
    width: "92%",
    color: "#c7c7c9ff",
  },
  textoAprobado: {
    flex: 1,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#30cc18",
    fontFamily: "opensansbold",
  },
  separacion: {
    height: 1,
    width: "100%",
    backgroundColor: "#cecfdbff",
  },
  botonContinuar: {
    marginTop: 15,
    marginBottom: 20,
    backgroundColor: "#060B4D",
    width: "80%",
    alignSelf: "center",
    borderRadius: 5,
  },
  textoBotonContinuar: {
    color: "white",
    alignSelf: "center",
    padding: 10,
    fontFamily: "opensanssemibold",
    fontSize: 16,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)", // Fondo semitransparente
  },
  modalView: {
    width: "80%", // Asegúrate de que el contenedor del modal tenga un ancho definido.
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
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
  modalText: {
    fontSize: 30,
    color: "#060B4D",
    fontFamily: "opensanssemibold",
    textAlign: "center",
  },
  modalTextBody: {
    marginTop: 5,
    marginBottom: 5,
    fontSize: 14,
    color: "#060B4D",
    fontFamily: "opensans",
    textAlign: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Documentacion;
