import User from '../../models/User';

class UserController {
  async index(req, res) {
    try {
      const users = await User.findAll({ attributes: ['id', 'id_pessoa', 'usuario'] });
      return res.status(200).json(users);
    } catch (e) {
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }

  async store(req, res) {
    try {
      const user = await User.create(req.body, { attributes: ['id', 'id_pessoa', 'usuario'] });
      return res.status(200).json({ resultado: true, msg: 'Usuario cadastrado com sucesso' });
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
          errors: ['Informe o id do usuario a Listar'],
        });
      }

      const user = await User.findByPk(id, { attributes: ['id', 'id_pessoa', 'usuario'] });

      if (!user) {
        return res.status(400).json({
          errors: ['Usuario informado nao foi localizado na base de dados'],
        });
      }

      return res.json(user);
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
          errors: ['Informe o id do usuario a se alterar'],
        });
      }

      const user = await User.findByPk(id);

      if (!user) {
        return res.status(400).json({
          errors: ['O usuario informado não foi localizado'],
        });
      }

      const userAlterado = await user.update(req.body);

      return res.status(200).json({ resultado: true, msg: 'usuario cadastrado com sucesso' });
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
          errors: ['Informe o id do usuario a se deletar'],
        });
      }

      const user = await User.findByPk(id);

      if (!user) {
        return res.status(400).json({
          errors: ['O usuario informado não foi localizado'],
        });
      }

      await user.destroy();
      return res.status(200).json({ resultado: true, msg: 'usuario deletado com sucesso' });
    } catch (e) {
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }
}

export default new UserController();
