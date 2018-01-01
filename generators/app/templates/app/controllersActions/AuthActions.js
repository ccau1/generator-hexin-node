'use strict';

// auth route methods //
module.exports.registerUser = async (req, res) => {
  const {m} = req;
  const result = await m.createUser(req.body);
  res.send(result);
};

module.exports.getUserToken = (req, res) => {
  const {m} = req;
  const {user} = req._passport.session;
  const token = m.generateJwtToken('member', user._id, {expire: new Date().getTime() + 172800});
  res.json({
    id: user._id,
    name: user.name,
    email: user.email,
    status: user.status,
    token: token
  });
};

module.exports.loginFacebook = (req, res) => {
  const {m} = req;
  const {user} = req._passport.session;
  const token = m.generateJwtToken('member', user._id, {expire: new Date().getTime() + 172800});
  res.json({
    id: user._id,
    name: user.name,
    email: user.email,
    status: user.status,
    token: token
  });
};

module.exports.loginFacebookFail = (req, res) => {
  res.status(400).send({'message': 'Facebook login failed'});
};

module.exports.loginGoogle = (req, res) => {
  const {m} = req;
  const {user} = req._passport.session;
  const token = m.generateJwtToken('member', user._id, {expire: new Date().getTime() + 172800});
  res.json({
    id: user._id,
    name: user.name,
    email: user.email,
    status: user.status,
    token: token
  });
};

module.exports.loginGoogleFail = (req, res) => {
  res.status(400).send({'message': 'Google login failed'});
};

module.exports.resetPassword = async (req, res) => {
  // this call creates reset token, and send email providing link with token in it
  const {m, body: {email}} = req;
  const result = await m.resetPassword(email);
  res.send(result);
};

module.exports.resetPasswordVerify = async (req, res) => {
  // this is the link from email above. It'll take token, and validate it
  const {m, params: {token}} = req;
  const result = await m.verifyResetToken(token);
  res.send({'valid': result});
};

module.exports.resetPasswordUpdate = async (req, res) => {
  // this call retrieves new password, validate token again, then updates password
  const {m, body: {password}, params: {token}} = req;

  const result = await m.resetPasswordUpdate(password, token);
  res.send({'updated': result});
};

module.exports.logoutUser = async (req, res) => {
  // TODO:: implement logout logic
  res.json({});
};
