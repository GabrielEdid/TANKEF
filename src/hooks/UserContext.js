import React, { createContext, useState } from "react";

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
  FireBaseUIDMail: "",
  FireBaseUIDTel: "",
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(initialState);

  // Función para restablecer el estado de user
  const resetUser = () => {
    setUser(initialState);
  };

  return (
    <UserContext.Provider value={{ user, setUser, resetUser }}>
      {children}
    </UserContext.Provider>
  );
};
