export default (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    id: {
      type: DataTypes.UUID, primaryKey: true, field: 'id', defaultValue: DataTypes.UUIDV4,
    },

    title: { type: DataTypes.STRING, field: 'str_title' },

    createdBy: { type: DataTypes.STRING, field: 'str_created_by' },
    updatedBy: { type: DataTypes.STRING, field: 'str_updated_by' },
    createdAt: { type: DataTypes.DATE, field: 'dt_created_at' },
    updatedAt: { type: DataTypes.DATE, field: 'dt_updated_at' },
    deletedAt: { type: DataTypes.DATE, field: 'dt_deleted_at' },
  }, {
    sequelize,
    tableName: 'tb_category',
    modelName: 'Category',

    freezeTableName: true,
    timestamps: true,

    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: 'deletedAt',
  });

  Category.associate = (models) => {
    Category.hasOne(models.FileCategory, {
      as: 'fileCategory',
      foreignKey: 'categoryId',
    });
    Category.belongsToMany(models.File, {
      as: 'files',
      foreignKey: 'categoryId',
      through: {
        model: models.FileCategory,
        as: 'fileCategory',
      },
    });
  };

  return Category;
};
