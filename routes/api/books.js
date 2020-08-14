const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const { secret } = require('../../config').jwtConfig;
const { Book, Bookshelf, Author, Review, Series, Publisher, Genre, BookBookshelf, User } = require('../../db/models');

const { routeHandler } = require('../utils');

router.get('/', routeHandler(async (req, res) => {
    const books = await Book.findAll();

    res.json({ books });
}));


router.get('/:id(\\d+)', routeHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const { token } = req.cookies;
    const data = await jwt.verify(token, secret);
    const userId = data.data.id;
    const book = await Book.findByPk(id, {
        include: [Author, Series, Publisher, Genre, Bookshelf]
    });

    res.json({ book, userId });
}));

router.get('/:id(\\d+)/reviews', routeHandler(async (req, res) => {
    const { token } = req.cookies;
    const data = await jwt.verify(token, secret);
    const userId = data.data.id;
    const reviews = await Review.findAll({
        where: {
            bookId: parseInt(req.params.id)
        },
        include: [User]
    });

    res.json({ reviews, userId });
}));

router.post('/:id(\\d+)/read', routeHandler(async (req, res) => {
    const bookId = parseInt(req.params.id);
    const { token } = req.cookies;
    const data = await jwt.verify(token, secret);
    const userId = data.data.id;
    console.log(data);
    const shelf = await Bookshelf.findOne({
        where: {
            name: "Read",
            userId: userId
        }
    });
    let bookBook = await BookBookshelf.findOne({
        where: {
            bookId: bookId,
            bookshelfId: shelf.id
        }
    });

    if (!bookBook) {
        bookBook = await BookBookshelf.create({
            bookId: bookId,
            bookshelfId: shelf.id
        });
    }

    res.json({ shelf, bookBook });


}));

module.exports = router;