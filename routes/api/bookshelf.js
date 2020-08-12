const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const { secret } = require('../../config').jwtConfig;
const { Bookshelf, Book, Author, User, Review } = require('../../db/models');
const { routeHandler } = require('../utils');

router.get('/', routeHandler(async (req, res) => {
    const { token } = req.cookies;
    const { id } = jwt.verify(token, secret).data;

    const books = await Book.findAll({
        attributes: ['title', 'cover'],
        include: [
            {
                model: Bookshelf,
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

}));

router.post('/:id(\\d+)/book', routeHandler(async (req, res) => {

}));

module.exports = router;