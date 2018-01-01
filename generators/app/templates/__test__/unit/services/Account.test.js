'use strict';

const {expect} = require('chai');
const {serviceTest} = require('../../helper');

const AccountService = require('../../../app/services/AccountService');

describe('Unit Testing: Service: Account', serviceTest({
  accountService: (base) => new AccountService(base),
  userRepo: (base) => base.unitOfWork.UserRepository
}, function () {
  it('getAvatarsByUser: should return array of avatars by user', async function () {
    await this.stub(this.userRepo, 'getAvatarsByUser', []);

    const result = await this.accountService.getAvatarsByUser('59b64ee90ac3a347330422e9', {});
    expect(result).to.be.an('array');
  });

  it('getAvatarsById: should return avatar details by user id', async function () {
    await this.stub(this.userRepo, 'getAvatarsById', []);

    const result = await this.accountService.getAvatarsById('59b64ee90ac3a347330422e9', {});
    expect(result).to.be.an('array');
  });

  it('deleteAvatarsById: should return deleted avatar details', async function () {
    await this.stub(this.userRepo, 'deleteAvatarsById', {'n': 1, 'nModified': 1, 'ok': 1});

    const result = await this.accountService.deleteAvatarsById('59b64ee90ac3a347330422e9');
    expect(result).to.be.an('object');
    expect(result.nModified).to.equal(1);
  });


  it('updateAccountById: should return updated user details', async function () {
    await this.stub(this.userRepo, 'findOne', false);
    await this.stub(this.userRepo, 'updateOne', {});

    const current_user = {
      '_id': '59b64ee90ac3a347330422e9'
    };

    const bodyUser = {
      '_id': '59b64ee90ac3a347330422e9',
      'firstName': 'test_updated'
    };

    const result = await this.accountService.updateAccountById(current_user, bodyUser);
    expect(result).to.be.an('object');
  });
}));
