'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [
      {email: "santa@gmail.com", username: "Santa", hashedPassword: bcrypt.hashSync('password'), firstName: "Nicholas", lastName: "Kringle"}
    ], {fields: ['username', 'email', 'hashedPassword', 'firstName', 'lastName']});
  },

  down: async (queryInterface, Sequelize) => {
     await queryInterface.bulkDelete('Users', null, {});
  }
};
