const express = require('express');
const router = express.Router();

router.get('/add/book/:id(\\d+)', (req, res) => {
    res.render('add-review');
});

router.get('/edit/book/:id(\\d+)', (req, res) => {
    res.render('edit-review');
})

module.exports = router;