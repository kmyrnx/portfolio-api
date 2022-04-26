const morgan = require('morgan');
const path = require('path');
const rfs = require('rotating-file-stream');

const httpLogStream = rfs.createStream('http.log', {
  interval: '1d',
  maxFiles: Number(process.env.LOG_MAX_FILES),
  path: path.join(__dirname, '../logs/http'),
});

module.exports.httpFileLogger = morgan('combined', {
  skip: (_req, res) => res.statusCode < 400,
  stream: httpLogStream,
});

module.exports.httpConsoleLogger = morgan('combined', {
  skip: (_req, res) => res.statusCode < 400,
});
