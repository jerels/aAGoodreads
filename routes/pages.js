const express =  require('express');
const router = express.Router();

const myBooksRouter = require('./my-books');
const editBookshelvesRouter = require('./edit-bookshelves');
const reviewRouter = require('./reviews');
const jwt = require('jsonwebtoken');
const { secret } = require('../config').jwtConfig;
const { User } = require('../db/models');
const { routeHandler } = require('./utils');

router.use('/my-books', myBooksRouter);
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
        res.render('splash');
}));

router.get(/[^/api]/, (req, res) => {
    res.render('error-page');
});

module.exports = router;
