const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const { secret } = require('../../config').jwtConfig;
const { Book, Bookshelf, Author, Review, Series, Publisher, Genre, BookBookshelf } = require('../../db/models');

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

router.get('/:id(\\d+)/read', routeHandler(async (req, res) => {
    const bookId = parseInt(req.params.id);
    const { token } = req.cookies;
    const data = await jwt.verify(token, secret);
    const userId = data.data.id;
    const shelf = await Bookshelf.findOne({
        where: {
            name: "Read",
            userId: userId
        }
    });

    if (!shelf) {
        const readShelf = await Bookshelf.create({
            name: "Read",
            userId: userId,
            defaultShelf: true
        });

        await BookBookshelf.create({
            bookId: bookId,
            bookshelfId: readShelf.id
        });
    } else {
        const readBook = await BookBookshelf.findOne({
            where: {
                bookId: bookId,
                bookshelfId: shelf.id
            }
        });

        if (!readBook) {
            await BookBookshelf.create({
                bookId: bookId,
                bookshelfId: shelf.id
            });
        }
    }

}));

module.exports = router;