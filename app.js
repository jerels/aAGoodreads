const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');

const app = express();
app.set('view engine', 'pug');

app.use(morgan('dev'));
// Adds cookies to req.cookies
app.use(cookieParser());
// Converts req body to POJO
app.use(express.json());
// Converts url encoded data to body object
app.use(express.urlencoded({ extended: false }));

// Error handling
app.use((req, res, next) => {
  res.setTimeout(1000);
  req.setTimeout(1000);

  next();
});


app.get('/', (req, res) => {
  res.render('splash');
});

module.exports = app;
