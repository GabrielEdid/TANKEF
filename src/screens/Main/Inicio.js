// Importaciones de React Native y React
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
// Importaciones de Hooks y Componentes
import CuadroRedUsuario from "../../components/CuadroRedUsuario";
import Post from "../../components/Post";

const Inicio = () => {
  // Mapa para cargar todas las imagenes
  const imageMap = {
    Natasha: require("../../../assets/images/Fotos_Personas/Natahsa.png"),
    Quill: require("../../../assets/images/Fotos_Personas/Quill.png"),
    Clint: require("../../../assets/images/Fotos_Personas/Clint.png"),
    Antonio: require("../../../assets/images/Fotos_Personas/Antonio.png"),
    Steve: require("../../../assets/images/Fotos_Personas/Steve.png"),
    Test: require("../../../assets/images/Test.png"),
    // ... más imágenes
  };

  // Componente visual
  return (
    <>
      <View style={styles.tituloContainer}>
        {/* Titulo */}
        <Text style={styles.titulo}>TANKEF</Text>
      </View>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <ScrollView style={styles.scrollV}>
          {/* Lista de Datos de Red del Usuario */}
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={styles.scrollH}
          >
            <CuadroRedUsuario titulo="Valor de Red" body="$253,500.00" />
            <CuadroRedUsuario titulo="Mi Crédito" body="$15,000.00" />
            <CuadroRedUsuario titulo="Mi Inversión" body="$15,000.00" />
            <CuadroRedUsuario titulo="Obligado Solidario" body="$7,500.00" />
          </ScrollView>
          {/* Anuncio para Invertir */}
          <TouchableOpacity style={styles.cuadroInvertir}>
            <Text style={styles.texto}>
              Transforma tu ahorro en inversión, con una{" "}
              <Text style={{ fontWeight: "bold" }}>
                Tasa Anual del 13.51% desde $5,000
              </Text>
            </Text>
            <LinearGradient
              colors={["#2FF690", "#21B6D5"]}
              start={{ x: 1, y: 1 }} // Inicio del gradiente
              end={{ x: 0, y: 0 }} // Fin del gradiente
              style={styles.botonGradient}
            >
              <Text
                style={{
                  fontFamily: "conthrax",
                  color: "white",
                  textAlign: "center",
                  fontSize: 17,
                }}
              >
                INVERTIR
              </Text>
            </LinearGradient>
          </TouchableOpacity>
          {/* Anuncio para hacer un Crédito */}
          <TouchableOpacity style={styles.cuadroCredito}>
            <Text style={[styles.texto, { color: "#29364d" }]}>
              ¿Necesitas un <Text style={{ fontWeight: "bold" }}>impulso</Text>{" "}
              para alcanzar tus{" "}
              <Text style={{ fontWeight: "bold" }}>sueños</Text>? ¡Da el primer
              paso hacía tus objetivos!
            </Text>
            <LinearGradient
              colors={["#2FF690", "#21B6D5"]}
              start={{ x: 1, y: 1 }} // Inicio del gradiente
              end={{ x: 0, y: 0 }} // Fin del gradiente
              style={styles.botonGradient}
            >
              <Text
                style={{
                  fontFamily: "conthrax",
                  color: "white",
                  textAlign: "center",
                  fontSize: 17,
                }}
              >
                CRÉDITO
              </Text>
            </LinearGradient>
          </TouchableOpacity>
          <Post
            tipo={"compartir"}
            nombre={"Antonio Stark Rivera"}
            tiempo={"3 horas"}
            foto={imageMap["Antonio"]}
            body={
              "Explorar el mundo de las finanzas es embarcarse en un viaje fascinante hacia la libertad financiera. La clave está en la educación continua y la toma de decisiones informadas. Invertir no solo se trata de aumentar tus activos, sino también de comprender los riesgos y cómo gestionarlos. Recuerda: diversificar es vital para equilibrar tu cartera. Y lo más importante, nunca es tarde para empezar a planificar tu futuro financiero. ¡Hagamos de las finanzas una herramienta para alcanzar nuestros sueños! #FinanzasInteligentes #LibertadFinanciera 💹📊"
            }
            imagen={imageMap["Test"]}
            perfil={imageMap["Steve"]}
          />
          <Post
            tipo={"credito"}
            nombre={"Natasha Ocasio Romanoff"}
            tiempo={"1 día"}
            foto={imageMap["Natasha"]}
            titulo={"¡Ayudame a pagar mi tarjeta de crédito!"}
            body={
              "Mi tarjeta corta el 27 y a mi me pagan quincena el 30. Necesito flujo para cerrar el mes y no deber."
            }
            perfil={imageMap["Steve"]}
            solicitado={"25,000.00"}
            contribuidos={"10,000.00"}
          />
          <Post
            tipo={"compartir"}
            nombre={"Jose Antonio Quill"}
            tiempo={"2 días"}
            foto={imageMap["Quill"]}
            body={
              "Invertir es dar el primer paso hacia la libertad financiera. Al elegir sabiamente, tus ahorros pueden crecer exponencialmente. ¿Sabías que empezar joven y con constancia es clave para el éxito? Diversifica tus inversiones para minimizar riesgos y maximizar ganancias. ¡No esperes más, comienza hoy mismo a construir tu futuro! #Inversiones #LibertadFinanciera #CrecimientoEconómico 📈💼🌟"
            }
            perfil={imageMap["Steve"]}
          />
          <Post
            tipo={"invertir"}
            nombre={"Jose Antonio Quill"}
            tiempo={"3 días"}
            foto={imageMap["Quill"]}
            body={"13.5%"}
            perfil={imageMap["Steve"]}
          />
          <Post
            tipo={"invertir"}
            nombre={"Natasha Ocasio Romanoff"}
            tiempo={"3 días"}
            foto={imageMap["Natasha"]}
            body={"13.5%"}
            perfil={imageMap["Steve"]}
          />
          <Post
            tipo={"credito"}
            nombre={"Antonio Stark Rivera"}
            tiempo={"4 día"}
            foto={imageMap["Antonio"]}
            titulo={"Quiero empezar mi empresa, ¡me falta un poco más!"}
            body={
              "Estoy muy cerca de empezar mi empresa, pero me falta un poco más para poder hacerlo. ¡Ayudame a cumplir mi sueño! Prometo pagar a todos lo antes posible y lograr consolidarme como se debe. ¡Gracias por su apoyo! Veran que no se arrepentiran."
            }
            perfil={imageMap["Steve"]}
            solicitado={"50,000.00"}
            contribuidos={"38,000.00"}
          />
        </ScrollView>
      </TouchableWithoutFeedback>
    </>
  );
};

// Estilos de la pantalla
const styles = StyleSheet.create({
  tituloContainer: {
    height: 105,
    backgroundColor: "white",
  },
  titulo: {
    fontFamily: "conthrax",
    fontSize: 27,
    color: "#29364d",
    marginTop: 70,
    marginLeft: 20,
    position: "absolute",
  },
  scrollV: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollH: {
    height: 110,
    width: 353,
    left: 20,
    paddingTop: 6,
    position: "absolute",
  },
  cuadroInvertir: {
    backgroundColor: "#29364d",
    alignContent: "center",
    height: 80,
    width: 353,
    top: 115,
    left: 20,
    borderRadius: 15,
  },
  cuadroCredito: {
    backgroundColor: "#F1F5F9",
    alignContent: "center",
    height: 80,
    width: 353,
    top: 125,
    left: 20,
    borderRadius: 15,
    borderColor: "#D5D5D5",
    borderWidth: 1.5,
    marginBottom: 140,
  },
  texto: {
    fontSize: 12,
    color: "white",
    alignContent: "center",
    top: 17.5,
    marginHorizontal: 20,
    width: 190,
  },
  botonGradient: {
    justifyContent: "center",
    width: 130,
    height: 38,
    borderRadius: 15,
    left: 210,
    bottom: 22.5,
  },
});

export default Inicio;
