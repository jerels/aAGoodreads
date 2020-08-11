'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [
      { email: "santa@gmail.com", hashedPassword: bcrypt.hashSync('password'), firstName: "Nicholas", lastName: "Kringle" }
    ], { fields: [ 'email', 'hashedPassword', 'firstName', 'lastName'] });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
