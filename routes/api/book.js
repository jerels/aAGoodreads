const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const { secret } = require('../../config').jwtConfig;
const { Book, Bookshelf, Author, Review } = require('../../db/models');

const { routeHandler } = require('../utils');

router.get('/', routeHandler(async (req, res) => {


    const books = await Book.findAll({
        include: [{ model: Publisher }, { model: Author }, { model: Genre }, { model: Review }, { model: Series }],
    });

    res.json({
        books
    });

    res.render('books-browse', { title: "Browse Books", books });


}));

router.get('/:id(\\d+)', routeHandler(async (req, res) => {
    const book = await Book.findOne({
        where: {
            id: parseInt(req.params.id)
        }
    });

    res.json({
        book
    });
}));

router.get('/:id(\\d+)/reviews', routeHandler(async (req, res) => {
    console.log(req.params.id);
    const reviews = await Review.findAll({
        where: {
            bookId: parseInt(req.params.id)
        }
    });

    res.json({
        reviews
    });
}));

module.exports = router;
