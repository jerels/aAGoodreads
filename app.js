const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const path = require('path');
const apiRouter = require('./routes/api');
const pagesRouter = require('./routes/pages');

const app = express();
app.set('view engine', 'pug');


app.use(morgan('dev'));
// Adds cookies to req.cookies
app.use(cookieParser());
// Converts req body to POJO
app.use(express.json());
// Converts url encoded data to body object
app.use(express.urlencoded({ extended: false }));
// Serve static files from public folder
app.use('/public', express.static('public'));

app.use('/api', apiRouter);
app.use('/', pagesRouter);

// Error handling
app.use((req, res, next) => {
  res.setTimeout(1000);
  req.setTimeout(1000);

  next();
});

module.exports = app;
