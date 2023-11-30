export const ChecarCURP = (curp) => {
  const incorrecto = "CURP incorrecto";
  let fechaNacimiento;
  let sexo;
  let estadoCodigo;

  // Verificar si la CURP está definida y tiene la longitud adecuada
  if (curp.length !== 18) {
    console.log("CURP inválida o no definida");
    return;
  }

  // Extracción y procesamiento de datos de la CURP
  fechaNacimiento = curp.substring(4, 10);
  sexo = curp.substring(10, 11);
  estadoCodigo = curp.substring(11, 13);

  // Convertir fecha de nacimiento a formato YYYY-MM-DD
  fechaNacimiento = fechaNacimiento.replace(
    /^(\d{2})(\d{2})(\d{2})$/,
    "$3-$2-$1"
  );

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
  return { fechaNacimiento, sexo, estadoNacimiento };
};
