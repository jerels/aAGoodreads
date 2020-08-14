const bcrypt = require('bcryptjs');

'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    validatePassword(password) {
      return bcrypt.compareSync(password, this.hashedPassword.toString());
    }

    static associate(models) {
      User.hasMany(models.Bookshelf, { foreignKey: 'userId' })
      User.hasMany(models.Review, { foreignKey: 'userId' });
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
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
