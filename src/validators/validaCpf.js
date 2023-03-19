export default class ValidaCpf {
  constructor(cpf) {
    Object.defineProperty(this, 'cpfLimpo', {
      writable: false, // se pod ser alterada via operador de atribuiçao
      enumerable: true, // se é visivel
      configurable: true, // se pode ser alterada ou deletada
      value: cpf.replace(/\D+/g, ''), // valor associado
    });
  }

  sequencia() {
    return this.cpfLimpo.charAt(0).repeat(11) === this.cpfLimpo;
  }

  geraCpfNovo() {
    const cpfSemDigitos = this.cpfLimpo.slice(0, -2);
    const primeiroDigito = ValidaCpf.criaDigito(cpfSemDigitos);
    const segundoDigito = ValidaCpf.criaDigito(cpfSemDigitos + primeiroDigito);
    this.novoCpf = cpfSemDigitos + primeiroDigito + segundoDigito;
  }

  static criaDigito(cpfSemDigitos) {
    let total = 0;
    let reverso = cpfSemDigitos.length + 1;

    // eslint-disable-next-line no-restricted-syntax
    for (const stringNumerica of cpfSemDigitos) {
      total += reverso * Number(stringNumerica);
      // eslint-disable-next-line no-plusplus
      reverso--;
    }

    const digito = 11 - (total % 11);
    return digito <= 9 ? String(digito) : '0';
  }

  valida() {
    if (!this.cpfLimpo) return false;
    if (this.sequencia()) return false;
    if (typeof this.cpfLimpo !== 'string') return false;
    if (this.cpfLimpo.length !== 11) return false;
    this.geraCpfNovo();
    return this.novoCpf === this.cpfLimpo;
  }
}
