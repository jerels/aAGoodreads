const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const { secret } = require('../../config').jwtConfig;
const { Book, Bookshelf, Author, Review, Series, Publisher, Genre } = require('../../db/models');

const { routeHandler } = require('../utils');

router.get('/', routeHandler(async (req, res) => {
    const books = await Book.findAll();

    res.json({ books });
}));


router.get('/:id(\\d+)', routeHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const book = await Book.findByPk(id, {
        include: [Author, Series, Publisher, Genre]
    });

    res.json({ book });
}));

router.get('/:id(\\d+)/reviews', routeHandler(async (req, res) => {
    const reviews = await Review.findAll({
        where: {
            bookId: parseInt(req.params.id)
        }
    });

    res.json({ reviews });
}));

router.patch('/:id(\\d+)/read', routeHandler(async (req, res) => {
    console.log(req.cookie);
}))

module.exports = router;