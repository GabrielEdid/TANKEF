import React, { useContext } from "react";
import { UserContext } from "./UserContext"; // Asegúrate de que la ruta sea correcta

const ChecarCURP = () => {
  const { user, setUser } = useContext(UserContext);
  const curp = user.CURP;
  const incorrecto = "CURP incorrecto";

  // Verificar si la CURP está definida y tiene la longitud adecuada
  if (!curp || curp.length !== 18) {
    console.log("CURP inválida o no definida");
    return;
  }

  // Extracción y procesamiento de datos de la CURP
  let fechaNacimiento = curp.substring(4, 10);
  let sexo = curp.substring(10, 11);
  let estadoCodigo = curp.substring(11, 13);

  // Convertir fecha de nacimiento a formato YYYY-MM-DD
  fechaNacimiento =
    "19" + fechaNacimiento.replace(/^(\d{2})(\d{2})(\d{2})$/, "$3-$2-$1");

  // Convertir código de sexo a descripción completa
  sexo = sexo === "H" ? "Hombre" : sexo === "M" ? "Mujer" : incorrecto;

  // Mapeo de códigos de estado a nombres de estado
  const estados = {
    AS: "Aguascalientes",
    BC: "Baja California",
    BS: "Baja California Sur",
    CC: "Campeche",
    CL: "Coahuila",
    CM: "Colima",
    CS: "Chiapas",
    CH: "Chihuahua",
    DF: "Ciudad de México",
    DG: "Durango",
    GR: "Guanajuato",
    GT: "Guerrero",
    HG: "Hidalgo",
    JC: "Jalisco",
    MC: "Estado de México",
    MN: "Michoacán",
    MS: "Morelos",
    NT: "Nayarit",
    NL: "Nuevo León",
    OC: "Oaxaca",
    PL: "Puebla",
    QR: "Quintana Roo",
    QT: "Querétaro",
    SI: "Sinaloa",
    SL: "San Luis Potosí",
    SO: "Sonora",
    TC: "Tabasco",
    TL: "Tlaxcala",
    TS: "Tamaulipas",
    VZ: "Veracruz",
    YN: "Yucatán",
    ZS: "Zacatecas",
  };

  let estadoNacimiento = estados[estadoCodigo] || incorrecto;

  // Actualizar el contexto del usuario
  setUser({
    ...user,
    fechaNacimiento: fechaNacimiento,
    sexo: sexo,
    estadoNacimiento: estadoNacimiento,
  });
};

export default ChecarCURP;
/*if (estados[estado]) {
    props.fecha(fechaNacimiento);
    props.sexo(sexo);
    props.estado(estados[estado]);
  } else {
    props.fecha(incorrecto);
    props.sexo(incorrecto);
    props.estado(incorrecto);
  }
};*/
