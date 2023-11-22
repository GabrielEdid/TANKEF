import React from "react";

const ChecarCURP = (props) => {
  let fechaNacimiento = props.curp.substring(4, 10);
  let sexo = props.curp.substring(10, 11);
  let estado = props.curp.substring(11, 13);

  let auxFechaNacimiento = "";
  for (let i = 0; i < fechaNacimiento.length; i += 2) {
    auxFechaNacimiento += fechaNacimiento.substring(i, i + 2);
    if (i + 2 < fechaNacimiento.length) {
      auxFechaNacimiento += "/";
    }
  }

  const partes = auxFechaNacimiento.split("/");
  fechaNacimiento = partes[2] + "/" + partes[1] + "/" + partes[0];

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

  const incorrecto = "CURP incorrecto";

  if (sexo === "H") {
    sexo = "Hombre";
  } else if (sexo === "M") {
    sexo = "Mujer";
  } else {
    sexo = incorrecto;
  }

  if (estados[estado]) {
    props.fecha(fechaNacimiento);
    props.sexo(sexo);
    props.estado(estados[estado]);
  } else {
    props.fecha(incorrecto);
    props.sexo(incorrecto);
    props.estado(incorrecto);
  }
};

export default ChecarCURP;
