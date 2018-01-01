'use strict';

const {ServiceCrudBase} = require('hexin-core');

module.exports = class IamService extends ServiceCrudBase {
  constructor(context_) {
    super(context_, context_.unitOfWork.IamRepository);
  }

  async getIam(IamUserName) {
    const {_repo} = this;
    const iamUser = await _repo.findOne({'credentials.name': IamUserName});
    return iamUser;
  }
};
