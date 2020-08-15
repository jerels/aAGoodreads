const express = require('express');
const router = express.Router();
const browseRouter = require('./browse-books');
const myBooksRouter = require('./my-books');
const editBookshelvesRouter = require('./edit-bookshelves');
const reviewRouter = require('./reviews');
const jwt = require('jsonwebtoken');
const { secret } = require('../config').jwtConfig;

const { User, Book } = require('../db/models');
const { routeHandler } = require('./utils');
const booksRouter = require('./books');

router.use('/books', booksRouter);
router.use('/my-books', myBooksRouter);
router.use('/browse', browseRouter);
router.use('/reviews', reviewRouter);
router.use('/edit-bookshelves', editBookshelvesRouter);

router.get('/', routeHandler(async (req, res) => {
    if (req.cookies.token) {
        const { token } = req.cookies;
        const payload = jwt.verify(token, secret);
        const user = await User.findOne({
            where: {
                id: payload.data.id
            }
        });

        if (user) {
            res.redirect('my-books');
            return;
        }
    }
<<<<<<< HEAD
=======

>>>>>>> 8aa7cc0e1cfa3fa72cc7e225a9217c6c537bcc00
    res.render('splash');
}));



router.get(/[^/api]/, (req, res) => {
    res.render('error-page');
});

module.exports = router;
