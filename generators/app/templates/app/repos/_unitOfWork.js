'use strict';

const UnitOfWorkBase = require('@httpeace_deploy/httpeace-node-core/repos/UnitOfWorkBase');

const UserRepo = require('./UserRepo');
const IamRepo = require('./IamRepo');

const PluginManager = require('../helpers/PluginManager');

class UnitOfWork extends UnitOfWorkBase {
  constructor(ctxt) {
    super(ctxt);

    PluginManager.manager().setRepos(this, this.context);
  }

  get UserRepository() {
    if (!this.userRepository) {
      this.userRepository = new UserRepo(this.context);
    }
    return this.userRepository;
  }

  get IamRepository() {
    if (!this.iamRepository) {
      this.iamRepository = new IamRepo(this.context);
    }
    return this.iamRepository;
  }
}

module.exports = UnitOfWork;
