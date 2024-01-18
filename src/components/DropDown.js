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
    { label: "Soltero/a", value: "Soltero/a" },
    { label: "Casado/a", value: "Casado/a" },
    { label: "Divorciado/a", value: "Divorciado/a" },
    {
      label: "Separado/a en proceso judicial",
      value: "Separado/a en proceso judicial",
    },
    { label: "Viudo/a", value: "Viudo/a" },
    { label: "Concubinato", value: "Concubinato" },
  ]);

  // Datos para las opciones de ocupación
  const [dataOcupacion, setDataOcupacion] = useState([
    { label: "Estudiante", value: "Estudiante" },
    { label: "Profesor/Académico", value: "Profesor/Académico" },
    { label: "Ingeniero", value: "Ingeniero" },
    { label: "Médico", value: "Médico" },
    { label: "Enfermero/a", value: "Enfermero/a" },
    { label: "Abogado/a", value: "Abogado/a" },
    { label: "Contador/a", value: "Contador/a" },
    { label: "Arquitecto/a", value: "Arquitecto/a" },
    { label: "Empresario/a", value: "Empresario/a" },
    { label: "Empleado/a de Oficina", value: "Empleado/a de Oficina" },
    {
      label: "Trabajador/a de Construcción",
      value: "Trabajador/a de Construcción",
    },
    { label: "Agricultor/a", value: "Agricultor/a" },
    { label: "Científico/a", value: "Científico/a" },
    { label: "Diseñador/a Gráfico", value: "Diseñador/a Gráfico" },
    { label: "Programador/a de Software", value: "Programador/a de Software" },
    { label: "Analista de Sistemas", value: "Analista de Sistemas" },
    { label: "Comerciante", value: "Comerciante" },
    { label: "Chef/Cocinero/a", value: "Chef/Cocinero/a" },
    { label: "Mecánico/a", value: "Mecánico/a" },
    { label: "Electricista", value: "Electricista" },
    { label: "Plomero/a", value: "Plomero/a" },
    { label: "Artista", value: "Artista" },
    { label: "Músico/a", value: "Músico/a" },
    { label: "Escritor/a", value: "Escritor/a" },
    { label: "Periodista", value: "Periodista" },
    { label: "Fotógrafo/a", value: "Fotógrafo/a" },
    { label: "Consultor/a", value: "Consultor/a" },
    { label: "Vendedor/a", value: "Vendedor/a" },
    {
      label: "Agente de Servicio al Cliente",
      value: "Agente de Servicio al Cliente",
    },
    { label: "Chofer/Conductor/a", value: "Chofer/Conductor/a" },
    { label: "Empleado/a de Limpieza", value: "Empleado/a de Limpieza" },
    { label: "Trabajador/a Social", value: "Trabajador/a Social" },
    { label: "Psicólogo/a", value: "Psicólogo/a" },
    { label: "Dentista", value: "Dentista" },
    { label: "Veterinario/a", value: "Veterinario/a" },
    { label: "Fisioterapeuta", value: "Fisioterapeuta" },
    { label: "Personal de Seguridad", value: "Personal de Seguridad" },
    { label: "Bombero/a", value: "Bombero/a" },
    { label: "Militar", value: "Militar" },
    { label: "Piloto/a", value: "Piloto/a" },
    { label: "Azafata/Steward", value: "Azafata/Steward" },
    { label: "Deportista Profesional", value: "Deportista Profesional" },
    { label: "Entrenador/a Personal", value: "Entrenador/a Personal" },
    { label: "Freelancer", value: "Freelancer" },
    { label: "Emprendedor/a", value: "Emprendedor/a" },
    { label: "Jubilado/a", value: "Jubilado/a" },
    { label: "Ama de Casa", value: "Ama de Casa" },
    { label: "Desempleado/a", value: "Desempleado/a" },
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
