const express = require('express');
const app = express();
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const csrfProtection = require('csurf')({ cookie: true });

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/public', express.static('public'));
app.set('view engine', 'pug');

app.get('/', (req, res) => {
  const stylesheets = ['splash.css', 'footer.css'];
  res.render('splash', {stylesheets});
});

app.get('/hello', (req, res) => {
    res.send('Hello World!');
  });

app.use((req, res, next) => {
    res.render('error-page');
  });

module.exports = app;
