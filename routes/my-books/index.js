const express = require('express');
const router = express.Router();

const { routeHandler } = require('../utils');

router.get('/', (req, res) => {
    if (!req.cookies.token) {
        res.redirect('/');
    }
    res.render('my-books');
});

router.get('/bookshelf/:id(\\d+)', routeHandler(async (req, res) => {
    res.render('my-books')
}));

module.exports = router;