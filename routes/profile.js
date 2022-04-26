const express = require('express');

const router = express.Router();
const { getProfile, createProfile, updateProfile } = require('../controllers/profile.controller');
const { authenticate } = require('../helpers/auth');

router.post('/', authenticate, createProfile);

router.get('/', getProfile);

router.put('/', authenticate, updateProfile);

module.exports = router;
