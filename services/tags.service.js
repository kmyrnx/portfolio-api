const TagModel = require('../models/tag.model');
const slugify = require('../helpers/slugify');

module.exports.createTag = async (tag) => TagModel.create({ name: tag, slug: slugify(tag) });

module.exports.getTag = async (tag) => TagModel
  .findOne({ slug: tag }).select('name slug').lean();

module.exports.getTags = async () => TagModel.find().select('name slug').lean();

module.exports.updateTag = async (tag, newTag) => TagModel
  .findOneAndUpdate(
    { slug: tag },
    { name: newTag, slug: slugify(newTag), lastModified: new Date() },
    { returnDocument: 'after', lean: true },
  );

module.exports.deleteTag = async (tag) => TagModel.findOneAndDelete({ slug: tag });
