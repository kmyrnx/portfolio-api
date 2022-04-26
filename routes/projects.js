const express = require('express');

const router = express.Router();
const {
  getProjects, getProject, createProject,
  updateProject, deleteProject,
} = require('../controllers/projects.controller');

const { authenticate } = require('../helpers/auth');

router.get('/', getProjects);

router.post('/', authenticate, createProject);

router.get('/:project', getProject);

router.put('/:project', authenticate, updateProject);

router.delete('/:project', authenticate, deleteProject);

module.exports = router;
