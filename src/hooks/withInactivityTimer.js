import React from "react";
import { useInactivity } from "./InactivityContext"; // Asegúrate de que la ruta sea correcta
import { TouchableWithoutFeedback } from "react-native";

const withInactivityTimer = (WrappedComponent) => {
  return (props) => {
    const { resetTimeout } = useInactivity();

    return (
      <TouchableWithoutFeedback
        onPress={resetTimeout}
        onTouchStart={resetTimeout}
      >
        <WrappedComponent {...props} />
      </TouchableWithoutFeedback>
    );
  };
};

export default withInactivityTimer;
