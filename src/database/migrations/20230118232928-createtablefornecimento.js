const sequelize = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('fornecimentos', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false, // nao é permitido null
        autoIncrement: true,
        primaryKey: true,
      },
      numero: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
      },
      data: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      id_resp_fornecimento: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'pessoafisicas',
          key: 'id',
        },
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT',
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
      },
      descricao: {
        type: Sequelize.STRING,
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
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('fornecimentos');
  },
};
