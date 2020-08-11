const express = require("express");
const router = express.Router();
const { routeHandler } = require('../utils');

const csrfProtection = require("csurf")({ cookie: true });
const jwt = require('jsonwebtoken');

const bcrypt = require('bcryptjs');
const { secret, expiresIn } = require('../../config').jwtConfig;
const db = require('../../db/models');
const { Op } = require("sequelize");
const { User } = db;




//signing up
router.post("/", (req, res) => {

});

// logging in
router.post("/token", routeHandler(async (req, res, next) => {
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
  const token = await jwt.sign({ id: user.id, email: user.email }, secret, { expiresIn: parseInt(expiresIn) });
  res.cookie('token', token, {maxAge: expiresIn * 1000});
  res.json({ id: user.id, token });
}));


module.exports = router;
