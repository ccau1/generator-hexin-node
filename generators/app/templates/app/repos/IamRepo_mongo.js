'use strict';

const MongoGenericRepository = require('@httpeace_deploy/httpeace-node-core/repos/MongoGenericRepository');

class IamRepo extends MongoGenericRepository {
  constructor(ctxt) {
    super(ctxt.Iam, ctxt);
  }
}

module.exports = IamRepo;
