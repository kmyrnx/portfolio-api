const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  repo: { type: String },
  url: { type: String },
  tags: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tag',
    required: true,
  }],
  lastModified: { type: Date, default: new Date() },
});

ProjectSchema.index({
  name: 'text', description: 'text', repo: 'text', url: 'text',
});

const ProjectModel = new mongoose.model('Project', ProjectSchema, 'projects');

module.exports = ProjectModel;
