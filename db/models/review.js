'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Review.belongsTo(models.Book, {foreignKey: 'bookId'});
      Review.belongsTo(models.User, {foreignKey: 'userId'});
    }
  };
  Review.init({
    content: {
      allowNull: false,
        type: DataTypes.TEXT,
        validate: {
          notEmpty: true
        }
    },
    rating: {
      type: DataTypes.INTEGER,
      validate: {
        min: 0,
        max: 5
      }
    },
    bookId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: 'Books'
      }
    },
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: 'Reviews'
      }
    }
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};
