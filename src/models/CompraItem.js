import Sequelize, { Model } from 'sequelize';

export default class Compraitem extends Model {
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
        tableName: 'compra_itens',
        indexes: [
          { fields: ['id_compra', 'id_produto'], unique: true },
        ],
      },
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Compra, { foreignKey: 'id_compra' });
    this.belongsTo(models.Produto, { foreignKey: 'id_produto' });
  }
}
