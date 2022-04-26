const mongoose = require('mongoose');

const TagSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  lastModified: { type: Date, default: new Date() },
});

const TagModel = new mongoose.model('Tag', TagSchema, 'tags');

module.exports = TagModel;
