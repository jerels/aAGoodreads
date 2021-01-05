const express = require('express');
const router = express.Router()
const { routeHandler } = require('../utils');

router.get('/', routeHandler(async (req, res) => {
    if (!req.cookies.token) {
        res.redirect('/');
    };

    res.render('profile');
}));

module.exports = router;
