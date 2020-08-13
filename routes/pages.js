const express =  require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const { secret } = require('../config').jwtConfig;
const { User } = require('../db/models');
const { routeHandler } = require('./utils');

router.get('/', async (req, res) => {
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
});

router.get('/my-books/bookshelf/:id(\\d+)', routeHandler(async (req, res) => {
    res.render('my-books');
}))

router.get('/my-books', (req, res) => {
    if (!req.cookies.token) {
        res.redirect('/');
    }
    res.render('my-books');
});

router.get(/[^/api]/, (req, res) => {
    res.render('error-page');
});

module.exports = router;
