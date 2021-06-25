export default (sequelize, DataTypes) => {
  const FileCategory = sequelize.define('FileCategory', {
    id: {
      type: DataTypes.UUID, primaryKey: true, field: 'id', defaultValue: DataTypes.UUIDV4,
    },

    fileId: { type: DataTypes.UUID, field: 'id_file' },
    categoryId: { type: DataTypes.UUID, field: 'id_category' },

    createdBy: { type: DataTypes.STRING, field: 'str_created_by' },
    updatedBy: { type: DataTypes.STRING, field: 'str_updated_by' },
    createdAt: { type: DataTypes.DATE, field: 'dt_created_at' },
    updatedAt: { type: DataTypes.DATE, field: 'dt_updated_at' },
    deletedAt: { type: DataTypes.DATE, field: 'dt_deleted_at' },
  }, {
    sequelize,
    tableName: 'tb_file_category',
    modelName: 'FileCategory',

    freezeTableName: true,
    timestamps: true,

    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: 'deletedAt',
  });

  FileCategory.associate = (models) => {
    FileCategory.belongsTo(models.Category, {
      as: 'category',
      foreignKey: 'categoryId',
    });
    FileCategory.belongsTo(models.File, {
      as: 'file',
      foreignKey: 'fileId',
    });
  };

  return FileCategory;
};
