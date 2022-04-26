const path = require('path');
const { mkdirSync } = require('fs');
const winston = require('winston');
require('winston-daily-rotate-file');

const logger = winston.createLogger({
  format: winston.format.json(),
  transports: [
    new winston.transports.DailyRotateFile({
      level: 'error',
      filename: '%DATE%',
      extension: '.json',
      datePattern: 'YYYY-MM-DD',
      json: true,
      dirname: path.join(__dirname, '../logs/app'),
      format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
      maxFiles: `${process.env.LOG_MAX_FILES}d`,
    })],
});

logger.on('error', (err) => {
  if (err.code === 'ENOENT') {
    mkdirSync(path.join(__dirname, '../logs/app'), { recursive: true });
  }
});

module.exports = logger;
