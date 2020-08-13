'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Series extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Series.belongsToMany(models.Author, { through: models.SeriesAuthor, foreignKey: 'seriesId', otherKey: 'authorId' });
      Series.belongsToMany(models.Genre, { through: models.SeriesGenre, foreignKey: 'seriesId', otherKey: 'genreId' });
      Series.hasMany(models.Book, { foreignKey: 'seriesId' });
    }
  };
  Series.init({
    name: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    }
  }, {
    sequelize,
    modelName: 'Series',
  });
  return Series;
};
