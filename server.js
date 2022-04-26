const express = require('express');
const bodyParser = require('body-parser');
const createError = require('http-errors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const routes = require('./routes');

const rateLimiter = require('./helpers/rateLimiter');
const { httpConsoleLogger, httpFileLogger } = require('./helpers/httpLogger');
const logger = require('./helpers/logger');
const { connectToDatabase } = require('./db/conn');

const allowedMethods = ['GET', 'POST', 'DELETE', 'PUT'];

app.use(bodyParser.json());

// Setup HTTP errors logger
app.use(httpConsoleLogger);
app.use(httpFileLogger);

// Setup Helmet
app.use(helmet());

// Limit HTTP methods
app.use((req, _res, next) => {
  if (!allowedMethods.includes(req.method)) {
    return next(createError(405));
  }

  return next();
});

// Database connection
connectToDatabase();

// Setup rate limiter
app.use(rateLimiter);

// Setup routes
app.use(routes);

// 404 handler
app.use((_req, _res, next) => {
  next(createError(404));
});

// Error handler
app.use((err, req, res, next) => {
  logger.error(err.message, { url: req.url, stack: err.stack });

  res.status(err.status || 500).json({
    error: err.status === 404 ? err.message : 'Something went wrong. We\'ll look into it.',
    url: req.url,
  });

  next();
});

app.listen(process.env.PORT);
