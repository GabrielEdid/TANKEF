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
import { FinanceContext } from "../../hooks/FinanceContext";
import {
  Feather,
  FontAwesome,
  AntDesign,
  MaterialIcons,
} from "@expo/vector-icons";
import { APIPut, APIGet, APIPost } from "../../API/APIService";
import { add } from "date-fns";

// Se mide la pantalla para determinar medidas
const screenWidth = Dimensions.get("window").width;
const widthHalf = screenWidth / 2;

const Documentacion = ({ navigation }) => {
  const route = useRoute();
  const { flujo, idInversion } = route.params;
  // Estados y Contexto
  const { finance, setFinance, resetFinance } = useContext(FinanceContext);
  //const [modalVisible, setModalVisible] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [documentsLoaded, setDocumentsLoaded] = useState(false);
  const [addAccount, setAddAccount] = useState(false);
  const [initial, setInitial] = useState(-1);

  // Función para subir la documentación

  const handlePress = async () => {
    if (addAccount) {
      navigation.navigate("DatosBancarios", {
        flujo: flujo,
        idInversion: idInversion,
        sendDocuments: sendDocuments.bind(this),
      });
      console.log(
        finance.identificacion,
        finance.CURP,
        finance.situacionFiscal,
        finance.comprobanteDomicilio,
        finance.actuoComo
      );
    } else {
      sendDocuments();
    }
  };

  const sendDocuments = async () => {
    setDisabled(true);
    setLoading(true);
    console.log("Agregando los documentos a la inversión o caja de ahorro...");
    console.log("Documentos cargados?:", documentsLoaded);

    const key = flujo === "Inversión" ? "investment" : "box_saving";

    // Ahora si se mandan los documentos
    const url = `/api/v1/${
      flujo === "Inversión" ? "investments" : "box_savings"
    }/${idInversion}`;

    try {
      let body;

      if (documentsLoaded) {
        console.log("Documentos ya cargados, enviando JSON...");
        // Sending JSON data
        body = {
          [key]: {
            accept_documentation_1:
              finance.actuoComo === "Actúo a nombre y por cuenta propia.",
            accept_documentation_2:
              finance.actuoComo ===
              "Actúo a nombre y por cuenta de un tercero.",
          },
        };
      } else {
        console.log("Documentos no cargados, enviando FormData...");
        // Sending FormData
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

        body = formData;
      }

      const response = await APIPut(url, body);

      if (response.error) {
        console.error("Error al agregar los documentos:", response.error);
        Alert.alert(
          "Error",
          "No se pudieron agregar los documentos. Intente nuevamente."
        );
      } else {
        console.log("Documentos agregados exitosamente:", response);
      }
    } catch (error) {
      console.error("Error en la petición:", error);
      Alert.alert("Error", "Ocurrió un error al procesar la solicitud.");
    } finally {
      setLoading(false);
    }

    if (finance.accountID) {
      setLoading(true);
      const url = `/api/v1/${
        flujo === "Inversión" ? "investments" : "box_savings"
      }/${idInversion}/bank_accounts`;

      const data = {
        [key]: {
          bank_account_id: finance.accountID,
        },
      };

      try {
        console.log("Datos de cuenta bancaria a enviar:", data);
        const response = await APIPost(url, data);

        if (response.error) {
          setLoading(false);
          console.error("Error al guardar la cuenta bancaria:", response.error);
          Alert.alert(
            "Error",
            "No se pudieron guardar los datos de la cuenta bancaria. Intente nuevamente."
          );
        } else {
          setModalVisible(true);
          setLoading(false);
          console.log("Datos de cuenta bancaria guardados con éxito");
        }
      } catch (error) {
        setLoading(false);
        console.error("Error al enviar datos (documentacion):", error);
        Alert.alert(
          "Error",
          "Hubo un problema al enviar los datos. Por favor, intenta de nuevo."
        );
      }
    }
  };

  // Funcion para manejar el boton de cancelar
  const handleCancelar = () => {
    Alert.alert(
      `¿Deseas cancelar la ${flujo}`,
      `Si cancelas la ${flujo}, perderás la información ingresada hasta el momento.`,
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
        flujo === "Inversión" ? "investments" : "box_savings"
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

  // Efecto para deshabilitar el botón si algún campo está vacío
  useEffect(() => {
    let camposLlenos = false;
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
    setDisabled(!camposLlenos);
  }, [
    finance.CURP,
    finance.situacionFiscal,
    finance.comprobanteDomicilio,
    finance.identificacion,
    finance.actuoComo,
    finance.isThereIdentificacion,
    finance.isThereCURP,
    finance.isThereSituacionFiscal,
    finance.isThereComprobanteDomicilio,
  ]);

  // Función para obtener la existencia de documentos de la inversión o caja de ahorro
  const fetchDocuments = async () => {
    const url = `/api/v1/${
      flujo === "Inversión" ? "investments" : "box_savings"
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
    if (disabled) {
      Alert.alert(
        "Campos Faltantes",
        "Por favor, completa la información solicitada para poder agregar una cuenta bancaria nueva."
      );
    } else {
      setFinance({ ...finance, accountID: "" });
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
    let result = await DocumentPicker.getDocumentAsync({});
    if (!result.canceled && result.assets) {
      const selectedDocument = result.assets[0];
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
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.2,
    });

    if (!result.canceled) {
      const selectedImage = result.assets[0];
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

  // Datos para el radio button
  const [dataActuo] = useState([
    {
      label: "Actúo a nombre y por cuenta propia.",
      value: "Actúo a nombre y por cuenta propia.",
    },
    {
      label: "Actúo a nombre y por cuenta de un tercero(*).",
      value: "Actúo a nombre y por cuenta de un tercero.",
    },
  ]);

  // Componente Visual
  return (
    <View style={{ flex: 1 }}>
      {/* Titulo, Nombre de Pantalla y Campana */}
      <View style={styles.tituloContainer}>
        <MaskedView
          style={{ flex: 0.6 }}
          maskElement={<Text style={styles.titulo}>tankef</Text>}
        >
          <LinearGradient
            colors={["#2FF690", "#21B6D5"]}
            start={{ x: 1, y: 1 }}
            end={{ x: 0, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </MaskedView>
        <Text
          style={[
            styles.tituloPantalla,
            {
              fontSize: flujo === "Caja de ahorro" ? 20 : 24,
              marginRight: flujo === "Caja de ahorro" ? 35 : 0,
            },
          ]}
        >
          {flujo}
        </Text>
        <TouchableOpacity>
          <Feather
            name="bell"
            size={25}
            color="#060B4D"
            style={{ marginTop: 50 }}
          />
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1 }}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
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
                marginTop: 5,
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
                    onPress={(value) => [
                      setFinance({ ...finance, accountID: value }),
                      console.log(value),
                    ]}
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
                  fontSize: 16,
                  color: "#060B4D",
                  fontFamily: "opensanssemibold",
                  marginBottom: 10,
                }}
                animation={false}
                style={{ alignSelf: "baseline", marginTop: 20 }}
              />
              <Text style={[styles.subTexto, { fontSize: 12, marginTop: 10 }]}>
                (*) En caso de actuar a nombre de un tercero, es necesario la
                siguiente información: Identificación oficila vigente, datos
                generales y comprobante de domicilio recientes.
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
            onPress={() => handlePress()}
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
    color: "#060B4D",
    fontFamily: "opensanssemibold",
    fontWeight: "bold",
  },
  seccion: {
    marginTop: 5,
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
