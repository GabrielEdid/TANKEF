// Importaciones de React Native y React
import React, { useState, useContext } from "react";
import { View, StyleSheet, Animated } from "react-native";
// Importacion de Hooks y Componentes
import DropDownPicker from "react-native-dropdown-picker";
import { UserContext } from "../hooks/UserContext";

/*
* Componente DropDown:
* Este componente es una implementación personalizada del DropDownPicker. 
* Se utiliza para seleccionar y mostrar opciones en un menú desplegable.
*
* Props:
* - field: Texto que aparece en el dropdown picker y que se desplaza al seleccionar una opción.
* - context: Nombre del campo en el contexto donde se guardará la opción seleccionada.
* - dropdown: Nombre del dropdown, determina las opciones a mostrar.
* 
* Ejemplo de uso:

<DropDown
field="Estado Civil"
context="estadoCivil"
dropdown={"civil"}
/>

<DropDown
field="Ocupación"
context="ocupacion"
dropdown={"ocupacion"}
/>

*/

const DropDown = (props) => {
  // Estado y animación para el despliegue del dropdown
  const animation = useState(new Animated.Value(0))[0];
  // Estado local y contexto global
  const { user, setUser } = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);

  // Función para seleccionar un item y actualizar el contexto de usuario segun el parametro dropdown
  const onSelectItem = (itemValue) => {
    moveUpAnimation();
    if (props.dropdown === "civil") {
      setUser({ ...user, estadoCivil: itemValue.value });
    } else if (props.dropdown === "ocupacion") {
      setUser({ ...user, ocupacion: itemValue.value });
    }
  };

  // Datos para las opciones de estado civil
  const [dataEstadoCivil, setDataEstadoCivil] = useState([
    { label: "Soltero/a", value: "single" },
    { label: "Casado/a", value: "married" },
  ]);

  // Datos para las opciones de ocupación
  const [dataOcupacion, setDataOcupacion] = useState([
    { label: "Estudiante", value: "Estudiante" },
    { label: "Profesor", value: "Profesor" },
    { label: "Ingeniero", value: "Ingeniero" },
    { label: "Médico", value: "Médico" },
    { label: "Enfermero/a", value: "Enfermero" },
    { label: "Abogado/a", value: "Abogado" },
    { label: "Contador/a", value: "Contador" },
    { label: "Arquitecto/a", value: "Arquitecto" },
    { label: "Empresario/a", value: "Empresario" },
    { label: "Empleado/a de Oficina", value: "Empleado de Oficina" },
    {
      label: "Trabajador/a de Construcción",
      value: "Trabajador de Construcción",
    },
    { label: "Agricultor/a", value: "Agricultor" },
    { label: "Científico/a", value: "Científico" },
    { label: "Diseñador/a Gráfico", value: "Diseñador Gráfico" },
    { label: "Programador/a de Software", value: "Programador de Software" },
    { label: "Analista de Sistemas", value: "Analista de Sistemas" },
    { label: "Comerciante", value: "Comerciante" },
    { label: "Chef", value: "Chef" },
    { label: "Cocinero/a", value: "Cocinero" },
    { label: "Mecánico/a", value: "Mecánico" },
    { label: "Electricista", value: "Electricista" },
    { label: "Plomero/a", value: "Plomero" },
    { label: "Artista", value: "Artista" },
    { label: "Músico/a", value: "Músico" },
    { label: "Escritor/a", value: "Escritor" },
    { label: "Periodista", value: "Periodista" },
    { label: "Fotógrafo/a", value: "Fotógrafo" },
    { label: "Consultor/a", value: "Consultor" },
    { label: "Vendedor/a", value: "Vendedor" },
    {
      label: "Agente de Servicio al Cliente",
      value: "Agente de Servicio al Cliente",
    },
    { label: "Chofer", value: "Chofer" },
    { label: "Empleado/a de Limpieza", value: "Empleado de Limpieza" },
    { label: "Trabajador/a Social", value: "Trabajador Social" },
    { label: "Psicólogo/a", value: "Psicólogo" },
    { label: "Dentista", value: "Dentista" },
    { label: "Veterinario/a", value: "Veterinario" },
    { label: "Fisioterapeuta", value: "Fisioterapeuta" },
    { label: "Personal de Seguridad", value: "Personal de Seguridad" },
    { label: "Bombero/a", value: "Bombero" },
    { label: "Militar", value: "Militar" },
    { label: "Piloto/a", value: "Piloto" },
    { label: "Azafata", value: "Azafata" },
    { label: "Deportista Profesional", value: "Deportista Profesional" },
    { label: "Entrenador/a Personal", value: "Entrenador Personal" },
    { label: "Freelancer", value: "Freelancer" },
    { label: "Emprendedor/a", value: "Emprendedor" },
    { label: "Jubilado/a", value: "Jubilado" },
    { label: "Ama de Casa", value: "Ama de Casa" },
    { label: "Desempleado/a", value: "Desempleado" },
    { label: "Otro", value: "Otro" },
  ]);

  // Función para animación de subida del texto
  const moveUpAnimation = () => {
    Animated.timing(animation, {
      toValue: -25,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  // Renderiza el componente
  return (
    <View style={{ marginTop: 8 }}>
      {props.dropdown === "civil" ? (
        <View>
          {/* Dropdown para estado civil */}
          <DropDownPicker
            // Props y estilos para DropDownPicker
            dropDownContainerStyle={styles.DropDownContainer}
            style={styles.DropDownPicker}
            textStyle={styles.DropDownText}
            placeholder=""
            bottomOffset={14}
            open={open}
            value={value}
            items={dataEstadoCivil}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setDataEstadoCivil}
            onSelectItem={onSelectItem}
          />
          {/* Texto que se desplaza al seleccionar una opción */}
          <Animated.Text
            style={[styles.texto, { transform: [{ translateY: animation }] }]}
          >
            {props.field}
          </Animated.Text>
        </View>
      ) : props.dropdown === "ocupacion" ? (
        <View>
          {/* Dropdown para ocupación */}
          <DropDownPicker
            // Props y estilos para DropDownPicker
            dropDownContainerStyle={styles.DropDownContainer}
            style={styles.DropDownPicker}
            textStyle={styles.DropDownText}
            placeholder=""
            bottomOffset={14}
            open={open}
            value={value}
            items={dataOcupacion}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setDataOcupacion}
            onSelectItem={onSelectItem}
          />
          {/* Texto que se desplaza al seleccionar una opción */}
          <Animated.Text
            style={[styles.texto, { transform: [{ translateY: animation }] }]}
          >
            {props.field}
          </Animated.Text>
        </View>
      ) : null}
    </View>
  );
};

// Estilos del componente
const styles = StyleSheet.create({
  texto: {
    paddingHorizontal: 5,
    fontSize: 16,
    fontWeight: "bold",
    color: "#21b6d5",
    marginTop: 10,
    left: 15,
    alignSelf: "center",
    position: "absolute",
    backgroundColor: "white",
    zIndex: 5000,
    paddingTop: 5,
  },
  DropDownPicker: {
    borderWidth: 1,
    borderColor: "#29364d",
    width: "100%",
    alignSelf: "center",
    borderRadius: 17,
    paddingLeft: 10,
    marginBottom: 14,
  },
  DropDownContainer: {
    width: "100%",
    alignSelf: "center",
    borderColor: "#29364d",
  },
  DropDownText: {
    fontSize: 16,
    color: "#29364d",
    alignSelf: "center",
  },
});

export default DropDown;
