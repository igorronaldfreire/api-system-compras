import jwt from 'jsonwebtoken';
import User from '../../models/User';

class TokenController {
  async store(req, res) {
    try {
      const { usuario = '', password = '' } = req.body;

      if (!usuario || !password) {
        return res.json({ errors: ['credenciais informadas são invalidas'] });
      }

      const user = await User.findOne({ where: { usuario } });

      if (!user) {
        return res.status(401).json({ errors: ['usuario informado não encontrado'] });
      }

      if (!await user.passwordIsValid(password)) {
        return res.status(401).json({ errors: ['A senha informada é invalida'] });
      }

      const { id } = user;
      const token = jwt.sign(
        { id, usuario },
        process.env.TOKEN_SECRET,
        { expiresIn: process.env.TOKEN_EXPIRATION },
      );

      return res.json({ token, user: { usuario: user.usuario, id } });
    } catch (e) {
      return res.status(400).json({
        errors: ['Erro de geração de token, refaça o processo'],
      });
    }
  }
}

export default new TokenController();
