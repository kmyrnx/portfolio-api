const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: { type: String, required: true },
  image: { type: String, required: true },
  links: [{
    type: {
      name: { type: String },
      url: { type: String },
    },
    required: true,
  }],
  lastModified: { type: Date, default: new Date() },
});

const ProfileModel = new mongoose.model('Profile', ProfileSchema, 'profile');

module.exports = ProfileModel;
