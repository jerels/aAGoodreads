const express = require('express');
const router = express.Router();
const { routeHandler } = require('../utils');
const { Op } = require("sequelize");
const { Book, Bookshelf, Author, Review, Publisher, Genre, Series } = require('../../db/models');

router.get('/', routeHandler(async (req, res) => {
    const books = await Book.findAll({
        include: [{ model: Publisher }, { model: Author }, { model: Genre }, { model: Review }, { model: Series }],
    });

    res.render('books-browse', { title: "Browse Books", books })
}));

router.get('/:id', routeHandler(async (req, res) => {
    const id = req.params.id;
    const books = await Book.findAll({
        where: {
            title: {
                [Op.substring]: id,
            },
        },
        include: [{ model: Publisher }, { model: Author }, { model: Genre }, { model: Review }, { model: Series }],
    });
    res.render('books-browse', { title: "Browse Books", books })
}));

module.exports = router;
