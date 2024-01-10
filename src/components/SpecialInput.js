// Importaciones de React Native y React
import React, { useState, useEffect, useContext } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
// Importacion de Hooks y Componentes
import { UserContext } from "../hooks/UserContext";
import { Ionicons } from "@expo/vector-icons";

/*
 * `SpecialInput` es un componente personalizado para la entrada de texto.
 * Puede ser utilizado para campos de texto regulares y de contraseña.
 *
 * Props:
 * - `context`: Una cadena que especifica la clave del estado global (contexto) a actualizar.
 * - `editable`: Un booleano que determina si el campo de texto es editable.
 * - `field`: Una cadena que representa el texto del campo.
 * - `password`: Un booleano que indica si el campo de texto es para contraseña.
 * - `set`: Una función opcional para actualizar un estado local.
 * 
 * Ejemplo de uso:
 
  Special Input Editable:
  <SpecialInput field="Nombre(s)" context="nombre" editable={true} />

  Special Input No Editable:
  <SpecialInput field="Fecha de Nacimiento" context="fechaNacimiento" editable={false} />

  Special Input Password:
  <SpecialInput field="Contraseña" editable={true} password={true} context={"password"} />

 */

const SpecialInput = (props) => {
  // Estado local, contexto global y animación para el despliegue del label
  const { user, setUser } = useContext(UserContext);
  const [field, setField] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const animation = useState(new Animated.Value(0))[0];

  // Anima el label del campo de texto para moverse hacia arriba.
  const moveUpAnimation = () => {
    Animated.timing(animation, {
      toValue: -20,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  // Anima el label del campo de texto para volver a su posición original.
  const moveDownAnimation = () => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // Efecto para manejar el movimiento del label según el contenido del campo.
  useEffect(() => {
    const currentValue = props.editable ? field : user[props.context];
    if (currentValue) {
      moveUpAnimation();
    } else {
      moveDownAnimation();
    }
  }, [field, user, props.context, props.editable]);

  // Maneja el cambio de texto y actualiza el estado global y/o local.
  const handleChangeText = (nuevoTexto) => {
    setField(nuevoTexto);
    // Actualizar el estado de forma condicional para evitar renderizados innecesarios
    if (user[props.context] !== nuevoTexto) {
      setUser((prevUser) => ({ ...prevUser, [props.context]: nuevoTexto }));
    }
    {
      props.set ? props.set(nuevoTexto) : null;
    }
  };

  // Cambia la visibilidad del texto en campos de contraseña.
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  // Renderiza el componente
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        {/* Campo de texto para ingresar datos */}
        <View>
          <TextInput
            onChangeText={handleChangeText}
            value={props.editable ? field : user[props.context]}
            style={[
              styles.input,
              !props.editable && { borderColor: "grey", color: "grey" },
              props.password && { paddingRight: 40 },
            ]}
            onFocus={moveUpAnimation}
            onBlur={() => {
              if (props.editable && field === "") {
                moveDownAnimation();
              }
            }}
            editable={props.editable}
            secureTextEntry={props.password && !isPasswordVisible}
            autoCapitalize="none"
          />
          {/* Etiqueta animada para el campo de texto */}
          <Animated.Text
            style={[
              styles.label,
              { transform: [{ translateY: animation }] },
              !props.editable && { color: "grey" },
            ]}
          >
            {props.field}
          </Animated.Text>
        </View>
        {/* Botón para alternar la visibilidad de la contraseña */}
        {props.password && (
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={styles.toggleButton}
          >
            <Ionicons
              name={isPasswordVisible ? "eye-off" : "eye"}
              size={24}
              color="#21b6d5"
            />
          </TouchableOpacity>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

// Estilos del componente
const styles = StyleSheet.create({
  container: {
    marginTop: 0,
  },
  input: {
    borderWidth: 1,
    borderColor: "#29364d",
    width: "100%",
    height: 40,
    fontSize: 16,
    alignSelf: "center",
    borderRadius: 17,
    marginBottom: 14,
    paddingLeft: 10,
  },
  label: {
    marginTop: 10,
    left: 20,
    position: "absolute",
    fontSize: 16,
    fontWeight: "bold",
    color: "#21b6d5",
    backgroundColor: "white",
  },
  toggleButton: {
    position: "absolute",
    right: 30,
    height: 40,
    justifyContent: "center",
  },
});

export default SpecialInput;
