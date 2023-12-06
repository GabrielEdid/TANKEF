export const ChecarCURP = (curp) => {
  const invalido = "CURP Invalido";
  let fechaNacimiento;
  let sexo;
  let estadoCodigo;

  if (curp.length !== 18) {
    console.log("CURP inválida o no definida");
    return;
  }

  // Extracción y procesamiento de datos de la CURP
  const año = curp.substring(4, 6);
  const mes = curp.substring(6, 8);
  const dia = curp.substring(8, 10);
  sexo = curp.substring(10, 11);
  estadoCodigo = curp.substring(11, 13);

  // Determinar el siglo del año de nacimiento
  const siglo = parseInt(año) <= 24 ? "20" : "19"; // Ajusta el valor '30' según sea necesario
  fechaNacimiento = `${siglo}${año}-${mes}-${dia}`;

  // Convertir código de sexo a descripción completa
  sexo = sexo === "H" ? "Hombre" : sexo === "M" ? "Mujer" : invalido;

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

  let estadoNacimiento = estados[estadoCodigo] || invalido;

  // Actualizar el contexto del usuario
  return { fechaNacimiento, sexo, estadoNacimiento };
};
