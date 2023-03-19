import jwt from 'jsonwebtoken';
import User from '../models/User';

export default async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) return res.status(401).json({ errors: ['Para acessar é necessario fazer login'] });

  const [texto, token] = authorization.split(' '); // split retorna um array
  try {
    const dadosAcesso = jwt.verify(token, process.env.TOKEN_SECRET);

    const { id, usuario } = dadosAcesso;

    const user = await User.findOne({
      where: { id, usuario },
    });

    if (!user) return res.status(401).json({ errors: ['usuario invalido, refaça login'] });

    req.userId = id;
    req.userUsuario = usuario;

    return next();
  } catch (e) {
    console.log(e);
    return res.status(401).json({ errors: ['Token invalido ou expirado'] });
  }
};
