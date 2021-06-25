module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('tb_file_category', {
      id: { type: Sequelize.UUID, primaryKey: true },

      id_file: {
        type: Sequelize.UUID,
        references: {
          model: 'tb_file',
          key: 'id',
        },
      },
      id_category: {
        type: Sequelize.UUID,
        references: {
          model: 'tb_category',
          key: 'id',
        },
      },

      str_created_by: { type: Sequelize.STRING },
      str_updated_by: { type: Sequelize.STRING },
      dt_created_at: { type: Sequelize.DATE },
      dt_updated_at: { type: Sequelize.DATE },
      dt_deleted_at: { type: Sequelize.DATE },
    });
    await queryInterface.addIndex('tb_file_category', ['id_file', 'id_category']);
  },

  down: async (queryInterface) => {
    await queryInterface.removeIndex('tb_file_category', ['id_file', 'id_category']);
    await queryInterface.dropTable('tb_file_category');
  },
};
