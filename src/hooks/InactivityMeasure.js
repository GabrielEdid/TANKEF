import React from "react";
import {
  View,
  Text,
  Button,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useInactivity } from "./InactivityContext"; // Asegúrate de que la ruta sea correcta

const InactivityWrapper = ({ children, ...props }) => {
  const { resetTimeout } = useInactivity();

  const handlePress = (event) => {
    resetTimeout();
    if (props.onPress) {
      props.onPress(event);
    }
  };

  const handleScroll = (event) => {
    resetTimeout();
    if (props.onScroll) {
      props.onScroll(event);
    }
  };

  const handleChangeText = (text) => {
    resetTimeout();
    if (props.onChangeText) {
      props.onChangeText(text);
    }
  };

  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        onPress: handlePress,
        onScroll: handleScroll,
        onChangeText: handleChangeText,
      });
    }
    return child;
  });

  return <View {...props}>{childrenWithProps}</View>;
};

export default InactivityWrapper;
