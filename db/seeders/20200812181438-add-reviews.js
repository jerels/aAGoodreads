'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Reviews', [
      {content: 'I liked it!', rating: 4.5, bookId: 1, userId: 1},
      {content: 'It was aight.', bookId: 2, userId: 1},
      {content: 'It was the best one!', rating: 5, bookId: 3, userId: 1},
      {content: 'I enjoyed it thoroughly', bookId: 4, userId: 1},
      {content: 'This one was epic.', rating: 3.5, bookId: 5, userId: 1},
      {content: 'Almost done!', rating: 4.3, bookId: 6, userId: 1},
      {content: 'Alas the series is done :(', rating: 4, bookId: 7, userId: 1}
    ], {fields: ['content', 'rating', 'bookId', 'userId']});
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
