const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const { secret } = require('../../config').jwtConfig;
const { Book, Bookshelf, Author, Review, Series, Publisher, Genre, BookBookshelf, User } = require('../../db/models');
const { Op } = require('sequelize');

const { routeHandler } = require('../utils');

router.get('/', routeHandler(async (req, res) => {
    const books = await Book.findAll({
        include: [Author, Series, Genre, Publisher],
        order: [['title', 'ASC']]
    });

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

router.post('/:id(\\d+)', routeHandler(async (req, res) => {
    const bookId = parseInt(req.params.id);
    const { token } = req.cookies;
    const data = await jwt.verify(token, secret);
    const userId = data.data.id;

    const defaultShelfId = Number(req.body.defaultShelf);
    const createdShelfNames = Object.keys(req.body).filter((key) => key !== 'defaultShelf');
    console.log(createdShelfNames);

    const destroyShelves = await Bookshelf.findAll({
        where: {
            userId
        },
        include: [
            {
                model: Book,
                where: {
                    id: bookId
                }
            }
        ]
    });

    await BookBookshelf.destroy({
        where: {
            bookId,
            bookshelfId: {
                [Op.or]: [...destroyShelves.map((shelf) => shelf.id)]
            }
        }
    });

    await BookBookshelf.create({
        bookId,
        bookshelfId: defaultShelfId
    });

    if (createdShelfNames.length) {
        const createdShelves = await Bookshelf.findAll({
            attributes: ['id'],
            where: {
                userId,
                name: {
                    [Op.or]: [...createdShelfNames]
                }
            }
        });

        for (const shelf of createdShelves) {
            console.log(shelf);
            await BookBookshelf.create({
                bookId,
                bookshelfId: shelf.dataValues.id
            });
        }

    }

    res.json({ message: 'Success!' });
}));

module.exports = router;