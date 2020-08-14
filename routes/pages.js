const express = require('express');
const router = express.Router();
const browseRouter = require('./browse-books');
const myBooksRouter = require('./my-books');
const jwt = require('jsonwebtoken');
const { secret } = require('../config').jwtConfig;

const { User, Book } = require('../db/models');
const { routeHandler } = require('./utils');
const booksRouter = require('./books');

router.use('/books', booksRouter);
router.use('/my-books', myBooksRouter);
router.use('/browse', browseRouter);

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
>>>>>>> 16420e9ed12ffbb208af54dd75621af3a5e7d2e9
    res.render('splash');
}));



router.get(/[^/api]/, (req, res) => {
    res.render('error-page');
});

module.exports = router;
