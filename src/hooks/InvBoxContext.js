// Importaciones de React
import React, { createContext, useState } from "react";

// Creación del contexto UserContext
export const InvBoxContext = createContext();

// Estado inicial definido fuera del componente
const initialState = {
  nombreInvBox: "",
  monto: "",
  montoNumeric: "",
  montoShow: "",
  plazo: "",
  condiciones: false,
  CURP: "",
  nombreCURP: "",
  isThereCURP: false,
  situacionFiscal: "",
  nombreSituacionFiscal: "",
  isThereSituacionFiscal: false,
  comprobanteDomicilio: "",
  nombreComprobanteDomicilio: "",
  isThereComprobanteDomicilio: false,
  identificacion: "",
  nombreIdentificacion: "",
  isThereIdentificacion: false,
  actuoComo: "",
  documents: [{}],
  nombre: "",
  apellidos: "",
  parentesco: "",
  porcentaje: "100",
  nombre2: "",
  apellidos2: "",
  parentesco2: "",
  porcentaje2: "",
  alias: "",
  clabe: "",
  NCuenta: "",
  comprobanteNCuenta: "",
  nombreComprobante: "",
  banco: "",
  nombreCuentahabiente: "",
  accountID: "",
  accounts: [],
};

// Componente UserProvider
export const InvBoxProvider = ({ children }) => {
  const [invBox, setInvBox] = useState(initialState);

  // Función para restablecer el estado de user
  const resetInvBox = () => {
    setInvBox(initialState);
  };

  // Proporcionar user, setUser y resetUser a través del contexto a todo el árbol de pantallas
  return (
    <InvBoxContext.Provider value={{ invBox, setInvBox, resetInvBox }}>
      {children}
    </InvBoxContext.Provider>
  );
};
