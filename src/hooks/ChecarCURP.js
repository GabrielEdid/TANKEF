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

  props.fecha(fechaNacimiento), props.sexo(sexo), props.estado(estado);
};

export default ChecarCURP;
