'use strict';

const {expect} = require('chai');
const {serviceTest} = require('../../helper');

const AuthService = require('../../../app/services/AuthService');

describe('Unit Testing: Service: Auth', serviceTest({
  authService: (base) => new AuthService(base),
  userRepo: (base) => base.unitOfWork.UserRepository
}, function () {
  it('verifyPassword: should return true if the password matched with hexstring', async function () {
    const result = await this.authService.verifyPassword({'password': '$2a$04$t2UD3YIjbyjoKaESeu4f1Ool.y0XxLliSmJ8MColj.FBYnGESUaWy'}, 'a');
    expect(result).to.equal(true);
  });

  it('getHash: should return a valid hash for the input', async function () {
    const password = '123456';
    const result = await this.authService.getHash(password);
    const verify = await this.authService.verifyPassword({'password': result}, password);
    expect(verify).to.equal(true);
  });

  it('generateJwtToken: should return a string', async function () {
    const result = await this.authService.generateJwtToken('member', '59b64ee90ac3a347330422e9', {expire: new Date().getTime() + 172800});
    expect(result).to.be.an('string');
  });

  let userEmail = '';
  it('createUser: should return the created user object', async function () {
    const bodyUser = {
      'firstName': 'test',
      'lastName': 'test',
      'username': 'test',
      'password': '123456',
      'confirmPassword': '123456',
      'email': 'test@test.com'
    };

    await this.stub(this.userRepo, 'findOne', false);
    await this.stub(this.userRepo, 'create', bodyUser);
    await this.stub(this.authService.unitOfWork.context, 'commit', true);

    userEmail = bodyUser.email;
    const result = await this.authService.createUser(bodyUser, 'staff');

    expect(result).to.be.an('object');
    expect(result).to.have.property('firstName');
    expect(result).to.have.property('lastName');
    expect(result).to.have.property('username');
  });

  it('resetPassword: should return an object', async function () {
    await this.stub(this.userRepo, 'findOne', true);
    await this.stub(this.authService, 'setEmailBodyResetPassword', '');
    await this.stub(this.authService.mailerService, 'sendMail', {accepted: [userEmail], rejected: []});

    const result = await this.authService.resetPassword(userEmail);
    expect(result).to.be.an('object');
    expect(result).to.have.property('accepted');
    expect(result.accepted).to.be.an('array');
    expect(result.accepted[0]).to.equal(userEmail);
  });

  it('verifyResetToken: should return ture if reset token found', async function () {
    await this.stub(this.userRepo, 'findOne', '59b64ee90ac3a347330422e9');

    const result = await this.authService.verifyResetToken('59b64ee90ac3a347330422e9');
    expect(result).to.equal(true);
  });

  it('resetPasswordUpdate: should return ture if reset token updated', async function () {
    await this.stub(this.authService, 'verifyResetToken', true);
    await this.stub(this.authService, 'getHash', true);
    await this.stub(this.userRepo, 'updateOne', true);

    const result = await this.authService.resetPasswordUpdate('123456', '59b64ee90ac3a347330422e9');
    expect(result).to.equal(true);
  });
}));
