const express = require('express');

const router = express.Router();
const {
  getTags, getTag, createTag,
  updateTag, deleteTag,
} = require('../controllers/tags.controller');
const { authenticate } = require('../helpers/auth');

router.get('/', getTags);

router.post('/', authenticate, createTag);

router.get('/:tag', getTag);

router.put('/:tag', authenticate, updateTag);

router.delete('/:tag', authenticate, deleteTag);

module.exports = router;
