// Importaciones de React Native y React
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React, {Component} from "react";
import MovimientoCredito from "../../components/MovimientoCredito";
import MovimientoInversion from "../../components/MovimientoInversion";
import { ScrollView } from "react-native-gesture-handler";


export default class Movimientos extends Component {
  constructor(props) {
    super(props)

    this.state = { isCreditos: false, isInversiones: true }
    
  }

  updateCounter() {
    this.setState({ counter: this.state.counter + 1 })
  }

  

  render() {
    return (

    <View style={styles.background}>
      {/* Titulo */}
      <View style={{height: 120}}>
        <Text style={styles.titulo}>TANKEF</Text>
      </View>
      <View style={{height:70, flexDirection: "row", justifyContent: "space-between"}}>
        <TouchableOpacity style={[styles.verInversiones, {backgroundColor: this.state.isInversiones ? "#29364d" : "transparent",}]} onPress={() => [this.setState({isCreditos: false}), this.setState({isInversiones: true})]}>
          <Text style={[styles.textoBoton, {color: !this.state.isInversiones ? "#29364d" : "white",}]}>Inversiones</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.verCreditos, {backgroundColor: this.state.isCreditos ? "#29364d" : "transparent",}]} onPress={() => [this.setState({isCreditos: true}), this.setState({isInversiones: false})]}>
          <Text style={[styles.textoBoton, {color: !this.state.isCreditos ? "#29364d" : "white",}]}>Creditos</Text>
        </TouchableOpacity>
      </View>

      {/* Seccion de los Creditos del Usuario */}
      { this.state.isCreditos && 
      <View style={{ flex: 1 }}>  
        <Image
          style={styles.imagenCredito}
          source={require("../../../assets/images/Credito.png")}
        />
        <Text style={styles.texto}>Mis Créditos</Text>
        
        <View style={{ flex: 1, marginTop: 12 }}>
          <ScrollView style={{ flex: 1 }}>
            <MovimientoCredito
              tag={["TANKEF", "En Espera"]}
              titulo="Pago de Tarjeta de Crédito"
              fecha="14 Nov 9:08 AM"
              body="$9,000.00"
            />
            <MovimientoCredito
              tag={["TANKEF", "Completado"]}
              titulo="Préstamo Colegiatura"
              fecha="20 Sep 11:08 AM"
              body="$16,500.00"
            />
          </ScrollView>
        </View>

        {/* Boton de Nuevo Crédito y Ver Más */}
        <View style={{height:80, marginLeft:20, marginRight:20, alignSelf: "stretch"}}>
          <TouchableOpacity style={styles.boton}>
            <Text style={[styles.textoBoton]}>NUEVO CRÉDITO</Text>
          </TouchableOpacity>
        </View>
        {/* Boton de VerMas*/}
        {/*<TouchableOpacity style={styles.verMas}>
          <Text style={styles.textoVerMas}>VER MÁS</Text>
        </TouchableOpacity>*/}
      </View>
      }



      {/* Seccion de las Inversiones del Usuario */}
      { this.state.isInversiones && 
      <View style={{ flex: 1 }}>  
        <Image
          style={styles.imagenInvertir}
          source={require("../../../assets/images/Invertir.png")}
        />
        <Text style={[styles.texto, { width: 150 }]}>
          Mis Inversiones
        </Text>
        
        <View style={{ flex: 1, marginTop: 12 }}>
          <ScrollView style={{ flex: 1 }}>
          <MovimientoInversion
              tag={["13.20%", "En Curso"]}
              titulo="Reinversión: Ahorro Aguinaldo"
              fecha="14 Nov 9:08 AM"
              actual="$18,195.00"
              inicial="$16,325.00"
            />
            <MovimientoInversion
              tag={["13.20%", "Completado"]}
              titulo="Reinversión: Ahorro Aguinaldo"
              fecha="14 Nov 9:08 AM"
              actual="$18,195.00"
              inicial="$16,325.00"
            />
            <MovimientoInversion
              tag={["13.20%", "Completado"]}
              titulo="Reinversión: Ahorro Aguinaldo"
              fecha="14 Nov 9:08 AM"
              actual="$18,195.00"
              inicial="$16,325.00"
            />
            <MovimientoInversion
              tag={["13.51%", "Completado"]}
              titulo="Ahorro Aguinaldo"
              fecha="20 Sep 11:08 AM"
              actual="$16,325.00"
              inicial="$15,000.00"
            />
          </ScrollView>
        </View>

        {/* Boton de Invertir y Ver Más */}
        <View style={{height:80, marginLeft:20, marginRight:20, alignSelf: "stretch"}}>
          <TouchableOpacity style={styles.boton}>
            <Text style={[styles.textoBoton]}>INVERTIR</Text>
          </TouchableOpacity>
        </View>
        {/* Boton de VerMas*/}
        {/* <TouchableOpacity style={[styles.verMas, { marginTop: 730 }]}>
          <Text style={styles.textoVerMas}>VER MÁS</Text>
        </TouchableOpacity> */}
      </View>
      }
    </View>
    );
  };

};

// Estilos de la pantalla
const styles = StyleSheet.create({
  background: {
    flex: 1,
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
  imagenCredito: {
    width: 53,
    height: 34,
    tintColor: "#29364d",
    marginTop: 0,
    left: 20,
  },
  imagenInvertir: {
    width: 45,
    height: 34,
    tintColor: "#29364d",
    marginTop: -1.5,
    left: 20,
  },
  texto: {
    fontSize: 16,
    width: 110,
    fontFamily: "conthrax",
    color: "#29364d",
    marginTop: -1.5,
    left: 80,
    position: "absolute",
  },
  verInversiones: {
    backgroundColor: "#29364d",
    flex: 0.5,
    height: 40,
    borderBottomLeftRadius: 17,
    borderTopLeftRadius: 17,
    borderColor: "#29364d",
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    left: 20,
    marginRight: 20,
    marginTop: 0,
  },
  verCreditos: {
    backgroundColor: "#ffffff",
    flex: 0.5,
    height: 40,
    borderBottomRightRadius: 17,
    borderTopRightRadius: 17,
    borderColor: "#29364d",
    borderWidth: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    right: 20,
    marginLeft: 20,
    marginTop: 0,
  },
  boton: {
    backgroundColor: "#29364d",
    height: 60,
    width: "100%",
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    marginTop: 10,
  },
  textoBoton: {
    fontSize: 15,
    fontFamily: "conthrax",
    color: "white",
    position: "absolute",
  },
  verMas: {
    width: 65,
    height: 20,
    borderRadius: 15,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    position: "absolute",
    marginTop: 400,
  },
  textoVerMas: {
    fontSize: 10,
    fontFamily: "conthrax",
    color: "#29364d",
    position: "absolute",
  },
});