'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Series', [
      {name: "Harry Potter",  createdAt: new Date(), updatedAt: new Date()}
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Series', null, {});
  }
};
