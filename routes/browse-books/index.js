const express = require('express');
const router = express.Router();
const titleRouter = require("./titles");
const authorRouter = require('./authors');
const genreRouter = require('./genres');
const { environment } = require('../../config')
const { ValidationError } = require("sequelize");
const { routeHandler } = require('../utils');
const { Book, Bookshelf, Author, Review, Publisher, Genre, Series } = require('../../db/models');

router.use("/Titles", titleRouter);
router.use('/Authors', authorRouter);
router.use('/Genres', genreRouter);

router.get('/', routeHandler(async (req, res) => {
    const books = await Book.findAll({
        include: [{ model: Publisher }, { model: Author }, { model: Genre }, { model: Review }, { model: Series }],
    });

    res.render('books-browse', { title: "Browse Books", books })

}));

module.exports = router;
