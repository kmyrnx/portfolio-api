const express = require('express');

const router = express.Router();
const users = require('./user');
const profile = require('./profile');
const projects = require('./projects');
const tags = require('./tags');
const search = require('./search');

router.get('/', (_req, res) => {
  res.status(200).json({
    message: 'Portfolio API is working',
  });
});

router.use('/user', users);
router.use('/profile', profile);
router.use('/projects', projects);
router.use('/tags', tags);
router.use('/search', search);

module.exports = router;
