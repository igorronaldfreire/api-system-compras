import Sequelize, { Model } from 'sequelize';
import bcryptjs from 'bcryptjs';

export default class User extends Model {
  static init(sequelize) {
    super.init({
      usuario: {
        type: Sequelize.STRING,
        defaultValue: '',
        unique: {
          msg: 'O usuario informado já existe',
        },
        validate: {
          len: {
            args: [3, 11],
            msg: 'O campo usuario deve ter entre 3 e 11 caracteres',
          },
        },
      },

      password_hash: {
        type: Sequelize.STRING,
        defaultValue: '',
      },

      password: {
        type: Sequelize.VIRTUAL,
        defaultValue: '',
        validate: {
          len: {
            args: [6, 50],
            msg: 'O campo senha deve ter entre 6 e 50 caracteres',
          }, // instrução do bcrypt
        },
      },

    }, {
      sequelize,
      tableName: 'users',
    });

    this.addHook('beforeSave', async (user) => {
      if (user.password) { // tenho que garantir a existencia da senha, se nao da erro
        user.password_hash = await bcryptjs.hash(user.password, 8); // O parametro 8 tamanho do salt
      }
    }); // adicionando um hook do bcrypt para inserir hash na senha, a funçao é uma promisse

    return this;
  }

  passwordIsValid(password) { // recebendo a senha do tokenController e comparando com bcrypt
    return bcryptjs.compare(password, this.password_hash);
  }

  static associate(models) {
    this.belongsTo(models.PessoaFisica, { foreignKey: 'id_pessoa' });
  }
}
