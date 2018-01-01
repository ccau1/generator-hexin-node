'use strict';

const {ServiceBase} = require('hexin-core');
const indicative = require('indicative');
const _ = require('lodash');
const {constants} = require('../../configs');
const {generateTokenAsync} = require('hexin-core/helpers/Token');
const MailerService = require('./MailerService');
const Config = require('../../configs');

const jwt = require('jwt-simple');
const configs = require('../../configs').base;
const bCrypt = require('bcrypt-nodejs');

module.exports = class AuthService extends ServiceBase {
  constructor(context_) {
    super(context_, context_.unitOfWork.UserRepository);
    this.mailerService = new MailerService(context_);
  }

  async verifyPassword(user, password) {
    return new Promise((resolve, reject) => {
      bCrypt.compare(password, user.password, (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      });
    });
  }

  async getHash(password) {
    return new Promise((resolve, reject) => {
      bCrypt.genSalt(10, (saltErrors, salt) => {
        if (saltErrors) {
          throw new Error(saltErrors);
        }
        bCrypt.hash(password, salt, null, (hashErrors, hash) => {
          if (hashErrors) {
            throw new Error(saltErrors);
          }
          resolve(hash);
        });
      });
    });
  }

  generateJwtToken(type, _id, opts) {
    const token = jwt.encode({
      iss: configs.host,
      sub: _id,
      exp: opts || (new Date().getTime() + 172800),
      type: type
    }, configs.secret);
    return token;
  }

  async createUser(bodyUser, roles = [constants.props.userRole.staff]) {
    const {t, _repo, unitOfWork} = this;

    await this.validate(bodyUser);
    const userObj = this.sanitize(bodyUser);
    const user = await _repo.findOne({$or: [{email: userObj.email}, {username: userObj.username}]});
    if (user) {
      if (user.email === userObj.email) {
        throw new ValidationError({email: t('err_member_info_exist', [t('display_email_or_username')])});
      } else { // if (user.username === userObj.username) {
        throw new ValidationError({username: t('err_member_info_exist', [t('display_username')])});
      }
    } else {
      const hashedPassword = await this.getHash(userObj.password);
      const newUser = {
        firstName: userObj.firstName,
        lastName: userObj.lastName,
        email: userObj.email,
        username: userObj.username,
        password: hashedPassword,
        roles: roles,
        company: userObj.company,
        title: userObj.title,
        work: userObj.work
      };
      const savedUser = await _repo.create(newUser);
      await unitOfWork.context.commit();
      return savedUser;
    }
  }

  async resetPassword(email) {
    const {t, _repo} = this;

    const user = await _repo.findOne({email: email});
    if (!user) {
      throw new ValidationError(t('err_email_invalid'));
    }
    const resetToken = await generateTokenAsync();
    await this.updateResetToken(email, resetToken);
    const body = await this.setEmailBodyResetPassword(resetToken);
    const sendEmail = await this.mailerService.sendMail('cs@uncleprint.com.hk', email, 'Reset Password', body);
    return sendEmail;
  }

  async resetPasswordUpdate(newPassword, resetToken) {
    const {t, _repo} = this;

    const validToken = await this.verifyResetToken(resetToken);
    if (!validToken) {
      throw new ValidationError(t('err_reset_token_invalid'));
    }

    const hasedPassword = await this.getHash(newPassword);
    const result = await _repo.updateOne({'resetToken.token': resetToken}, {'password': hasedPassword});
    if (!result) {
      throw new ValidationError(t('err_db_throw'));
    }

    return true;
  }

  async verifyResetToken(resetToken) {
    const {_repo} = this;
    const currentTime = new Date().getTime();

    const tokenExists = await _repo.findOne({'resetToken.token': resetToken, 'resetToken.expiredAt': {$gt: currentTime}});
    if (tokenExists) {
      return true;
    }
    return false;
  }

  async updateResetToken(email, resetToken) {
    const {_repo} = this;
    const expiredAt = new Date(new Date().getTime() + (7 * 24 * 60 * 60 * 1000)).getTime();// expires after 1 week
    const data = {};

    data.resetToken = {
      'token': resetToken,
      'expiredAt': expiredAt
    };
    const result = await _repo.update({email: email}, data);
    return result;
  }

  async setEmailBodyResetPassword(resetToken) {
    const {context: {controller: {app: {parent: rootApp}}}} = this;

    return new Promise(function (resolve, reject) {
      const url = Config.base.host + ':' + Config.base.port + '/api/auth/reset-password-verify/' + resetToken;

      rootApp.render('email/resetPassword', {
        url: url
      }, function (err, html) {
        if (err) {
          reject(err);
        } else {
          resolve(html);
        }
      });
    });
  }

  async validate(obj) {
    const {t} = this;
    const rule = {
      firstName: 'required',
      lastName: 'required',
      email: 'required|email',
      password: 'required|min:6|max:10',
      confirmPassword: 'required|same:password'
    };
    const message = {
      required: t('msg_validation_required'),
      email: t('err_email_invalid'),
      'password.min': t('err_member_password_validation_6_10_digits'),
      same: t('err_member_password_not_match')
    };

    return indicative.validateAll(obj, rule, message);
  }
};
