import PessoaJuridica from '../../models/PessoaJuridica';
import validarCNPJ from '../../validators/validaCnpj';

class PessoaJuridicaController {
  async index(req, res) { // listando todos
    try {
      const pessoasJuridicas = await PessoaJuridica.findAll({
        attributes: ['id', 'cnpj', 'razaosocial', 'email'],
        order: ['id', 'razaosocial'],
      });
      res.json(pessoasJuridicas);
    } catch (e) {
      res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }

  async store(req, res) {
    try {
      const testCnpjValidate = validarCNPJ(req.body.cnpj);

      if (!testCnpjValidate) {
        return res.status(400).json({
          errors: ['Cnpj INVALIDO'],
        });
      }

      const pessoaJuridica = await PessoaJuridica.create(req.body);
      console.log(pessoaJuridica);

      return res.json({ resultado: true, msg: 'empresa cadastrada com sucesso' });
    } catch (e) {
      console.log(e);
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
          errors: ['Informe o id da empresa a se alterar'],
        });
      }

      const testCnpjValidate = validarCNPJ(req.body.cnpj);

      if (!testCnpjValidate) {
        return res.status(400).json({
          errors: ['Cnpj INVALIDO'],
        });
      }

      const pessoaJuridica = await PessoaJuridica.findByPk(id);

      if (!pessoaJuridica) {
        return res.status(400).json({
          errors: ['A empresa informada não foi localizada'],
        });
      }

      const pessoaJuridicaAtualizada = await pessoaJuridica.update(req.body);

      return res.json({ resultado: true, msg: 'empresa editada com sucesso' });
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

      const pessoaJuridica = await PessoaJuridica.findByPk(id, {
        attributes: ['id', 'cnpj', 'razaosocial', 'email'],
        order: ['id', 'razaosocial'],
      });

      if (!pessoaJuridica) {
        return res.status(400).json({
          errors: ['A empresa informada não foi localizada'],
        });
      }
      return res.json(pessoaJuridica);
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
          errors: ['Informe o id da empresa a se deletar'],
        });
      }

      const pessoaJuridica = await PessoaJuridica.findByPk(id);

      if (!pessoaJuridica) {
        return res.status(400).json({
          errors: ['A empresa informada não foi localizada'],
        });
      }

      await pessoaJuridica.destroy();
      return res.json({ resultado: true, msg: 'Empresa deletada com sucesso' });
    } catch (e) {
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }
}

export default new PessoaJuridicaController();
