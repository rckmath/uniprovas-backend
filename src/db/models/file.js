export default (sequelize, DataTypes) => {
  const File = sequelize.define('File', {
    id: {
      type: DataTypes.UUID, primaryKey: true, field: 'id', defaultValue: DataTypes.UUIDV4,
    },

    userId: { type: DataTypes.UUID, field: 'id_user' },

    url: { type: DataTypes.STRING, field: 'str_url' },
    name: { type: DataTypes.STRING, field: 'str_name' },
    title: { type: DataTypes.STRING, field: 'str_title' },
    mimeType: { type: DataTypes.STRING, field: 'str_mime_type' },
    extension: { type: DataTypes.STRING, field: 'str_extension' },

    size: { type: DataTypes.BIGINT, field: 'int_size' },
    upVotes: { type: DataTypes.INTEGER, field: 'int_up_votes', defaultValue: 0 },
    downloadCount: { type: DataTypes.INTEGER, field: 'int_download_count', defaultValue: 0 },

    description: { type: DataTypes.TEXT, field: 'txt_description' },
    hide: { type: DataTypes.BOOLEAN, field: 'bool_hide', defaultValue: false },

    createdBy: { type: DataTypes.STRING, field: 'str_created_by' },
    updatedBy: { type: DataTypes.STRING, field: 'str_updated_by' },
    createdAt: { type: DataTypes.DATE, field: 'dt_created_at' },
    updatedAt: { type: DataTypes.DATE, field: 'dt_updated_at' },
    deletedAt: { type: DataTypes.DATE, field: 'dt_deleted_at' },
  }, {
    sequelize,
    tableName: 'tb_file',
    modelName: 'File',

    freezeTableName: true,
    timestamps: true,

    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: 'deletedAt',
  });

  File.associate = (models) => {
    File.belongsTo(models.User, {
      as: 'publisher',
      foreignKey: 'userId',
    });
  };

  return File;
};
