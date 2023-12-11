// Importaciones de React
import React, { createContext, useState } from "react";

// Creación del contexto UserContext
export const UserContext = createContext();

// Estado inicial definido fuera del componente
const initialState = {
  nombre: "",
  apellidoPaterno: "",
  apellidoMaterno: "",
  CURP: "",
  fechaNacimiento: "",
  estadoNacimiento: "",
  sexo: "",
  ocupacion: "",
  estadoCivil: "",
  loggedIn: false,
  telefono: "",
  email: "",
  password: "",
  pin: "",
  FireBaseUIDTel: "",
};

// Componente UserProvider
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(initialState);

  // Función para restablecer el estado de user
  const resetUser = () => {
    setUser(initialState);
  };

  // Proporcionar user, setUser y resetUser a través del contexto a todo el árbol de pantallas
  return (
    <UserContext.Provider value={{ user, setUser, resetUser }}>
      {children}
    </UserContext.Provider>
  );
};
