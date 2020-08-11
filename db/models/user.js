'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Bookshelf, {foreignkey: "userId"});
      User.hasMany(models.Review, {foreignKey: 'userId'});
    }
  };
  User.init({
    email: {
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        isEmail: true
      },
      type: DataTypes.STRING(200)
    },
    username: {
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        len: {
          args: [5, 80],
          msg: "Username must be between 5 and 80 characters long."
        }
      },
      type: DataTypes.STRING(80)
    },
    hashedPassword: {
      allowNull: false,
      type: DataTypes.STRING.BINARY
    },
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
    birthday: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
