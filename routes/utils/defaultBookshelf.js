const { Bookshelf } = require('../../db/models');

const createDefaultBookshelves = async (user) => {
    await Bookshelf.bulkCreate([
    {
        name: 'Currently Reading',
        userId: user.id,
        defaultShelf: true
    },
    {
        name: 'Read',
        userId: user.id,
        defaultShelf: true
    }, {
        name: 'Want to Read',
        userId: user.id,
        defaultShelf: true
    }]);
    return;
}

module.exports = {
    createDefaultBookshelves
};