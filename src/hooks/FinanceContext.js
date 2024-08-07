// Importaciones de React
import { max } from "date-fns";
import React, { createContext, useState } from "react";

// Creación del contexto UserContext
export const FinanceContext = createContext();

// Estado inicial definido fuera del componente
const initialState = {
  nombreFinance: "",
  monto: "",
  montoNumeric: "",
  montoShow: "",
  minMonto: "",
  maxMonto: "",
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
  aceptarSIC: false,
  actuoComo: "",
  paso: 1,
  focus: "",
  // Variables para el modal
  modalCotizadorVisible: false,
};

// Componente UserProvider
export const FinanceProvider = ({ children }) => {
  const [finance, setFinance] = useState(initialState);

  // Función para restablecer el estado de user
  const resetFinance = () => {
    setFinance(initialState);
  };

  // Proporcionar user, setUser y resetUser a través del contexto a todo el árbol de pantallas
  return (
    <FinanceContext.Provider value={{ finance, setFinance, resetFinance }}>
      {children}
    </FinanceContext.Provider>
  );
};
