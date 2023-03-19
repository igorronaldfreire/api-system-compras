const sequelize = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('fornecimento_itens', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false, // nao é permitido null
        autoIncrement: true,
        primaryKey: true,
      },
      id_compra: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'compras',
          key: 'id',
        },
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT',
        unique: 'prod_unique',
      },
      id_fornecimento: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'fornecimentos',
          key: 'id',
        },
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT',
        unique: 'prod_unique',
      },
      id_produto: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'produtos',
          key: 'id',
        },
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT',
        unique: 'prod_unique',
      },
      quantidade: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      valor: {
        type: Sequelize.REAL,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    }, {
      uniqueKeys: {
        prod_unique: {
          fields: ['id_compra', 'id_fornecimento', 'id_produto'],
        },
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('fornecimento_itens');
  },
};
