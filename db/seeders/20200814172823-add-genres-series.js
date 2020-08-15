'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('SeriesGenres', [
      { genreId: 1, seriesId: 1 },
      { genreId: 2, seriesId: 1 },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('SeriesGenres', null, {});
  }
};
