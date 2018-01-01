'use strict';

const SequelizeGenericRepository = require('@httpeace_deploy/httpeace-node-core/repos/SequelizeGenericRepository');

class UserRepo extends SequelizeGenericRepository {
  constructor(ctxt) {
    super(ctxt.User, ctxt);
  }
}

module.exports = UserRepo;
