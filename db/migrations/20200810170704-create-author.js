'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Authors', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstName: {
        allowNull: false,
        validate: {
          notEmpty: true
        },
        type: Sequelize.STRING(35)
      },
      lastName: {
        allowNull: false,
        validate: {
          notEmpty: true
        },
        type: Sequelize.STRING(35)
      },
      initial: {
        type: Sequelize.STRING(5)
      },
      biography: {
        allowNull: false,
        validate: {
          notEmpty: true
        },
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Authors');
  }
};
