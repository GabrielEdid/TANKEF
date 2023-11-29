import React, { createContext, useState } from "react";
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    nombre: "",
    CURP: "",
    fechaNacimiento: "",
    estadoNacimiento: "",
    sexo: "",
    profesion: "",
    estadoCivil: "",
    email: "",
    password: "",
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
