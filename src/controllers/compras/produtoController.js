import Produto from '../../models/Produto';

class ProdutoController {
  async index(req, res) { // listando todos
    try {
      const produtos = await Produto.findAll({
        attributes: ['id', 'descricao', 'unidade'],
        order: ['id', 'descricao'],
      });
      res.json(produtos);
    } catch (e) {
      res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }

  async store(req, res) {
    try {
      const produto = req.body;

      const prodCreate = await Produto.create(produto);

      if (!prodCreate) return res.json({ errors: ['Erro ao cadastrar produto'] });

      return res.json({ prodCreate });
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
          errors: ['Informe o id do produto a Listar'],
        });
      }

      const produto = await Produto.findByPk(id);

      if (!produto) {
        return res.status(400).json({
          errors: ['O produto informado nao corresponde a nenhum produto na base dados'],
        });
      }

      return res.json(produto);
    } catch (e) {
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          errors: ['Informe o id do produto a se alterar'],
        });
      }
      const produto = await Produto.findByPk(id);

      if (!produto) {
        return res.status(400).json({
          errors: ['O produto informado nao corresponde a nenhum produto na base dados'],
        });
      }

      const produtoAtualizado = await produto.update(req.body);
      return res.json({ resultado: true, msg: 'produto editado com sucesso com sucesso' });
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
          errors: ['Informe o id do produto a se deletar'],
        });
      }
      const produto = await Produto.findByPk(id);

      if (!produto) {
        return res.status(400).json({
          errors: ['O produto informado nao corresponde a nenhum produto na base dados'],
        });
      }

      await produto.destroy();
      return res.json({ resultado: true, msg: 'produto deletado com sucesso' });
    } catch (e) {
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }
}

export default new ProdutoController();
