const ProfileModel = require('../models/profile.model');

module.exports.getProfile = async () => ProfileModel.findOne({ }).lean();

module.exports.createProfile = async (profile) => {
  if (await ProfileModel.countDocuments({}) > 0) return null;

  const newProfile = ProfileModel(profile);
  return newProfile.save();
};

module.exports.updateProfile = async (profile) => ProfileModel
  .findOneAndUpdate(
    { },
    { ...profile, lastModified: new Date() },
    { returnDocument: 'after', lean: true },
  ).select('-user');
