'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SeriesAuthor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  SeriesAuthor.init({
    genreId: DataTypes.INTEGER,
    author: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'SeriesAuthor',
  });
  return SeriesAuthor;
};