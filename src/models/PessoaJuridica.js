import Sequelize, { Model } from 'sequelize';
// import bcryptjs from 'bcryptjs';

export default class PessoaJuridica extends Model {
  static init(sequelize) {
    super.init(
      {
        razaosocial: {
          type: Sequelize.STRING,
          defaultValue: '',
          validate: {
            len: {
              args: [3, 255],
              msg: 'O nome da empresa deve ter entre 3 e 255 caracteres',
            },
          },
        },
        cnpj: {
          type: Sequelize.STRING,
          defaultValue: '',
          unique: {
            msg: 'o CNPJ informado já existe na base de dados',
          },
          validate: {
            len: {
              args: [13, 14],
              msg: 'O CNPJ deve conter 14 numeros',
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
        tableName: 'pessoajuridicas',
      },
    );
    return this;
  }

  // static associate(models) {
  //   this.hasMany(models.User, { foreignKey: 'id_pessoa' });
  // }
}
