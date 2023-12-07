// Función para verificar y procesar una CURP (Clave Única de Registro de Población)
export const ChecarCURP = (curp) => {
  const invalido = "CURP Invalido"; // Mensaje de retorno si algo falla
  let fechaNacimiento; // Variable para almacenar la fecha de nacimiento
  let sexo; // Variable para almacenar el sexo
  let estadoCodigo; // Variable para almacenar el código del estado

  // Verifica si la CURP tiene la longitud correcta (18 caracteres)
  if (curp.length !== 18) {
    console.log("CURP inválida o no definida");
    return;
  }

  // Extrae y procesa los datos de la CURP
  const año = curp.substring(4, 6);
  const mes = curp.substring(6, 8);
  const dia = curp.substring(8, 10);
  sexo = curp.substring(10, 11);
  estadoCodigo = curp.substring(11, 13);

  // Determina el siglo del año de nacimiento basado en el año
  const siglo = parseInt(año) <= 24 ? "20" : "19"; // Ajustar el valor '24' si necesario
  fechaNacimiento = `${siglo}${año}-${mes}-${dia}`;

  // Convierte el código de sexo a una descripción completa
  sexo = sexo === "H" ? "Hombre" : sexo === "M" ? "Mujer" : invalido;

  // Mapeo de códigos de estado a nombres completos
  const estados = {
    // Lista de códigos y sus correspondientes estados
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

  // Obtiene el nombre completo del estado o retorna 'invalido'
  let estadoNacimiento = estados[estadoCodigo] || invalido;

  // Retorna los datos extraídos y procesados
  return { fechaNacimiento, sexo, estadoNacimiento };
};
