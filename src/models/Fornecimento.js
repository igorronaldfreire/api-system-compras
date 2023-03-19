import Sequelize, { Model } from 'sequelize';

export default class Fornecimento extends Model {
  static init(sequelize) {
    super.init(
      {
        numero: {
          type: Sequelize.NUMBER,
          defaultValue: '',
          allowNull: false,
          unique: {
            msg: 'O numero de fornecimento informado já existe na base de dados',
          },
          validate: {
            notNull: true,
            isInt: true,
          },
        },
        data: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        descricao: {
          type: Sequelize.STRING,
          allowNull: false,
          len: {
            args: [3, 255],
            msg: 'A descrição do fornecimento deve ter entre 3 e 255 caracteres',
          },
        },

      },
      {
        sequelize,
        tableName: 'fornecimentos',
      },
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Compra, { foreignKey: 'id_compra' });
    this.belongsTo(models.PessoaFisica, { foreignKey: 'id_resp_fornecimento' });
  }
}
