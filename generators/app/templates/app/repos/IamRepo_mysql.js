'use strict';

const SequelizeGenericRepository = require('@httpeace_deploy/httpeace-node-core/repos/SequelizeGenericRepository');

class IamRepo extends SequelizeGenericRepository {
  constructor(ctxt) {
    super(ctxt.Iam, ctxt);
  }
}

module.exports = IamRepo;