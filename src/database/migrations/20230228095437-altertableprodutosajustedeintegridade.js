module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn(
      'produtos',
      'descricao',
      {
        type: Sequelize.STRING,
        allowNull: false,
        unique: 'prod_unique',
      },
    );

    await queryInterface.changeColumn(
      'produtos',
      'unidade',
      {
        type: Sequelize.STRING,
        allowNull: false,
        unique: 'prod_unique',
      },
    );

    await queryInterface.addConstraint('produtos', {
      fields: ['descricao', 'unidade'],
      type: 'unique',
      name: 'prod_unique',
    });
  },

  async down() {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
