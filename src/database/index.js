import Sequelize from 'sequelize';
import dataBaseConfig from '../config/dataBaseConfig';

import PessoaFisica from '../models/PessoaFisica';
import PessoaJuridica from '../models/PessoaJuridica';
import User from '../models/User';
import Produto from '../models/Produto';
import Compra from '../models/Compra';
import Compraitem from '../models/CompraItem';
import Fornecimento from '../models/Fornecimento';
import Fornecimentoitem from '../models/FornecimentoItem';

const models = [PessoaFisica, User, PessoaJuridica,
  Produto, Compra, Compraitem, Fornecimento, Fornecimentoitem];

const connection = new Sequelize(dataBaseConfig);

models.forEach((model) => model.init(connection));
models.forEach((model) => model.associate && model.associate(connection.models));
