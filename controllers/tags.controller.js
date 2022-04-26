const {
  createTag, deleteTag, getTag, getTags, updateTag,
} = require('../services/tags.service');

module.exports.getTags = (_req, res, next) => {
  getTags()
    .then((docs) => (docs.length > 0 ? res.json(docs) : res.json({ error: 'No tags found' })))
    .catch((err) => next(err));
};

module.exports.getTag = (req, res, next) => {
  getTag(req.params.tag)
    .then((doc) => (doc ? res.json(doc) : res.json({ error: 'Tag not found' })))
    .catch((err) => next(err));
};

module.exports.createTag = (req, res, next) => {
  createTag(req.body.tag)
    .then((doc) => (doc
      ? res.json({ message: `Tag ${doc.name} created` })
      : res.json({ error: 'Tag not created' })))
    .catch((err) => next(err));
};

module.exports.updateTag = (req, res, next) => {
  updateTag(req.params.tag, req.body.tag)
    .then((doc) => (doc
      ? res.json({ message: `Tag ${doc.name} updated` })
      : res.json({ error: 'Tag not updated' })))
    .catch((err) => next(err));
};

module.exports.deleteTag = (req, res, next) => {
  deleteTag(req.params.tag)
    .then((doc) => (doc
      ? res.json({ message: `Tag ${doc.name} deleted` })
      : res.json({ error: 'Tag not deleted' })))
    .catch((err) => next(err));
};
