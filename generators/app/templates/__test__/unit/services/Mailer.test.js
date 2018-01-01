'use strict';

const {expect} = require('chai');
const {serviceTest} = require('../../helper');

const Mailer = require('@httpeace_deploy/httpeace-node-core/helpers/Mailer');
const MailerService = require('../../../app/services/MailerService');

describe('Unit Testing: Service: Mailer', serviceTest({
  mailerService: (base) => new MailerService(base)
}, function () {
  it('sendMail: should return sent mail details', async function () {
    await this.stub(Mailer, 'sendMail', {});

    const result = await this.mailerService.sendMail('test@test.com', 'test@test123.com', 'test', 'testBody');
    expect(result).to.be.an('object');
  });
}));
