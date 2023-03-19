export default function validarCNPJ(cnpj) {
  const cnpjlimpo = cnpj.replace(/[^\d]+/g, '');

  if (cnpjlimpo === '') return false;

  if (cnpjlimpo.length !== 14) { return false; }

  // Elimina CNPJs invalidos conhecidos
  if (cnpjlimpo.charAt(0).repeat(14) === cnpjlimpo) { return false; }

  // Valida DVs
  // let tamanho = cnpjlimpo.length - 2;
  // let numeros = cnpjlimpo.substring(0, tamanho);
  // const digitos = cnpjlimpo.substring(tamanho);
  // let soma = 0;
  // let pos = tamanho - 7;
  // for (let i = tamanho; i >= 1; i--) {
  //   soma += numeros.charAt(tamanho - i) * pos--;
  //   if (pos < 2) { pos = 9; }
  // }
  // const resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
  // if (resultado !== digitos.charAt(0)) { return false; }

  // tamanho += 1;
  // numeros = cnpjlimpo.substring(0, tamanho);
  // soma = 0;
  // pos = tamanho - 7;
  // for (i = tamanho; i >= 1; i--) {
  //   soma += numeros.charAt(tamanho - i) * pos--;
  //   if (pos < 2) { pos = 9; }
  // }
  // resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
  // if (resultado != digitos.charAt(1)) { return false; }

  return true;
}
