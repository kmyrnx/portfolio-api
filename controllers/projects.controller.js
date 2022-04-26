const {
  createProject, deleteProject, getProjects, getProject, updateProject,
} = require('../services/projects.service');

module.exports.getProjects = (_req, res, next) => {
  getProjects()
    .then((docs) => (docs.length > 0
      ? res.json(docs)
      : res.json({ error: 'No projects found' })))
    .catch((err) => next(err));
};

module.exports.getProject = (req, res, next) => {
  getProject(req.params.project)
    .then((doc) => (doc
      ? res.json(doc)
      : res.json({ error: 'Project not found' })))
    .catch((err) => next(err));
};

module.exports.createProject = (req, res, next) => {
  createProject(req.body.project)
    .then((doc) => (doc
      ? res.json({ message: 'Project created' })
      : res.json({ error: 'Project not created' })))
    .catch((err) => next(err));
};

module.exports.updateProject = (req, res, next) => {
  updateProject(req.params.project, req.body.project)
    .then((doc) => (doc
      ? res.json({ message: 'Project updated' })
      : res.json({ error: 'Project not updated' })))
    .catch((err) => next(err));
};

module.exports.deleteProject = (req, res, next) => {
  deleteProject(req.params.project)
    .then((doc) => (doc
      ? res.json({ message: 'Project deleted' })
      : res.json({ error: 'Project not deleted' })))
    .catch((err) => next(err));
};
