import sequelize, { Op } from 'sequelize';

import Fornecimento from '../../models/Fornecimento';
import Fornecimentoitem from '../../models/FornecimentoItem';
import Compraitem from '../../models/CompraItem';
import Compra from '../../models/Compra';
import validaSaldoCompra from '../../validators/validaSaldoCompra';
import formataDataISO from '../../utils/formatDataISO';
import formatarDataISOBr from '../../utils/formatDataBr';

class FornecimentoController {
  async index(req, res) {
    try {
      const fornecimentos = await Fornecimento.findAll({
        attributes:
        ['id', 'numero', 'data', 'id_resp_fornecimento', 'id_compra', 'descricao'],
        order: ['numero'],
      });

      if (!fornecimentos) res.status(400).json('erro ao recuperar fornecimentos, refaça processo');

      return res.status(200).json(fornecimentos);
    } catch (e) {
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }

  async store(req, res) {
    try {
      const {
        numero, data, descricao, id_resp_fornecimento, id_compra, itens_fornecimento,
      } = req.body;

      // formataçoes

      const dataFormatada = formataDataISO(data);

      // validaçoes da compra informada

      const dadosCompra = await Compra.findAll({
        where: {
          id: id_compra,
        },
        attributes: ['id', 'numero', 'data'],
      });

      if (!dadosCompra || dadosCompra.length <= 0) return res.json('o Id da compra informado não foi localizado na base de dados');

      const saldoInicialCompra = await Compraitem.findAll({
        where: {
          id_compra,
        },
        attributes: ['id_compra', 'id_produto', 'quantidade'],
        order: ['id_produto'],
      });

      // validaçoes do fornecimento
      // validaçao de fornecimento: saldo de itens

      if (formatarDataISOBr(dadosCompra[0].data) > data) return res.json('A data do fornecimento deve ser maior que a data da compra');

      if (itens_fornecimento.length === 0) return res.json('Informe pelo menos um item pertencente ao fornecimento');

      const saldoFornecido = await Fornecimentoitem.findAll({
        where: { id_compra },
        attributes: [
          'id_produto',
          [sequelize.fn('sum', sequelize.col('quantidade')), 'total_quantidade_fornecida'],
        ],
        group: ['id_produto'],
        order: ['id_produto'],
      });

      const itens_compra = [];
      const itens_fornec = [];
      const itensInexistentesCompra = [];

      saldoInicialCompra.forEach((element) => {
        itens_compra.push(element.id_produto);
      });
      itens_fornecimento.forEach((element) => {
        itens_fornec.push(element.id_produto);
      });

      // verificando se o item pertence a compra

      const itens_compra_comp = JSON.stringify(itens_compra);

      itens_fornec.forEach((element) => {
        if (!itens_compra_comp.includes(element)) {
          itensInexistentesCompra.push(element);
        }
      });

      if (itensInexistentesCompra.length > 0) return res.status(400).json(`Os itens  de numero: ${itensInexistentesCompra} não pertence a compra informada`);

      // validando o saldo da compra

      // eslint-disable-next-line max-len
      const { resultValidaSaldo, itensSemSaldo } = validaSaldoCompra(saldoInicialCompra, saldoFornecido, itens_fornecimento);

      if (!resultValidaSaldo) return res.status(400).json({ itensSemSaldo });

      // cadastrando fornecimento

      const fornecimento = await Fornecimento.create({
        numero,
        data: dataFormatada,
        descricao,
        id_compra,
        id_resp_fornecimento,
      });

      if (!fornecimento) return res.json('Erro ao cadastrar fornecimento, refaça o processo');

      itens_fornecimento.forEach((item) => {
        item.id_fornecimento = fornecimento.id;
        item.id_compra = id_compra;
      });

      const itensFornecimento = await Fornecimentoitem.bulkCreate(itens_fornecimento);

      if (!itensFornecimento) {
        await Fornecimento.destroy({ where: { id: fornecimento.id } });
        return res.json('Erro ao cadastrar fornecimento, refaça o processo ');
      }

      return res.status(200).json({ resultado: true, msg: 'fornecimento cadastrado com sucesso' });
    } catch (e) {
      console.log(e);
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }

  async show(req, res) {
    try {
      const { id } = req.params;

      if (!id) return res.status(400).json({ errors: ['Informe o id do fornecimento a se Listar'] });

      const fornecimento = await Fornecimento.findByPk(id);
      const fornecimentoItens = await Fornecimentoitem.findAll({
        where: { id_fornecimento: id },
        attributes: ['id', 'id_produto', 'quantidade', 'valor'],
        order: ['id'],
      });

      if (!fornecimento || !fornecimentoItens) return res.status(400).json({ errors: ['O codigo do fornecimento informado não corresponde a nenhuma compra na base de dados'] });

      return res.status(200).json({ fornecimento, fornecimentoItens });
    } catch (e) {
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }

  async update(req, res) {
    try {
      // recuperando o fornecimento a editar
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          errors: ['Informe o id do fornecimento a se alterar'],
        });
      }
      const fornecimento = await Fornecimento.findByPk(id);
      const itensFornecimento = await Fornecimentoitem.findAll({
        where: { id_fornecimento: id },
      });

      if (!fornecimento || !itensFornecimento) {
        return res.status(400).json({
          errors: ['Impossivel recuperar os dados do fornecimento de id informado, refaça o processo para ediçao'],
        });
      }

      const {
        numero, data, descricao, id_resp_fornecimento, id_compra, itens_fornecimento,
      } = req.body;

      // formataçoes

      const dataFormatada = formataDataISO(data);

      // validaçoes da compra informada

      const dadosCompra = await Compra.findAll({
        where: {
          id: id_compra,
        },
        attributes: ['id', 'numero', 'data'],
      });

      if (!dadosCompra || dadosCompra.length <= 0) return res.json('o Id da compra informado não foi localizado na base de dados');

      const saldoInicialCompra = await Compraitem.findAll({
        where: {
          id_compra,
        },
        attributes: ['id_compra', 'id_produto', 'quantidade'],
        order: ['id_produto'],
      });

      // validaçoes do fornecimento
      // validaçao de fornecimento: saldo de itens

      if (formatarDataISOBr(dadosCompra[0].data) > data) return res.json('A data do fornecimento deve ser maior que a data da compra');

      if (itens_fornecimento.length === 0) return res.json('Informe pelo menos um item pertencente ao fornecimento');

      const saldoFornecido = await Fornecimentoitem.findAll({
        where: {
          id_compra,
          id_fornecimento: {
            [Op.ne]: id,
          },
        },
        attributes: [
          'id_produto',
          [sequelize.fn('sum', sequelize.col('quantidade')), 'total_quantidade_fornecida'],
        ],
        group: ['id_produto'],
        order: ['id_produto'],
      });

      const itens_compra = [];
      const itens_fornec = [];
      const itensInexistentesCompra = [];

      saldoInicialCompra.forEach((element) => {
        itens_compra.push(element.id_produto);
      });
      itens_fornecimento.forEach((element) => {
        itens_fornec.push(element.id_produto);
      });

      // verificando se o item pertence a compra

      const itens_compra_comp = JSON.stringify(itens_compra);

      itens_fornec.forEach((element) => {
        if (!itens_compra_comp.includes(element)) {
          itensInexistentesCompra.push(element);
        }
      });

      console.log(saldoFornecido);

      if (itensInexistentesCompra.length > 0) return res.status(400).json(`Os itens  de numero: ${itensInexistentesCompra} não pertence a compra informada`);

      // validando o saldo da compra

      // eslint-disable-next-line max-len
      const { resultValidaSaldo, itensSemSaldo } = validaSaldoCompra(saldoInicialCompra, saldoFornecido, itens_fornecimento);

      if (!resultValidaSaldo) return res.status(400).json({ itensSemSaldo });

      // removendo fornecimento antigo

      await Fornecimentoitem.destroy({ where: { id_fornecimento: id } });
      await Fornecimento.destroy({ where: { id } });

      // cadastrando fornecimento

      const fornecimentoAlterado = await Fornecimento.create({
        numero,
        data: dataFormatada,
        descricao,
        id_compra,
        id_resp_fornecimento,
      });

      if (!fornecimentoAlterado) return res.json('Erro ao cadastrar fornecimento, refaça o processo');

      itens_fornecimento.forEach((item) => {
        item.id_fornecimento = fornecimentoAlterado.id;
        item.id_compra = id_compra;
      });

      const itensFornecimentoAlterado = await Fornecimentoitem.bulkCreate(itens_fornecimento);

      if (!itensFornecimentoAlterado) {
        await Fornecimento.destroy({ where: { id: fornecimentoAlterado.id } });
        return res.json('Erro ao cadastrar fornecimento, refaça o processo ');
      }

      return res.status(200).json({ resultado: true, msg: 'fornecimento editado com sucesso' });
    } catch (e) {
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          errors: ['Informe o id do fornecimento a se deletar'],
        });
      }
      const fornecimento = await Fornecimento.findByPk(id);
      const itensFornecimento = await Fornecimentoitem.findAll({
        where: { id_fornecimento: id },
      });

      if (!fornecimento || !itensFornecimento) {
        return res.status(400).json({
          errors: ['Impossivel recuperar os dados do fornecimento de id informado, refaça o processo para deleção'],
        });
      }

      await Fornecimentoitem.destroy({ where: { id_fornecimento: id } });
      await Fornecimento.destroy({ where: { id } });
      return res.status(200).json({ resultado: true, msg: 'fornecimento deletado com sucesso' });
    } catch (e) {
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }
}

export default new FornecimentoController();
