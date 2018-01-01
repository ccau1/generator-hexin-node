'use strict';

const MongoGenericRepository = require('hexin-core/repos/MongoGenericRepository');

class IamRepo extends MongoGenericRepository {
  constructor(ctxt) {
    super(ctxt.Iam, ctxt);
  }
}

module.exports = IamRepo;
