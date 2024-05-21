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

const InactivityMeasure = ({
  children,
  onPress,
  onScroll,
  onChangeText,
  ...props
}) => {
  const { resetTimeout } = useInactivity();

  const handlePress = (event) => {
    console.log("Pressing");
    resetTimeout();
    if (onPress) {
      onPress(event);
    }
  };

  const handleScroll = (event) => {
    console.log("Scrolling");
    resetTimeout();
    if (onScroll) {
      onScroll(event);
    }
  };

  const handleChangeText = (text) => {
    console.log("Changing text");
    resetTimeout();
    if (onChangeText) {
      onChangeText(text);
    }
  };

  return (
    <View {...props}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            onPress: handlePress,
            onScroll: handleScroll,
            onChangeText: handleChangeText,
            ...child.props,
          });
        }
        return child;
      })}
    </View>
  );
};

export default InactivityMeasure;
