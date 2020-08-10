'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Author extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Author.belongsToMany(models.Series, { through: models.SeriesAuthor });
      Author.belongsToMany(models.Book, { through: models.BookAuthor });
    }
  };
  Author.init({
    firstName: {
      allowNull: false,
      validate: {
        notEmpty: true
      },
      type: DataTypes.STRING(35)
    },
    lastName: {
      allowNull: false,
      validate: {
        notEmpty: true
      },
      type: DataTypes.STRING(35)
    },
    initial: DataTypes.STRING,
    biography: {
      allowNull: false,
      validate: {
        notEmpty: true
      },
      type: DataTypes.TEXT
    }
  }, {
    sequelize,
    modelName: 'Author',
  });
  return Author;
};
