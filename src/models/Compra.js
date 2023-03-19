import Sequelize, { Model } from 'sequelize';

export default class Compra extends Model {
  static init(sequelize) {
    super.init(
      {
        numero: {
          type: Sequelize.NUMBER,
          defaultValue: '',
          allowNull: false,
          unique: {
            msg: 'O numero de compra informado já existe na base de dados',
          },
          validate: {
            notNull: true,
            isInt: true,
          },
        },
        data: {
          type: Sequelize.DATE,
          defaultValue: '',
        },
        tipo: {
          type: Sequelize.STRING,
          validate: {
            isIn: {
              args: [['estimativo', 'ordinario', 'global']],
              msg: 'O tipo da compa deve ser: estimativo, ordinario ou global',
            },
          },
        },
        processo: {
          type: Sequelize.NUMBER,
          defaultValue: '',
          allowNull: false,
          validate: {
            notNull: true,
            isInt: true,
          },
        },
        anoprocesso: {
          type: Sequelize.NUMBER,
          defaultValue: '',
          allowNull: false,
          validate: {
            notNull: true,
            isInt: true,
            min: 1900,
          },
        },

        ficha: {
          type: Sequelize.NUMBER,
          defaultValue: '',
          allowNull: false,
          validate: {
            notNull: true,
            isInt: true,
            min: 0,
          },
        },
        fonte: {
          type: Sequelize.NUMBER,
          defaultValue: '',
          allowNull: false,
          validate: {
            notNull: true,
            isInt: true,
            min: 1500,
          },
        },
        acompanhamento: {
          type: Sequelize.NUMBER,
          defaultValue: '',
          allowNull: false,
          validate: {
            notNull: true,
            isInt: true,
            min: 1000,
          },
        },
        descricao: {
          type: Sequelize.STRING,
          len: {
            args: [3, 255],
            msg: 'A descrição da unidade de medida deve ter entre 3 e 255 caracteres',
          },
        },

      },
      {
        sequelize,
        tableName: 'compras',
      },
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.PessoaFisica, { foreignKey: 'id_requisitor_compra' });
    this.belongsTo(models.PessoaJuridica, { foreignKey: 'id_fornecedor' });
  }
}
