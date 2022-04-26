const search = require('../services/search.service');

module.exports = (req, res, next) => search(req.query)
  .then((docs) => (docs.length > 0
    ? res.status(200).json(docs)
    : res.json({ error: 'No results found' })))
  .catch((err) => next(err));
