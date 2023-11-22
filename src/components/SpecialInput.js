import React, { useState, useEffect } from "react";
import { View, TextInput, StyleSheet, Animated } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

const SpecialInput = (props) => {
  const [field, setField] = useState("");
  const animation = useState(new Animated.Value(0))[0];

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
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

  const moveUpAnimation = () => {
    Animated.timing(animation, {
      toValue: -20,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const moveDownAnimation = () => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleChangeText = (nuevoTexto) => {
    setField(nuevoTexto);
    if (props.set) {
      props.set(nuevoTexto);
    }
  };

  useEffect(() => {
    if (!props.editable) {
      // Si el campo no es editable y tiene un valor, mover hacia arriba
      if (props.value) {
        moveUpAnimation();
      } else {
        moveDownAnimation();
      }
    }
  }, [props.value, props.editable]);

  return props.dropdown === "civil" || props.dropdown === "ocupacion" ? (
    <View style={{ marginTop: 8 }}>
      {props.dropdown === "civil" ? (
        <View>
          <DropDownPicker
            style={[styles.DropDownPicker, { zIndex: -1 }]}
            textStyle={styles.DropDownText}
            labelStyle={{ color: "black", fontWeight: "normal" }}
            placeholder="Estado Civil"
            open={open}
            value={value}
            items={dataEstadoCivil}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setDataEstadoCivil}
            onPress={moveUpAnimation}
          />
          <View style={{ zIndex: 0 }}>
            <Animated.Text
              style={[
                styles.texto,
                { marginTop: -50 },
                { transform: [{ translateY: animation }] },
              ]}
            >
              {props.field}
            </Animated.Text>
          </View>
        </View>
      ) : props.dropdown === "ocupacion" ? (
        <DropDownPicker
          style={styles.DropDownPicker}
          textStyle={styles.DropDownText}
          labelStyle={{ color: "black", fontWeight: "normal" }}
          placeholder="Ocupación"
          open={open}
          value={value}
          items={dataOcupacion}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setDataOcupacion}
        />
      ) : null}
    </View>
  ) : (
    <View style={{ marginTop: 8 }}>
      <TextInput
        onChangeText={handleChangeText}
        value={props.editable ? field : props.value}
        style={
          props.editable
            ? styles.input
            : [styles.input, { borderColor: "grey" }]
        }
        onFocus={moveUpAnimation}
        onBlur={() => {
          if (props.editable && field === "") {
            moveDownAnimation();
          }
        }}
        editable={props.editable ? true : false}
      />
      <Animated.Text
        style={[
          props.editable ? styles.texto : [styles.texto, { color: "grey" }],
          { transform: [{ translateY: animation }] },
        ]}
      >
        {props.field}
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#29364d",
    width: 300,
    height: 40,
    fontSize: 20,
    alignSelf: "center",
    borderRadius: 17,
    marginBottom: 20,
    paddingLeft: 10,
    fontSize: 16,
    borderRadius: 15,
  },
  texto: {
    paddingHorizontal: 5,
    fontSize: 16,
    fontWeight: "bold",
    color: "#21b6d5",
    marginTop: 10,
    left: 30,
    alignSelf: "center",
    position: "absolute",
    backgroundColor: "white",
  },
  DropDownPicker: {
    borderWidth: 1,
    borderColor: "#29364d",
    width: 300,
    height: 40,
    alignSelf: "center",
    borderRadius: 17,
    marginBottom: 20,
    paddingLeft: 10,
  },
  DropDownText: {
    paddingHorizontal: 5,
    fontSize: 16,
    fontWeight: "bold",
    color: "#21b6d5",
    alignSelf: "center",
    backgroundColor: "white",
  },
});

export default SpecialInput;
