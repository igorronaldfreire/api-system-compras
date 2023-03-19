import Sequelize, { Model } from 'sequelize';
// import bcryptjs from 'bcryptjs';

export default class PessoaFisica extends Model {
  static init(sequelize) {
    super.init(
      {
        nome: {
          type: Sequelize.STRING,
          defaultValue: '',
          validate: {
            len: {
              args: [3, 255],
              msg: 'O nome deve ter entre 3 e 255 caracteres',
            },
          },
        },
        sobrenome: {
          type: Sequelize.STRING,
          defaultValue: '',
          validate: {
            len: {
              args: [3, 255],
              msg: 'O sobrenome deve ter entre 3 e 255 caracteres',
            },
          },
        },
        cpf: {
          type: Sequelize.STRING,
          defaultValue: '',
          unique: {
            msg: 'o CPF informado já existe na base de dados',
          },
          validate: {
            len: {
              args: [10, 11],
              msg: 'O cpf deve conter 11 numeros',
            },
          },
        },
        email: {
          type: Sequelize.STRING,
          defaultValue: '',
          unique: {
            msg: 'E-mail informado já existe na base de dados',
          },
          validate: {
            isEmail: {
              msg: 'E-mail invalido',
            },
          },
        },

      },
      {
        sequelize,
        tableName: 'pessoafisicas',
      },
    );
    return this;
  }

  // static associate(models) {
  //   this.hasMany(models.User, { foreignKey: 'id_pessoa' });
  // }
}
