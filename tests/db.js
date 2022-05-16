const mongoose = require('mongoose');

const logger = require('../helpers/logger');

const connectionString = process.env.DB_TEST_URI;

module.exports.connectToDatabase = async () => mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .catch((err) => logger.error(err.message));

module.exports.connection = mongoose.connection;

module.exports.closeDatabase = async () => mongoose.disconnect();

module.exports.clearDatabase = async () => {
  const { collections } = mongoose.connection;

  await Promise.allSettled(Object
    .keys(collections)
    .map((collectionName) => collections[collectionName].deleteMany()));
};
