'use strict';

const {expect} = require('chai');
const {controllerTest} = require('../../helper');
const mongoose = require('mongoose');
const mongoId = mongoose.Types.ObjectId();

const ControllerActions = require('../../../app/controllersActions/AccountActions');
const AccountService = require('../../../app/services/AccountService');

describe('Unit Testing: Actions: Account', controllerTest({
  m: async (base) => new AccountService(base)
}, function () {
  it('getUser: should return an object', async function () {
    const req = Object.assign({}, this, {});
    await ControllerActions.getUser(req, this.res);
    const {result} = this.res;
    expect(result).to.be.an('object');
  });
  it('updateUser: should return an object', async function () {
    await this.stub(this.m, 'updateAccountById', {});
    const req = Object.assign({}, this, {
      body: {
      }
    });
    await ControllerActions.updateUser(req, this.res);
    const {result} = this.res;
    expect(result).to.be.an('object');
  });
  it('getAvatarList: should return an object', async function () {
    await this.stub(this.m, 'getAvatarsByUser', [{}]);
    const req = Object.assign({}, this, {
      body: {
      },
      query: { // object not required but for reference
        default: null
      }
    });
    await ControllerActions.getAvatarList(req, this.res);
    const {result} = this.res;
    expect(result).to.be.an('array');
  });
  it('getUserAvatar: should return an object', async function () {
    await this.stub(this.m, 'getAvatarsById', {});
    const req = Object.assign({}, this, {
      body: {
      },
      params: {
        _id: mongoId
      }
    });
    await ControllerActions.getUserAvatar(req, this.res);
    const {result} = this.res;
    expect(result).to.be.an('object');
  });
  // it('createAvatar: should return an object', async function () {
  //   await this.stub(this.m, 'postAvatar', {});
  //   const req = Object.assign({}, this, {
  //     body: {
  //       _id: 'testId',
  //       avatar: null
  //     }
  //   });
  //   await ControllerActions.createAvatar(req, this.res);
  //   const {result} = this.res;
  //   expect(result).to.be.an('object');
  // });
  // it('updateAvatar: should return an object', async function () {
  //   await this.stub(this.m, 'setDefaultAvatar', {});
  //   const req = Object.assign({}, this, {
  //     body: {
  //     },
  //     params: {
  //       _id: mongoId
  //     }
  //   });
  //   await ControllerActions.updateAvatar(req, this.res);
  //   const {result} = this.res;
  //   expect(result).to.be.an('object');
  // });
  it('deleteAvatar: should return an object', async function () {
    await this.stub(this.m, 'deleteAvatarsById', {});
    const req = Object.assign({}, this, {
      body: {
      },
      params: {
        _id: mongoId
      }
    });
    await ControllerActions.deleteAvatar(req, this.res);
    const {result} = this.res;
    expect(result).to.be.an('object');
  });
}));
