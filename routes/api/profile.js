const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const { secret } = require('../../config').jwtConfig;
const { User } = require('../../db/models');

const { routeHandler } = require('../utils');

router.get('/', routeHandler(async (req, res) => {
    const { token } = req.cookies;
    const data = await jwt.verify(token, secret);
    console.log('DATA!!', data);
}));

module.exports = router;