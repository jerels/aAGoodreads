'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Book.belongsToMany(models.Author, { through: models.BookAuthor, foreignKey: 'bookId', otherKey: 'authorId' });
      Book.belongsToMany(models.Genre, { through: models.BookGenre, foreignKey: 'bookId', otherKey: 'genreId' });
      Book.belongsToMany(models.Bookshelf, { through: models.BookBookshelf, foreignKey: 'bookId', otherKey: 'bookshelfId' });
      Book.belongsTo(models.Publisher, { foreignKey: 'publisherId' });
      Book.belongsTo(models.Series, { foreignKey: 'seriesId' });
      Book.hasMany(models.Review, { foreignKey: 'bookId' });
    }
  };
  Book.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    summary: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    cover: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    ISBN: {
      type: DataTypes.STRING(26),
      allowNull: false
    },
    publishingDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    publisherId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    seriesId: {
      type: DataTypes.INTEGER
    }
  }, {
    sequelize,
    modelName: 'Book',
  });
  return Book;
};
