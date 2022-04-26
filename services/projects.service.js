const ProjectModel = require('../models/project.model');
const slugify = require('../helpers/slugify');

module.exports.createProject = async (project) => {
  const newProject = new ProjectModel(project);
  newProject.slug = slugify(newProject.name);
  return newProject.save();
};

module.exports.getProject = async (project) => ProjectModel
  .findOne({ slug: project })
  .populate('tags');

module.exports.getProjects = async () => ProjectModel.find().populate('tags').lean();

module.exports.updateProject = async (project, newProject) => ProjectModel
  .findOneAndUpdate(
    { slug: project },
    {
      ...newProject,
      slug: slugify(newProject.name ? newProject.name : project),
      lastModified: new Date(),
    },
    { returnDocument: 'after', lean: true },
  );

module.exports.deleteProject = async (project) => ProjectModel.findOneAndDelete({ slug: project });
