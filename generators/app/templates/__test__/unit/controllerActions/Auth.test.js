'use strict';

const {expect} = require('chai');
const {controllerTest} = require('../../helper');
const mongoose = require('mongoose');
const mongoId = mongoose.Types.ObjectId();

const ControllerActions = require('../../../app/controllersActions/AuthActions');
const AuthService = require('../../../app/services/AuthService');


describe('Unit Testing: Actions: Auth', controllerTest({
  m: async (base) => new AuthService(base)
}, function () {
  it('registerUser: should return an object', async function () {
    await this.stub(this.m, 'createUser', {});
    const req = Object.assign({}, this, {
      body: { // below object is not validated
        'firstName': 'pahak',
        'lastName': 'rai',
        'email': 'pahak@hexin.com',
        'username': 'pahak',
        'password': '45187801',
        'confirmPassword': '45187801'
      }
    });
    await ControllerActions.registerUser(req, this.res);
    const {result} = this.res;
    expect(result).to.be.an('object');
  });
  it('getUserToken: should return an object', async function () {
    await this.stub(this.m, 'generateJwtToken', true);
    const req = Object.assign({}, this, {
      body: {
      },
      _passport: {
        session: {
          user: {
            id: mongoId
          }
        }
      }
    });
    await ControllerActions.getUserToken(req, this.res);
    const {result} = this.res;
    expect(result).to.be.an('object');
  });
  it('loginFacebook: should return an object', async function () {
    await this.stub(this.m, 'generateJwtToken', true);
    const req = Object.assign({}, this, {
      body: {
      },
      _passport: {
        session: {
          user: {
            id: mongoId
          }
        }
      }
    });
    await ControllerActions.loginFacebook(req, this.res);
    const {result} = this.res;
    expect(result).to.be.an('object');
  });
  it('loginGoogle: should return an object', async function () {
    await this.stub(this.m, 'generateJwtToken', true);
    const req = Object.assign({}, this, {
      body: {
      },
      _passport: {
        session: {
          user: {
            id: mongoId
          }
        }
      }
    });
    await ControllerActions.loginGoogle(req, this.res);
    const {result} = this.res;
    expect(result).to.be.an('object');
  });
  it('resetPassword: should return an object', async function () {
    await this.stub(this.m, 'resetPassword', {});
    const req = Object.assign({}, this, {
      body: { // below object is not validated
        'email': 'pahak@hexin.com'
      }
    });
    await ControllerActions.resetPassword(req, this.res);
    const {result} = this.res;
    expect(result).to.be.an('object');
  });
  it('resetPasswordVerify: should return an object', async function () {
    await this.stub(this.m, 'verifyResetToken', true);
    const req = Object.assign({}, this, {
      params: { // below object in not validated
        'token': 'testtoken'
      }
    });
    await ControllerActions.resetPasswordVerify(req, this.res);
    const {result} = this.res;
    expect(result).to.be.an('object');
  });
  it('resetPasswordUpdate: should return an object', async function () {
    await this.stub(this.m, 'resetPasswordUpdate', true);
    const req = Object.assign({}, this, {
      body: {
        'password': 'testpassword'
      },
      params: { // below object in not validated
        'token': 'testtoken'
      }
    });
    await ControllerActions.resetPasswordUpdate(req, this.res);
    const {result} = this.res;
    expect(result).to.be.an('object');
  });
  it('logoutUser: should return an object', async function () {
    const req = Object.assign({}, this, {});
    await ControllerActions.logoutUser(req, this.res);
    const {result} = this.res;
    expect(result).to.be.an('object');
  });
  it('loginFacebookFail: should return an object', async function () {
    const req = Object.assign({}, this, {});
    await ControllerActions.loginGoogleFail(req, this.res);
    const {result} = this.res;
    expect(result).to.be.an('object');
  });
  it('loginGoogleFail: should return an object', async function () {
    const req = Object.assign({}, this, {});
    await ControllerActions.loginGoogleFail(req, this.res);
    const {result} = this.res;
    expect(result).to.be.an('object');
  });
}));
