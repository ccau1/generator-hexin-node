'use strict';

module.exports.getUser = async (req, res) => {
  const {current_user} = req;
  res.send({
    _id: current_user._id,
    firstName: current_user.firstName,
    lastName: current_user.lastName,
    email: current_user.email,
    roles: current_user.roles
  });
};

module.exports.updateUser = async (req, res) => {
  // update user's basic info
  const {m, current_user, body} = req;
  const result = await m.updateAccountById(current_user, body);
  res.send(result);
};

module.exports.getAvatarList = async (req, res) => {
  const {m, current_user} = req;
  let result = {};
  let defaultAvatar = false;
  if (req.query.default !== undefined) {
    defaultAvatar = true;
    result = await m.getAvatarsByUser(current_user._id, defaultAvatar);
  } else {
    result = await m.getAvatarsByUser(current_user._id, defaultAvatar);
  }
  res.send(result);
};

module.exports.getUserAvatar = async (req, res) => {
  const {m} = req;
  const result = await m.getAvatarsById(req.params._id);
  res.send(result);
};

module.exports.createAvatar = async (req, res) => {
  const {m} = req;
  const result = await m.postAvatar(req.body._id, req.body.avatar);
  res.send(result);
};

module.exports.updateAvatar = async (req, res) => {
  const {m} = req;
  const result = await m.setDefaultAvatar(req.params._id);
  res.send(result);
};

module.exports.deleteAvatar = async (req, res) => {
  const {m} = req;
  const result = await m.deleteAvatarsById(req.params._id);
  res.send(result);
};
