const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const { secret } = require('../../config').jwtConfig;
const { Bookshelf, Book, Author, User, Review } = require('../../db/models');
const { sequelize } = require('../../db/models');
const { routeHandler } = require('../utils');

router.get('/', routeHandler(async (req, res) => {
    const { token } = req.cookies;
    const { id } = jwt.verify(token, secret).data;

    const bookshelves = await Bookshelf.findAll({
        where: {
            userId: id
        },
        include: {
            model: Book,
            attributes: ['id']
        }
    });

    res.json({
        bookshelves
    });
}));

router.get('/data', routeHandler(async (req, res) => {
    const { token } = req.cookies;
    const { id } = jwt.verify(token, secret).data;

    const books = await Book.findAll({
        attributes: ['id', 'title', 'cover'],
        include: [
            {
                model: Bookshelf,
                attributes: ['id', 'name'],
                where: {
                    userId: id
                },
                through: {
                    attributes: ['createdAt']
                }
            },
            {
                model: Author,
                attributes: ['firstName', 'lastName']
            }, {
                model: Review,
                attributes: ['rating'],
                where: {
                    userId: id
                }
            }
        ]
    });

    res.json({
        books
    });
}))

router.post('/', routeHandler(async (req, res) => {
    const { token } = req.cookies;
    const { id } = jwt.verify(token, secret).data;

    const { name } = req.body;
    const bookshelf = await Bookshelf.create({
        userId: id,
        name,
        defaultShelf: false
    });
    res.json({
        bookshelf
    });
}));

router.post('/:id(\\d+)/book', routeHandler(async (req, res) => {

}));

module.exports = router;