const express = require('express');
const router = express.Router();
const { routeHandler } = require('../utils');

router.get('/', routeHandler(async (req, res) => {
    res.render('book-page');
}))

router.get('/:id(\\d+)', routeHandler(async (req, res) => {
    const id = req.params.id;
    res.render('book-page', { bookId: id });
}));

module.exports = router;