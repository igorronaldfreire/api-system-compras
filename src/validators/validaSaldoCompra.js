function validaSaldoCompra(saldoInicialCompra, saldoFornecido, itens_fornecimento) {
  let resultValidaSaldo = true;
  const itensSemSaldo = [];
  const itensSaldoFinal = [];

  itens_fornecimento.forEach((itemFornecimento) => {
    const idItemFornecimento = itemFornecimento.id_produto;
    const quantidadeItemFornecimento = itemFornecimento.quantidade;
    let quantidadeFornecidaItem = 0;
    let saldoInicialItemCompra = 0;

    saldoInicialCompra.forEach((itemCompra) => {
      if (itemCompra.dataValues.id_produto === idItemFornecimento) {
        saldoInicialItemCompra = itemCompra.dataValues.quantidade;
      }
    });

    saldoFornecido.forEach((itemFornecido) => {
      if (itemFornecido.dataValues.id_produto === idItemFornecimento) {
        quantidadeFornecidaItem = itemFornecido.dataValues.total_quantidade_fornecida;
      }
    });

    const quantidadeDisponivelItem = saldoInicialItemCompra - quantidadeFornecidaItem;
    const saldoItem = quantidadeDisponivelItem - quantidadeItemFornecimento;

    const quantidadeDisponivelItemArred = Number(quantidadeDisponivelItem.toFixed(2));
    const saldoItemArred = Number(saldoItem.toFixed(2));

    console.log(quantidadeDisponivelItemArred, saldoItemArred);

    if (saldoItem < 0) {
      resultValidaSaldo = false;
      itensSemSaldo.push({ id_produto: idItemFornecimento, quantidade: saldoItemArred });
    } else {
      itensSaldoFinal.push({ id_produto: idItemFornecimento, quantidade: saldoItemArred });
    }
  });

  return { resultValidaSaldo, itensSemSaldo, itensSaldoFinal };
}
export default validaSaldoCompra;
