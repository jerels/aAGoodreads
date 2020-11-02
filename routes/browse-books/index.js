const express = require('express');
const router = express.Router();
const titleRouter = require("./titles");
const authorRouter = require('./authors');
const genreRouter = require('./genres');
const { environment } = require('../../config')
const { ValidationError } = require("sequelize");
const { routeHandler } = require('../utils');
const { Book, Bookshelf, Author, Review, Publisher, Genre, Series } = require('../../db/models');

router.use("/titles", titleRouter);
router.use('/authors', authorRouter);
router.use('/genres', genreRouter);

router.get('/', routeHandler(async (req, res) => {
    res.redirect('/browse/title');
}));

module.exports = router;
