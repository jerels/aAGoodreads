const express = require('express');
const app = express();
const morgan = require('morgan');
const path = require('path');
const cors = require("cors");
const cookieParser = require('cookie-parser');
const csrfProtection = require('csurf')({ cookie: true });
const { environment } = require('./config');
const { ValidationError } = require("sequelize");
const pagesRouter = require("./routes/pages");
const apiRouter = require("./routes/api");

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.resolve(__dirname, 'public')));
console.log(path.resolve(__dirname, 'public'));
app.use("/api", apiRouter);
app.use("/", pagesRouter);
app.set('view engine', 'pug');

app.get('/', (req, res) => {
  res.render('splash');
});



app.use((req, res, next) => {
    const err = new Error("The requested resource couldn't be found.");
    err.errors = ["The requested resource couldn't be found."];
    err.status = 404;
    next(err);
  });

app.use((err, req, res, next) => {
    // check if error is a Sequelize error:
    if (err instanceof ValidationError) {
      err.errors = err.errors.map((e) => e.message);
      err.title = "Sequelize Error";
    }
    next(err);
  });

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    const isProduction = environment === "production";
    res.json({
      title: err.title || "Server Error",
      errors: err.errors,
      stack: isProduction ? null : err.stack,
    });
  });

module.exports = app;
