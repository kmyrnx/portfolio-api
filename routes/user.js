const express = require('express');

const router = express.Router();
const { signIn, changePassword, createUser } = require('../controllers/user.controller');
const { authenticate } = require('../helpers/auth');

router.post('/', createUser);

router.post('/signin', signIn);

router.put('/change-password', authenticate, changePassword);

module.exports = router;
