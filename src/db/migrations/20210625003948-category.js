module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('tb_category', {
      id: { type: Sequelize.UUID, primaryKey: true },
      str_title: { type: Sequelize.STRING },

      str_created_by: { type: Sequelize.STRING },
      str_updated_by: { type: Sequelize.STRING },
      dt_created_at: { type: Sequelize.DATE },
      dt_updated_at: { type: Sequelize.DATE },
      dt_deleted_at: { type: Sequelize.DATE },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('tb_category');
  },
};
