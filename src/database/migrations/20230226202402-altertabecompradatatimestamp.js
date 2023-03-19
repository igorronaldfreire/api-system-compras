module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn(
      'compras',
      'data',
      {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
    );
  },

  down: async () => {
  },
};
