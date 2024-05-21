import React, { useEffect } from "react";
import {
  View,
  Keyboard,
  AppState,
  TouchableWithoutFeedback,
} from "react-native";
import { useInactivity } from "./InactivityContext"; // Asegúrate de que la ruta sea correcta

const MainView = ({ children }) => {
  const { resetTimeout } = useInactivity();

  useEffect(() => {
    const handleKeyboardShow = () => resetTimeout();
    const handleKeyboardHide = () => resetTimeout();

    const keyboardShowListener = Keyboard.addListener(
      "keyboardDidShow",
      handleKeyboardShow
    );
    const keyboardHideListener = Keyboard.addListener(
      "keyboardDidHide",
      handleKeyboardHide
    );

    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === "active") {
        resetTimeout();
      }
    };

    const appStateListener = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      keyboardShowListener.remove();
      keyboardHideListener.remove();
      appStateListener.remove();
    };
  }, [resetTimeout]);

  return (
    <View
      style={{ flex: 1 }}
      onStartShouldSetResponder={() => true}
      onResponderGrant={resetTimeout}
    >
      {children}
    </View>
  );
};

export default MainView;
