'use strict';

const {ServiceCrudBase} = require('hexin-core');
const Mailer = require('hexin-core/helpers/Mailer');

module.exports = class MailerService extends ServiceCrudBase {
  constructor(context_) {
    super(context_, context_.unitOfWork.IamRepository);
  }

  async sendMail(from, to, subject, body, attachments = []) {
    const result = await Mailer.sendMail(from, to, subject, body, attachments);
    return result;
  }
};
