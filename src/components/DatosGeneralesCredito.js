// Importaciones de React Native y React
import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
// Importaciones de Componentes y Contextos
import { FinanceContext } from "../hooks/FinanceContext";

/**
 * `Conexion` es un componente que muestra información de una conexión específica,
 * como una tarjeta interactuable. Ofrece la funcionalidad para navegar a una vista detallada
 * del perfil asociado y la opción de eliminar esta conexión con confirmación mediante un modal.
 *
 * Props:
 * - `userID`: Identificador único del usuario asociado a la conexión.
 * - `imagen`: Puede ser una URL de imagen o un recurso local para mostrar como avatar del usuario.
 * - `nombre`: Nombre del usuario a mostrar en la tarjeta de conexión.
 * - `mail`: Correo electrónico del usuario asociado a la conexión.
 *
 * Ejemplo de uso (o ver en MiRed.js):
 * <Conexion
 *   userID="123"
 *   imagen="https://ruta/a/imagen.jpg"
 *   nombre="John Doe"
 *   mail="johndoe@gmail.com"
 * />
 */

const DatosGeneralesCredito = () => {
  const navigation = useNavigation();
  // Contexto de crédito
  const { finance, setFinance } = useContext(FinanceContext);

  // Componente visual
  return (
    <>
      <View
        style={[
          styles.contenedores,
          {
            paddingHorizontal: 0,
            paddingVertical: 10,
            alignItems: "baseline",
          },
        ]}
      >
        <Text style={[styles.tituloCampo, { marginTop: 0 }]}>
          ¿Ha desempeñado algún cargo político?
        </Text>
        <Text style={styles.bodyCampo}>{finance.politico}</Text>
        <View style={styles.separacion} />

        <Text style={styles.tituloCampo}>Tipo de Domicilio</Text>
        <Text style={styles.bodyCampo}>{finance.domicilio}</Text>
        <View style={styles.separacion} />

        <Text style={styles.tituloCampo}>Teléfono Casa</Text>
        <Text style={styles.bodyCampo}>{finance.telCasa}</Text>
        <View style={styles.separacion} />

        <Text style={styles.tituloCampo}>Teléfono Trabajo</Text>
        <Text style={styles.bodyCampo}>{finance.telTrabajo}</Text>
        <View style={styles.separacion} />

        <Text style={styles.tituloCampo}>Celular</Text>
        <Text style={styles.bodyCampo}>{finance.celular}</Text>
        <View style={styles.separacion} />

        <Text style={styles.tituloCampo}>
          Cuenta bancaria a depositar fondos
        </Text>
        <Text style={styles.bodyCampo}>{finance.alias}</Text>
        <View style={styles.separacion} />

        <View style={styles.Description}>
          <Text
            style={[
              styles.bodyCampo,
              {
                padding: 10,
                marginBottom: 0,
                color: "#878787",
              },
            ]}
          >
            {finance.descripcion}
          </Text>
        </View>
        {/* {finance.paso === 3 && (
          <View
            style={{ alignSelf: "center", marginTop: 15, marginBottom: -5 }}
          >
            <TouchableOpacity
              style={{
                alignSelf: "center",
                flexDirection: "row",
                alignItems: "center",
              }}
              onPress={() => [
                setFinance({ ...finance, paso: 2 }),
                navigation.navigate("InfoGeneral", { flujo: "Crédito" }),
              ]}
            >
              <Image
                style={{ width: 23, height: 22, marginBottom: 10 }}
                source={require("../../assets/images/Sliders.png")}
              />
              <Text style={[styles.bodyCampo, { paddingLeft: 5 }]}>
                Editar información general
              </Text>
            </TouchableOpacity>
          </View>
        )} */}
      </View>
    </>
  );
};

// Estilos del componente
const styles = StyleSheet.create({
  contenedores: {
    backgroundColor: "white",
    marginTop: 3,
    paddingHorizontal: 0,
    paddingVertical: 10,
    alignItems: "baseline",
  },
  tituloCampo: {
    marginTop: 5,
    paddingLeft: 15,
    marginBottom: 5,
    fontSize: 14,
    color: "#060B4D",
    fontFamily: "opensanssemibold",
  },
  bodyCampo: {
    fontSize: 16,
    color: "#060B4D",
    fontFamily: "opensanssemibold",
    paddingLeft: 15,
    marginBottom: 10,
  },
  Description: {
    borderRadius: 10,
    borderColor: "#afb0c4ff",
    borderWidth: 1,
    backgroundColor: "#F7F7F7",
    flex: 1,
    width: "93%",
    color: "#060B4D",
    alignSelf: "center",
    marginTop: 10,
  },
  separacion: {
    height: 1,
    width: "100%",
    backgroundColor: "#cecfdbff",
  },
});

export default DatosGeneralesCredito;
