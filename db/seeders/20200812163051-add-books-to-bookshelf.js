'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('BookBookshelves', [
      { bookId: 1, bookshelfId: 2 },
      { bookId: 2, bookshelfId: 2 },
      { bookId: 3, bookshelfId: 2 },
      { bookId: 4, bookshelfId: 1},
      { bookId: 5, bookshelfId: 3},
      { bookId: 6, bookshelfId: 3},
      { bookId: 7, bookshelfId: 3}
    ]);
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
