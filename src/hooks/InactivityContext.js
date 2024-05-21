import React, { createContext, useContext, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import useInactivityTimer from "./useInactivityTimer"; // Asegúrate de que la ruta sea correcta

const InactivityContext = createContext();

export const InactivityProvider = ({ children }) => {
  const [isInactive, setIsInactive] = useState(false);
  const navigation = useNavigation();

  const handleTimeout = () => {
    setIsInactive(true);
    navigation.navigate("AuthPinPad", { modal: true });
  };

  const resetTimeout = useInactivityTimer(300000, handleTimeout); // 300000 ms = 5 minutos

  return (
    <InactivityContext.Provider
      value={{ isInactive, setIsInactive, resetTimeout }}
    >
      {children}
    </InactivityContext.Provider>
  );
};

export const useInactivity = () => {
  return useContext(InactivityContext);
};
