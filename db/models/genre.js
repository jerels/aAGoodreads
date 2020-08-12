'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Genre extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Genre.belongsToMany(models.Book, { through: models.BookGenre, foreignKey: 'genreId', otherKey: 'bookId' });
      Genre.belongsToMany(models.Series, { through: models.SeriesGenre, foreignKey: 'genreId', otherKey: 'seriesId' });
    }
  };
  Genre.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }

    }
  }, {
    sequelize,
    modelName: 'Genre',
  });
  return Genre;
};
