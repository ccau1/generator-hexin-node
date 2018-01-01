'use strict';

const {ServiceCrudBase} = require('@httpeace_deploy/httpeace-node-core');

module.exports = class IamService extends ServiceCrudBase {
  constructor(context_) {
    super(context_, context_.unitOfWork.IamRepository);
  }

  async getIam(IamUserName) {
    const {_repo} = this;
    const iamUser = await _repo.findOne({'credentials.name': IamUserName});

    const newIamUser = {
        'params':{
            'host': iamUser.host, 
            'port': iamUser.port
        },
        'credentials':{
            'accessKeyId': iamUser.accessKeyId,
            'secretAccessKey': iamUser.secretAccessKey
        }
    };
    return newIamUser;
  }
};
