'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Bookshelf extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Bookshelf.belongsToMany(models.Book, { through: models.BookBookshelf });
      Bookshelf.belongsTo(models.User, { foreignKey: 'userId' });
    }
  };
  Bookshelf.init({
    name: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    },
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {model: "Users"}
    },
    defaultShelf: {
      allowNull: false,
      type: DataTypes.BOOLEAN
    }
  }, {
    sequelize,
    modelName: 'Bookshelf',
  });
  return Bookshelf;
};
