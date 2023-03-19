import PessoaFisica from '../../models/PessoaFisica';
import ValidaCpf from '../../validators/validaCpf';

class PessoaFisicaController {
  async index(req, res) { // listando todos
    try {
      const pessoasFisicas = await PessoaFisica.findAll({
        attributes: ['id', 'cpf', 'nome', 'sobrenome', 'email'],
        order: ['id', 'nome'],
      });
      res.json(pessoasFisicas);
    } catch (e) {
      res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }

  async store(req, res) {
    try {
      const validacpf = new ValidaCpf(req.body.cpf);
      const testCpf = validacpf.valida();

      if (!testCpf) {
        return res.status(400).json({
          errors: ['CPF INVALIDO'],
        });
      }

      const pessoaFisica = await PessoaFisica.create(req.body);
      return res.json({ resultado: true, msg: 'pessoa cadastrada com sucesso' });
    } catch (e) {
      // console.log(e);
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }

  async update(req, res) { // editando
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          errors: ['Informe o id da pessoa a se alterar'],
        });
      }

      const pessoaFisica = await PessoaFisica.findByPk(id);

      if (!pessoaFisica) {
        return res.status(400).json({
          errors: ['A pessoa informada não foi localizada'],
        });
      }

      const validacpf = new ValidaCpf(req.body.cpf);
      const testCpf = validacpf.valida();

      if (!testCpf) {
        return res.status(400).json({
          errors: ['CPF INVALIDO'],
        });
      }

      const pessoaFisicaAtualizada = await pessoaFisica.update(req.body);

      return res.json({ resultado: true, msg: 'Pessoa editada com sucesso' });
    } catch (e) {
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
          errors: ['Informe o id da pessoa a Listar'],
        });
      }

      const pessoaFisica = await PessoaFisica.findByPk(id, {
        attributes: ['id', 'cpf', 'nome', 'sobrenome', 'email'],
        order: ['id', 'nome'],
      });

      if (!pessoaFisica) {
        return res.status(400).json({
          errors: ['A pessoa informada não foi localizada'],
        });
      }
      return res.json(pessoaFisica);
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
          errors: ['Informe o id da pessoa a se deletar'],
        });
      }

      const pessoaFisica = await PessoaFisica.findByPk(id);

      if (!pessoaFisica) {
        return res.status(400).json({
          errors: ['A pessoa informada não foi localizada'],
        });
      }

      await pessoaFisica.destroy();
      return res.json({ resultado: true, msg: 'pessoa deletada com sucesso' });
    } catch (e) {
      console.log(e);
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }
}

export default new PessoaFisicaController();
