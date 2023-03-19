// modulos externos
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';

// modules internos
import useRoutes from './routes/user/userRoutes';
import tokenRoutes from './routes/user/tokenRoutes';
import pessoasFisicasRoutes from './routes/pessoas/pessoasFisicasRoutes';
import pessoasJuridicasRoutes from './routes/pessoas/pessoasJuridicasRoutes';
import produtosRoutes from './routes/compras/produtosRoutes';
import comprasRoutes from './routes/compras/comprasRoutes';
import fornecimentoRoutes from './routes/compras/fornecimentoRoutes';

// configurando dotenv
dotenv.config();

import './database';

// config cors and helmet
const whiteList = [
  'http://localhost:3000',
];

const corsOptions = {
  origin(origin, callback) {
    if (whiteList.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error(`Origin not allowed by Cors: ${origin}`));
    }
  },
};

class App {
  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(helmet());
    this.app.use(cors(corsOptions));
  }

  routes() {
    // acesso
    this.app.use('/tokens/', tokenRoutes);
    this.app.use('/users/', useRoutes);

    // cadastro
    this.app.use('/pessoasfisicas/', pessoasFisicasRoutes);
    this.app.use('/pessoasjuridicas/', pessoasJuridicasRoutes);

    // compras
    this.app.use('/produtos/', produtosRoutes);
    this.app.use('/compras/', comprasRoutes);
    this.app.use('/fornecimentos/', fornecimentoRoutes);

    // fornecimentos
  }
}

export default new App().app;
