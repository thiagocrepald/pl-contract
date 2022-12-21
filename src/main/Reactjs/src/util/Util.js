import moment from "moment";

export const DATE_FORMAT = "DD/MM/YYYY";

export const formatUTCToBR = (utcDate) => moment(utcDate).format(DATE_FORMAT);

export const formatBRToUTC = (utcDate) => moment(utcDate, DATE_FORMAT).format();

/**
 * Retorna uma string com a primeira letra de cada palavra em caixa alta, exceto as preposições e 'd''
 *
 * Exemplo:
 *
 *  PARAÍBA DO SUL retornará Paraíba do Sul
 *  SÃO JOÃO D'ALIANÇA retornará São João d'Aliança
 *
 * @param string
 * @returns {*}
 */
export const capitalizaString = (string) => {
  const preposicoes = [
    "de",
    "da",
    "do",
    "dos",
    "das",
    "neste",
    "duma",
    "na",
    "nesse",
    "àquela",
    "dele",
    "nele",
    "doutro",
    "noutro",
    "daqui",
  ];
  //D'ETETT
  //d'xxx
  if (string.includes("-")) {
    let cap = string
      .toLowerCase()
      .split("-")
      .map((s) =>
        s.substring(0, 2) === "d'"
          ? "d'" + s.charAt(2).toUpperCase() + s.substring(3)
          : !preposicoes.includes(s)
          ? s.charAt(0).toUpperCase() + s.substring(1)
          : s
      )
      .join("-");

    return cap;
  } else {
    let cap = string
      .toLowerCase()
      .split(" ")
      .map((s) =>
        s.substring(0, 2) === "d'"
          ? "d'" + s.charAt(2).toUpperCase() + s.substring(3)
          : !preposicoes.includes(s)
          ? s.charAt(0).toUpperCase() + s.substring(1)
          : s
      )
      .join(" ");
    return cap;
  }
};

export const calculaDiferencaDeHoras = (horaInicio, horaFim) => {
  let diff = 0;
  let diffHours = 0,
    diffMinutes = 0;

  if (moment(horaInicio).isAfter(moment(horaFim))) {
    diff = moment.duration(
      moment(horaFim)
        .add(24, "hours")
        .add(1, "seconds")
        .diff(moment(horaInicio))
    );
    //diffMinutes = moment.duration(moment(horaFim).minutes().add(60, 'minutes').diff(moment(horaInicio).minutes())).asMinutes().toFixed();
  } else {
    diff = moment.duration(
      moment(horaFim).add(1, "seconds").diff(moment(horaInicio))
    );
    //diffMinutes = moment.duration(moment(horaFim).minutes().diff(moment(horaInicio).minutes())).asMinutes().toFixed();
  }
  diffHours = diff.hours().toFixed();
  diffMinutes = diff.minutes();
  return (
    diffHours.toString() + " Hora(s) e " + diffMinutes.toString() + " minuto(s)"
  );
};
export const validarCNPJ = (cnpj) => {
  cnpj = cnpj.replace(/[^\d]+/g, "");

  if (cnpj === "") return false;

  if (cnpj.length !== 14) return false;

  // Elimina CNPJs invalidos conhecidos
  if (
    cnpj === "00000000000000" ||
    cnpj === "11111111111111" ||
    cnpj === "22222222222222" ||
    cnpj === "33333333333333" ||
    cnpj === "44444444444444" ||
    cnpj === "55555555555555" ||
    cnpj === "66666666666666" ||
    cnpj === "77777777777777" ||
    cnpj === "88888888888888" ||
    cnpj === "99999999999999"
  )
    return false;

  // Valida DVs
  let tamanho = cnpj.length - 2;
  let numeros = cnpj.substring(0, tamanho);
  let digitos = cnpj.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;
  for (let i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--;
    if (pos < 2) pos = 9;
  }
  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== digitos.charAt(0)) return false;

  tamanho = tamanho + 1;
  numeros = cnpj.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;
  for (let i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--;
    if (pos < 2) pos = 9;
  }
  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== digitos.charAt(1)) return false;

  return true;
};

export const isNullOrEmpty = (string) => {
  return string == null || string.length === 0;
};
