const sequelize = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('compras', {
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
      tipo: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      processo: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      anoprocesso: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      id_requisitor_compra: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'pessoafisicas',
          key: 'id',
        },
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT',
      },
      id_fornecedor: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'pessoajuridicas',
          key: 'id',
        },
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT',
      },
      ficha: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      fonte: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      acompanhamento: {
        type: Sequelize.INTEGER,
        allowNull: false,
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
    await queryInterface.dropTable('compras');
  },
};
