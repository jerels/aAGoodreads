const express =  require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('splash');
})

router.get('/my-books', (req, res) => {
    res.render('my-books');
});

module.exports = router;
