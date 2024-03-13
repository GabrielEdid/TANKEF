// Importaciones de React
import React, { createContext, useState } from "react";

// Creación del contexto UserContext
export const CreditContext = createContext();

// Estado inicial definido fuera del componente
const initialState = {
  monto: "",
  plazo: "",
  comision_por_apertura: "",
  tasa_de_operacion: "",
  pago_mensual: "",
  total_a_pagar: "",
  obligados_solidarios: [],
  politico: "",
  domicilio: "",
  telCasa: "",
  telTrabajo: "",
  celular: "",
  cuenta_bancaria: "",
  descripcion: "",
  paso: 1,
};

// Componente UserProvider
export const CreditProvider = ({ children }) => {
  const [credit, setCredit] = useState(initialState);

  // Función para restablecer el estado de user
  const resetCredit = () => {
    setCredit(initialState);
  };

  // Proporcionar user, setUser y resetUser a través del contexto a todo el árbol de pantallas
  return (
    <CreditContext.Provider value={{ credit, setCredit, resetCredit }}>
      {children}
    </CreditContext.Provider>
  );
};
