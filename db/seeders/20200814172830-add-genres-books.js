'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('BookGenres', [
      { bookId: 1, genreId: 1 },
      { bookId: 2, genreId: 2 },
      { bookId: 3, genreId: 1 },
      { bookId: 4, genreId: 2 },
      { bookId: 5, genreId: 1 },
      { bookId: 6, genreId: 2 },
      { bookId: 7, genreId: 1 },
      { bookId: 7, genreId: 2 },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('BookGenres', null, {});
  }
};
