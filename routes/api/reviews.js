const express = require('express');
const router = express.Router();
const { routeHandler } = require('../utils');
const { Review } = require('../../db/models');
const jwt = require('jsonwebtoken');
const { secret } = require('../../config').jwtConfig;

router.get('/', routeHandler(async (req, res) => {

}));

router.get('/:id(\\d+)', routeHandler(async (req, res) => {
    const { token } = req.cookies;
    const data = jwt.verify(token, secret);
    const id = data.data.id;
    const review = await Review.findOne({
        where: {
            userId: id,
            bookId: parseInt(req.params.id)
        }
    });

    res.json({
        review
    });
}))

router.post('/', routeHandler(async (req, res) => {
    const { token } = req.cookies;
    const data = jwt.verify(token, secret);
    const id = data.data.id;
    const { content, rating, bookId } = req.body;

    const review = await Review.create({
        bookId,
        userId: parseInt(id),
        content,
        rating
    });

    res.json({
        review
    });
}));

router.put('/', routeHandler(async (req, res) => {
    const { token } = req.cookies;
    const data = jwt.verify(token, secret);
    const id = data.data.id;
    const { content, rating, bookId } = req.body;

    const review = await Review.findOne({
        where: {
            userId: id,
            bookId
        }
    });

    review.content = content;
    review.rating = rating;

    await review.save();

    res.json({
        review
    });
}));

module.exports = router;