const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ev = require('express-validation');

require('dotenv').config();

app.use(bodyParser.json());

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
  // eslint-disable-next-line no-console
  console.log('Connected to Database');
});

mongoose.connection.on('error', (err) => {
  // eslint-disable-next-line no-console
  console.log(`ERROR: connecting to Database. ${err}`);
});

const router = require('./router');

app.use(router);

app.use((err, req, res, next) => {
  // specific for validation errors
  if (err instanceof ev.ValidationError) {
    return res.status(err.status).json(err);
  }
  return next();
});

module.exports = app;
