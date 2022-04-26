const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  lastModified: { type: Date, default: new Date() },
});

const UserModel = new mongoose.model('User', UserSchema, 'user');

module.exports = UserModel;
