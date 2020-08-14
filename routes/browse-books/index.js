const express = require('express');
const router = express.Router();

const { routeHandler } = require('../utils');
const { Book, Bookshelf, Author, Review, Publisher, Genre, Series } = require('../../db/models');

router.get('/', routeHandler(async (req, res) => {
    const books = await Book.findAll({
        include: [{ model: Publisher }, { model: Author }, { model: Genre }, { model: Review }, { model: Series }],
    });

    res.render('books-browse', { title: "Browse Books", books })

}));

router.get('/Titles', routeHandler(async (req, res) => {
    const books = await Book.findAll({
        include: [{ model: Publisher }, { model: Author }, { model: Genre }, { model: Review }, { model: Series }],
    });

    res.render('books-browse', { title: "Browse Books", books })
}));

router.get('/Authors', routeHandler(async (req, res) => {
    const authors = await Author.findAll({
        include: [{ model: Book }, { model: Series }],
    });
    console.log(authors);
    res.render('authors-browse', { title: "Browse Authors", authors })
}));

router.get('/Genre', routeHandler(async (req, res) => {
    const genres = await Genre.findAll({
        include: [{ model: Book }, { model: Series }],
    });

    res.render('genre-browse', { title: "Browse Books", genres })
}));

module.exports = router;
