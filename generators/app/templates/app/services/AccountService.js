'use strict';

const {ServiceBase} = require('@httpeace_deploy/httpeace-node-core');
const MailerService = require('./MailerService');

module.exports = class AccountService extends ServiceBase {
  constructor(context_) {
    super(context_, context_.unitOfWork.UserRepository);
    this.mailerService = new MailerService(context_);
  }

  async updateAccountById(currentUser, bodyUser) {
    const {t, _repo} = this;
    const userObj = this.sanitize(bodyUser);
    if (currentUser._id.toString() !== userObj._id.toString()) {
      throw new ValidationError(t('err_id_not_match'));
    }
    if (Object.prototype.hasOwnProperty.call(userObj, 'email') && !userObj.email) {
      throw new ValidationError({email: t('error_cannot_be_empty', [t('display_email_or_username')])});
    }
    if (Object.prototype.hasOwnProperty.call(userObj, 'username') && !userObj.username) {
      throw new ValidationError({username: t('error_cannot_be_empty', [t('display_username')])});
    }
    if (Object.prototype.hasOwnProperty.call(userObj, 'password')) {
      delete userObj.password;
    }

    const user = await _repo.findOne({_id: {$ne: bodyUser._id}, $or: [{email: userObj.email}, {username: userObj.username}]});
    if (user) {
      if (user.email === userObj.email) {
        throw new ValidationError({email: t('err_member_info_exist', [t('display_email_or_username')])});
      } else if (user.username === userObj.username) {
        throw new ValidationError({username: t('err_member_info_exist', [t('display_username')])});
      }
    }

    const result = await _repo.updateOne({'_id': userObj._id}, userObj);
    return result;
  }

  async getAvatarsByUser(userId, query) {
    const {_repo} = this;

    const avatars = await _repo.getAvatarsByUser(userId, query);
    return avatars;
  }

  async getAvatarsById(avatarId) {
    const {_repo} = this;

    const avatars = await _repo.getAvatarsById(avatarId);
    return avatars;
  }

  async deleteAvatarsById(avatarId) {
    const {_repo} = this;

    const avatars = await _repo.deleteAvatarsById(avatarId);
    return avatars;
  }
};
