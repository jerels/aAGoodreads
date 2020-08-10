'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SeriesGenre extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  SeriesGenre.init({
    genreId: DataTypes.INTEGER,
    seriesId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'SeriesGenre',
  });
  return SeriesGenre;
};