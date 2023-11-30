import React, { useState, useEffect, useContext } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
} from "react-native";
import { UserContext } from "../hooks/UserContext";
import { Ionicons } from "@expo/vector-icons";

const SpecialInput = (props) => {
  const { user, setUser } = useContext(UserContext);
  const [field, setField] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
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
    setUser({ ...user, [props.context]: nuevoTexto });
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  useEffect(() => {
    const currentValue = props.editable ? field : user[props.context];
    if (currentValue) {
      moveUpAnimation();
    } else {
      moveDownAnimation();
    }
  }, [field, user, props.context, props.editable]);

  return (
    <View style={styles.container}>
      <TextInput
        onChangeText={handleChangeText}
        value={props.editable ? field : user[props.context]}
        style={[
          styles.input,
          !props.editable && { borderColor: "grey" },
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
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    position: "relative",
  },
  input: {
    borderWidth: 1,
    borderColor: "#29364d",
    width: 300,
    height: 40,
    fontSize: 16,
    alignSelf: "center",
    borderRadius: 17,
    marginBottom: 10,
    paddingLeft: 10,
  },
  label: {
    paddingHorizontal: 5,
    fontSize: 16,
    fontWeight: "bold",
    color: "#21b6d5",
    marginTop: 10,
    left: 30,
    position: "absolute",
    backgroundColor: "white",
  },
  toggleButton: {
    position: "absolute",
    right: 60,
    height: 40,
    justifyContent: "center",
  },
});

export default SpecialInput;
