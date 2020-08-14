const express = require('express');
const router = express.Router();

const { routeHandler } = require('../utils');
const { Book, Bookshelf, Author, Review, Publisher, Genre, Series } = require('../../db/models');

router.get('/', routeHandler(async (req, res) => {
    const books = await Book.findAll({
        include: [{ model: Publisher }, { model: Author }, { model: Genre }, { model: Review }, { model: Series }],
    });

    res.render('books-browse', { title: "Browse Books", books })

}));

router.get('/bookshelf/:id(\\d+)', routeHandler(async (req, res) => {
    res.render('my-books')
}));

module.exports = router;
