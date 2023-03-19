import Sequelize, { Model } from 'sequelize';

export default class Fornecimentoitem extends Model {
  static init(sequelize) {
    super.init(
      {
        quantidade: {
          type: Sequelize.NUMBER,
          defaultValue: '',
          allowNull: false,
        },
        valor: {
          type: Sequelize.NUMBER,
          defaultValue: '',
          allowNull: false,
        },

      },
      {
        sequelize,
        tableName: 'fornecimento_itens',
        indexes: [
          { fields: ['id_compra', 'id_fornecimento', 'id_produto'], unique: true },
        ],
      },
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Fornecimento, { foreignKey: 'id_fornecimento' });
    this.belongsTo(models.Produto, { foreignKey: 'id_produto' });
    this.belongsTo(models.Compra, { foreignKey: 'id_compra' });
  }
}
