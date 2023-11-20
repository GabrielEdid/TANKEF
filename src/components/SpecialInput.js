import React, { useState, useEffect } from "react";
import { View, TextInput, StyleSheet, Animated } from "react-native";

const SpecialInput = (props) => {
  const [field, setField] = useState("");
  const animation = useState(new Animated.Value(0))[0];

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

  return (
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
        onBlur={props.editable && (field !== "" ? null : moveDownAnimation)}
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
});

export default SpecialInput;
