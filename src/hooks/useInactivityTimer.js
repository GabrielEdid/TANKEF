import { useEffect, useRef, useCallback } from "react";
import { AppState, BackHandler } from "react-native";

const useInactivityTimer = (timeoutDuration, onTimeout) => {
  const timeoutRef = useRef(null);
  const appState = useRef(AppState.currentState);

  const resetTimeout = useCallback(() => {
    console.log("Resetting timeout");
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(onTimeout, timeoutDuration);
  }, [onTimeout, timeoutDuration]);

  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        resetTimeout();
      }
      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      subscription.remove();
    };
  }, [resetTimeout]);

  useEffect(() => {
    const handleActivity = () => {
      resetTimeout();
    };

    const handleBackPress = () => {
      resetTimeout();
      return false; // Permitir la acción de retroceso predeterminada
    };

    const events = [
      BackHandler.addEventListener("hardwareBackPress", handleBackPress),
      AppState.addEventListener("change", handleActivity),
    ];

    resetTimeout();

    return () => {
      events.forEach((event) => event.remove());
      clearTimeout(timeoutRef.current);
    };
  }, [resetTimeout]);

  return resetTimeout;
};

export default useInactivityTimer;
