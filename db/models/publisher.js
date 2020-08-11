'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Publisher extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Publisher.hasMany(models.Book, {
        foreignKey: 'publisherId'
      });
    }
  };
  Publisher.init({
    name: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
      validate: {
        notEmpty: true
      }
    }
  }, {
    sequelize,
    modelName: 'Publisher',
  });
  return Publisher;
};
