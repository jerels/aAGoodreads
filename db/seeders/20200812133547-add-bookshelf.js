'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Bookshelves', [
      { name: 'All', userId: 1, defaultShelf: true},
      { name: 'Currently Reading', userId: 1, defaultShelf: true},
      { name: 'Want to Read', userId: 1, defaultShelf: true}
    ], { fields: ['name', 'userId', 'defaultShelf']});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
