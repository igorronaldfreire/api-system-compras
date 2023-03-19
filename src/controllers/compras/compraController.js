import { Op } from 'sequelize';

import Compra from '../../models/Compra';
import Fornecimento from '../../models/Fornecimento';
import Compraitem from '../../models/CompraItem';
import Pessoajuridica from '../../models/PessoaJuridica';
import Pessoafisica from '../../models/PessoaFisica';
import Produto from '../../models/Produto';
import formatarDataISO from '../../utils/formatDataISO';
import formatDataBr from '../../utils/formatDataBr';

class CompraController {
  async index(req, res) {
    try {
      const compra = await Compra.findAll({
        attributes:
        ['id', 'numero', 'data', 'tipo', 'processo', 'anoprocesso', 'id_requisitor_compra', 'id_fornecedor', 'ficha', 'fonte', 'acompanhamento', 'descricao'],
        order: ['numero'],
      });

      if (!compra) return res.json('erro ao recuperar compras, refaça processo');

      return res.json(compra);
    } catch (e) {
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }

  async store(req, res) {
    try {
      const {
        numero, data, tipo, processo, anoprocesso, id_requisitor_compra,
        id_fornecedor, ficha, fonte, acompanhamento, descricao, itens_compra,
      } = req.body;

      // formatando dados
      const dataFormatada = formatarDataISO(data);

      // validando se existe fornecedor, requsitor e se produtos existem cadastrados

      const fornecedor = await Pessoajuridica.findByPk(id_fornecedor);

      if (!fornecedor) return res.json('O fornecedor informado não existe na base dados, cadastre o primeiro');

      const requisitor = await Pessoafisica.findByPk(id_requisitor_compra);

      if (!requisitor) return res.json('O requisitor informado não existe na base dados, cadastre o primeiro');

      const produtos_compra = [];
      const produtosInexistentesCompra = [];

      itens_compra.forEach((element) => {
        produtos_compra.push(Number(element.id_produto));
      });

      const produtosCadastrados = await Produto.findAll({
        where: {
          id: {
            [Op.in]: produtos_compra,
          },
        },
        attributes: ['id'],
      });

      const idProdutosCadastrados = produtosCadastrados.map((produto) => produto.dataValues.id);

      produtos_compra.forEach((item) => {
        if (!idProdutosCadastrados.includes(item)) {
          produtosInexistentesCompra.push(item);
        }
      });

      if (produtosInexistentesCompra.length > 0) return res.status(400).json(`Os itens  de numero: ${produtosInexistentesCompra} não xistem, cadastre os primeiramente`);

      // validando - cadastrando compra

      const compra = await Compra.create({
        numero,
        data: dataFormatada,
        tipo,
        processo,
        anoprocesso,
        id_requisitor_compra,
        id_fornecedor,
        ficha,
        fonte,
        acompanhamento,
        descricao,
      });

      if (!compra) return res.status(400).json('Erro ao cadastrar compra, refaça o processo');

      itens_compra.forEach((item) => {
        item.id_compra = compra.id;
      });

      const itensCompra = await Compraitem.bulkCreate(itens_compra);

      if (!itensCompra) {
        await compra.destroy();
        return res.json('Erro ao cadastrar compra, refaça o processo');
      }

      return res.json({ resultado: true, msg: 'compra inserida com sucesso' });
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

      if (!id) {
        return res.status(400).json({
          errors: ['Informe o id da compra a se Listar'],
        });
      }

      const compra = await Compra.findByPk(id);
      const itensCompra = await Compraitem.findAll({ where: { id_compra: id }, order: ['id'] });
      if (!compra || !itensCompra) {
        return res.status(400).json({
          errors: ['O codigo de compra informado não corresponde a nenhuma compra na base de dados'],
        });
      }

      return res.json({
        compra, itensCompra,
      });
    } catch (e) {
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }

  async update(req, res) {
    try {
      // recuperando a compra a editar
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          errors: ['Informe o id da compra a se alterar'],
        });
      }
      const compra = await Compra.findByPk(id);
      const itensCompra = await Compraitem.findAll({
        where: { id_compra: id },
      });

      if (!compra || !itensCompra) {
        return res.status(400).json({
          errors: ['Impossivel recuperar os dados da compra de id informado, refaça o processo para ediçao'],
        });
      }

      // verificando se ja esta fornecida

      const fornecimentosCompra = await Fornecimento.findAll({
        where: { id_compra: id },
        attributes:
        ['id'],
      });

      const idFornecimentosCompraCadastrados = fornecimentosCompra.map((fornecimento) => fornecimento.dataValues.id);

      if (idFornecimentosCompraCadastrados.length > 0) return res.json(`Impossivel editar compra, compra já fornecida. Fornecimentos da compra: ${idFornecimentosCompraCadastrados}`);

      const {
        numero, data, tipo, processo, anoprocesso, id_requisitor_compra,
        id_fornecedor, ficha, fonte, acompanhamento, descricao, itens_compra,
      } = req.body;

      // formatando dados

      const dataFormatada = formatarDataISO(data);

      // validando se existe fornecedor, requsitor e se produtos existem cadastrados

      const fornecedor = await Pessoajuridica.findByPk(id_fornecedor);

      if (!fornecedor) return res.json('O fornecedor informado não existe na base dados, cadastre o primeiro');

      const requisitor = await Pessoafisica.findByPk(id_requisitor_compra);

      if (!requisitor) return res.json('O requisitor informado não existe na base dados, cadastre o primeiro');

      const produtos_compra = [];
      const produtosInexistentesCompra = [];

      itens_compra.forEach((element) => {
        produtos_compra.push(Number(element.id_produto));
      });

      const produtosCadastrados = await Produto.findAll({
        where: {
          id: {
            [Op.in]: produtos_compra,
          },
        },
        attributes: ['id'],
      });

      const idProdutosCadastrados = produtosCadastrados.map((produto) => produto.dataValues.id);

      produtos_compra.forEach((item) => {
        if (!idProdutosCadastrados.includes(item)) {
          produtosInexistentesCompra.push(item);
        }
      });

      if (produtosInexistentesCompra.length > 0) return res.status(400).json(`Os itens  de numero: ${produtosInexistentesCompra} não existem, cadastre os primeiramente`);

      await Compraitem.destroy({ where: { id_compra: id } });
      await Compra.destroy({ where: { id } });

      const compraEditada = await Compra.create({
        numero,
        data: dataFormatada,
        tipo,
        processo,
        anoprocesso,
        id_requisitor_compra,
        id_fornecedor,
        ficha,
        fonte,
        acompanhamento,
        descricao,
      });

      if (!compraEditada) return res.status(400).json('Erro ao editar compra, refaça o processo');

      itens_compra.forEach((item) => {
        item.id_compra = compraEditada.id;
      });

      const itensCompraEditada = await Compraitem.bulkCreate(itens_compra);

      if (!itensCompraEditada) {
        await compra.destroy();
        return res.json('Erro ao editar compra, refaça o processo');
      }

      return res.json({ resultado: true, msg: 'compra editada com sucesso' });
    } catch (e) {
      console.log(e);
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
          errors: ['Informe o id da comrpa a se deletar'],
        });
      }
      const compra = await Compra.findByPk(id);
      const itensCompra = await Compraitem.findAll({
        where: { id_compra: id },
      });

      if (!compra || !itensCompra) {
        return res.status(400).json({
          errors: ['Impossivel recuperar os dados da compra de id informado, refaça o processo para deleção'],
        });
      }

      const testeExistFornecimento = await Fornecimento.findAll({ where: { id_compra: id } });

      if (testeExistFornecimento.length > 0) return res.json('Impossivel deletar compra, compra já fornecida');

      await Compraitem.destroy({ where: { id_compra: id } });
      await Compra.destroy({ where: { id } });
      return res.json({ resultado: true, msg: 'compra deletada com sucesso' });
    } catch (e) {
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }
}

export default new CompraController();
