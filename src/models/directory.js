const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Directory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // eslint-disable-next-line no-unused-vars
    static associate(models) {
      Directory.belongsTo(models.User, {
        foreignKey: 'createdById',
        onDelete: 'CASCADE',
      })
    }
  }
  Directory.init(
    {
      name: DataTypes.STRING,
      parent: DataTypes.STRING,
      createdById: DataTypes.INTEGER,
      pathType: DataTypes.ENUM('Folder', 'File'),
    },
    {
      sequelize,
      modelName: 'Directory',
    }
  )
  return Directory
}
