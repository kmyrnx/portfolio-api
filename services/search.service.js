const ProjectModel = require('../models/project.model');

module.exports = async ({ q, t }) => {
  const pipe = [];

  if (q) {
    pipe.push(
      {
        $match: {
          $text: { $search: q },
        },
      },
    );
  }

  pipe.push(
    {
      $lookup: {
        from: 'tags',
        localField: 'tags',
        foreignField: '_id',
        as: 'tags',
      },
    },
  );

  if (t) pipe.push({ $match: { 'tags.slug': { $in: t.split(',') } } });

  return ProjectModel.aggregate(pipe);
};
