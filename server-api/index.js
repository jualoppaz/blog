const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const { ValidationError } = require('express-validation');

app.use(bodyParser.json());

const router = require('./router');

app.use(router);

app.use((err, req, res, next) => {
  // specific for validation errors
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json(err);
  }
  return next();
});

module.exports = app;
