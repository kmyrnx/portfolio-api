const path = require('path');
const { mkdirSync, existsSync } = require('fs');
const app = require('./app');
const { connectToDatabase } = require('./db/conn');

// Create the log directory if it doesn't exist
if (!existsSync(path.join(__dirname, './logs/app'))) {
  mkdirSync(path.join(__dirname, './logs/app'), { recursive: true });
}

require('dotenv').config();

// Database connection
connectToDatabase();

app.listen(process.env.PORT);
