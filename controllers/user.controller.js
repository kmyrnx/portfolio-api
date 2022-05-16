const {
  createUser, signIn, changePassword,
} = require('../services/user.service');

module.exports.createUser = async (req, res, next) => {
  createUser(req.body.username, req.body.password, req.body.email)
    .then((doc) => (doc
      ? res.json({ message: `User ${doc.username} created` })
      : res.status(400).json({ error: 'User not created' })))
    .catch((err) => next(err));
};

module.exports.signIn = async (req, res, next) => {
  signIn(req.body.username, req.body.password)
    .then((doc) => (doc
      ? res.json({ message: doc })
      : res.status(400).json({ error: 'User not signed in' })))
    .catch((err) => next(err));
};

module.exports.changePassword = async (req, res, next) => {
  changePassword(req.body.username, req.body.password)
    .then((doc) => (doc
      ? res.json({ message: 'Password changed' })
      : res.status(400).json({ error: 'Password not changed' })))
    .catch((err) => next(err));
};
