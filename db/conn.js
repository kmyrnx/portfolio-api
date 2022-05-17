const mongoose = require('mongoose');

const logger = require('../helpers/logger');

const connectionString = process.env.DB_URI;

module.exports.connectToDatabase = async () => mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .catch((err) => logger.error(err.message));
