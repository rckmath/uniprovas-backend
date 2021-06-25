module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('tb_file', {
      id: { type: Sequelize.UUID, primaryKey: true },

      id_user: {
        type: Sequelize.UUID,
        references: {
          model: 'tb_user',
          key: 'id',
        },
      },

      str_url: { type: Sequelize.STRING },
      str_name: { type: Sequelize.STRING },
      str_title: { type: Sequelize.STRING },
      str_timestamp: { type: Sequelize.STRING },
      str_mime_type: { type: Sequelize.STRING },
      str_extension: { type: Sequelize.STRING },

      int_size: { type: Sequelize.BIGINT },
      int_up_votes: { type: Sequelize.INTEGER },
      int_download_count: { type: Sequelize.INTEGER },

      bool_hide: { type: Sequelize.BOOLEAN },
      txt_description: { type: Sequelize.TEXT },

      str_created_by: { type: Sequelize.STRING },
      str_updated_by: { type: Sequelize.STRING },
      dt_created_at: { type: Sequelize.DATE },
      dt_updated_at: { type: Sequelize.DATE },
      dt_deleted_at: { type: Sequelize.DATE },
    });

    await queryInterface.addIndex('tb_file', ['id_user']);
  },

  down: async (queryInterface) => {
    await queryInterface.removeIndex('tb_file', ['id_user']);
    await queryInterface.dropTable('tb_user');
  },
};
