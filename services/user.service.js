const bcrypt = require('bcrypt');
const UserModel = require('../models/user.model');
const { generateToken } = require('../helpers/auth');

module.exports.createUser = async (username, password, email) => {
  if (await UserModel.countDocuments({}) > 0) return null;

  const newUser = UserModel({
    username,
    password: bcrypt.hashSync(password, Number(process.env.SALT_ROUNDS)),
    email,
  });

  await newUser.save();
  delete newUser.password;

  return newUser;
};

module.exports.signIn = async (username, password) => UserModel
  .findOne({ username })
  .then((user) => {
    if (user && bcrypt.compareSync(password, user.password)) {
      return generateToken({ _id: user._id, username, email: user.email });
    }

    return null;
  });

module.exports.changePassword = async (username, password) => UserModel
  .findOneAndUpdate(
    { username },
    {
      password: bcrypt.hashSync(password, Number(process.env.SALT_ROUNDS)),
      lastModified: new Date(),
    },

    { returnDocument: 'after', lean: true },
  ).select('-password');
