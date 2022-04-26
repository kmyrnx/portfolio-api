const { createProfile, getProfile, updateProfile } = require('../services/profile.service');

module.exports.getProfile = async (_req, res, next) => {
  getProfile()
    .then((doc) => (doc
      ? res.json(doc)
      : res.json({ error: 'Profile not found' })))
    .catch((err) => next(err));
};

module.exports.createProfile = async (req, res, next) => {
  createProfile(req.body.profile)
    .then((doc) => (doc
      ? res.json({ message: 'Profile created' })
      : res.json({ error: 'Profile not created' })))
    .catch((err) => next(err));
};

module.exports.updateProfile = async (req, res, next) => {
  updateProfile(req.body.profile)
    .then((doc) => (doc
      ? res.json({ message: 'Profile updated' })
      : res.json({ error: 'Profile not updated' })))
    .catch((err) => next(err));
};
