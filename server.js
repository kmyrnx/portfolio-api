const app = require('./app');
const { connectToDatabase } = require('./db/conn');

require('dotenv').config();

// Database connection
connectToDatabase();

app.listen(process.env.PORT);
