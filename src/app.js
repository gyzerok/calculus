'use strict';

const path = require('path');
const express = require('express');

const Calculator = require('./Calculator');


const app = express();
module.exports = app;

app.get('/calculus', (req, res) => {
  const input = req.query.query;

  if (!input) {
    return res
      .status(400)
      .json({
        error: true,
        message: 'No query provided',
      });
  }

  const trimmedInput = input.trim();
  const expression = trimmedInput.endsWith('=')
    ? (new Buffer(trimmedInput, 'base64')).toString('utf8')
    : trimmedInput

  const calculated = Calculator.evaluate(expression);
  if (calculated.error) {
    return res
      .status(400)
      .json({
        error: true,
        message: calculated.error,
      });
  }

  res.json({
    error: false,
    result: calculated.result,
  });
});

const indexHtmlPath = path.join(__dirname, '..', 'public', 'index.html');
app.get('/', (req, res) => {
  res.sendFile(indexHtmlPath);
});

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err,
  });
});
