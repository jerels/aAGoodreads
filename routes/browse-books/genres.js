const express = require('express');
const router = express.Router();
const { routeHandler } = require('../utils');
const { Op } = require("sequelize");
const { Book, Bookshelf, Author, Review, Publisher, Genre, Series } = require('../../db/models');

router.get('/', routeHandler(async (req, res) => {
    const genres = await Genre.findAll({
        include: [{ model: Book }, { model: Series }],
    });

    res.render('genre-browse', { title: "Browse Books", genres })
}));

router.get('/:id', routeHandler(async (req, res) => {
    const id = req.params.id;
    const genres = await Genre.findAll({
        where: {
            name: {
                [Op.substring]: id,
            },
        },
        include: [{ model: Book }, { model: Series }],
    });

    res.render('genre-browse', { title: "Browse Books", genres })
}));

module.exports = router;
