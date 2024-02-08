// Importaciones de React
import React, { createContext, useState } from "react";

// Creación del contexto UserContext
export const UserContext = createContext();

// Estado inicial definido fuera del componente
const initialState = {
  // Datos de Login y de uso en la App
  nombre: "",
  apellidoPaterno: "",
  apellidoMaterno: "",
  CURP: "",
  fechaNacimiento: "",
  telefono: "",
  estadoNacimiento: "",
  backEndEstadoNacimiento: "", // El valor que se envía al backend como estado de nacimiento
  sexo: "",
  email: "",
  password: "",
  // Datos con AsyncStorage
  pin: "",
  loggedIn: false,
  // Variables de registro progresivo
  ocupacion: "",
  estadoCivil: "",
  fotoPerfil: "",
  nacionalidad: "",
  firmaElectronica: "",
  RFC: "",
  avatar: null,
  conexiones: 0,
  // Datos con backend
  userID: "", // ID del usuario en la base de datos
  userToken: "", // Token de autenticación del usuario
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
