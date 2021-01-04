const express = require("express");
const moment = require('moment');
const router = express.Router();
const { routeHandler, handleValidationErrors } = require('../utils');
const { getUserToken } = require('../utils/auth');
const csrfProtection = require("csurf")({ cookie: true });
const jwt = require('jsonwebtoken');

const bcrypt = require('bcryptjs');
const { secret, expiresIn } = require('../../config').jwtConfig;
const db = require('../../db/models');
const { Op } = require("sequelize");
const { User, Review, Bookshelf, Book } = db;
const { createDefaultBookshelves } = require('../utils/defaultBookshelf');


const { check, validationResult } = require('express-validator');

const validateName = [
  check('name', 'Name field must be a valid first and last name')
    .exists()
    .custom((value, { req }) => {
      return /^[A-Z][a-z]*\s([A-Z][a-z]*)$/.test(value);
    })
]

const validateAuth = [
  check("email", "Email field must have a valid email.")
    .exists()
    .isEmail(),
  check("password", "Password field must be six or more characters.")
    .exists()
    .isLength({ min: 6, max: 70 }),
]

//signing up
router.post("/", validateName, validateAuth, handleValidationErrors, routeHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  const nameArr = name.split(' ');
  const firstName = nameArr[0];
  const lastName = nameArr[1];

  const user = await User.create({
    email,
    hashedPassword: bcrypt.hashSync(password, 10),
    firstName,
    lastName,
  });

  console.log(user);
  // Create default user bookshelves All, Read, Currently Reading, Want to Read
  await createDefaultBookshelves(user);

  const token = await getUserToken(user);
  res.cookie('token', token, { maxAge: expiresIn * 1000 });
  res.json({ id: user.id, token });
}));

// logging in
router.post("/token", validateAuth, handleValidationErrors, routeHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({
    where: { email }
  });
  if (!user || !user.validatePassword(password)) {
    const err = new Error('Invalid email/password combination');
    err.status = 401;
    err.title = 'Unauthorized';
    throw err;
  }
  const token = await getUserToken(user);
  res.cookie('token', token, { maxAge: expiresIn * 1000 });
  res.json({ id: user.id, token });
}));

//logout
router.delete('/logout', routeHandler(async (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'logged out' })
}));

router.get('/profile', routeHandler(async (req, res) => {
  const { token } = req.cookies;
  const { id, email } = await jwt.verify(token, secret).data;
  const user = await User.findOne({
    where: { email },
    include: [{
      model: Review,
      attributes: ['rating']
    }, {
      model: Bookshelf,
      attributes: ['id', 'name']
    }]
  });
  const month = moment(user.createdAt).format('MMMM');
  const year = moment(user.createdAt).format('YYYY');
  const date = `${month} ${year}`;
  const reviews = user.Reviews
  const numOfReviews = reviews.length;
  let reviewTotal = 0;
  let ratingTotal = 0;
  reviews.forEach(review => {
    if (review.rating) {
      ratingTotal++;
      reviewTotal = reviewTotal + parseFloat(review.rating);
    }
  });
  let reviewAvg = reviewTotal / ratingTotal;
  let bookshelfObj = {};
  const bookshelves = user.Bookshelves;
  bookshelves.forEach(bookshelf => {
    bookshelfObj[bookshelf.name] = 0;
  })
  const books = await Book.findAll({
    attributes: ['id'],
    include: [
      {
        model: Bookshelf,
        attributes: ['id', 'name'],
        where: {
          userId: id
        },
        through: {
          attributes: ['createdAt']
        }
      }
    ]
  });
  books.forEach(book => {
    book.Bookshelves.forEach(bookshelf => {
      console.log(bookshelf.name);
      bookshelfObj[bookshelf.name] = bookshelfObj[bookshelf.name] + 1;
    });
  })

  res.json({ date, numOfReviews, ratingTotal, reviewAvg, bookshelfObj });
}));


module.exports = router;
