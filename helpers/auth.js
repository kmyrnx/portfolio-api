/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');

module.exports.generateToken = (user) => jwt.sign(
  user,
  process.env.TOKEN_SECRET,
  { expiresIn: '1d' },
);

module.exports.authenticate = (req, res, next) => {
  const { authorization } = req.headers;
  const token = authorization && authorization.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'No token provided' });

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};
