'use strict';

const {expect} = require('chai');
const {serviceTest} = require('../../helper');

const IamService = require('../../../app/services/IamService');

describe('Unit Testing: Service: Iam', serviceTest({
  iamService: (base) => new IamService(base)
}, function () {
  it('getIam: should return object', async function () {
    const iamRepo = this.unitOfWork.IamRepository;
    await this.stub(iamRepo, 'findOne', {});

    const result = await this.iamService.getIam('test_iam_user');
    expect(result).to.be.an('object');
  });
}));
