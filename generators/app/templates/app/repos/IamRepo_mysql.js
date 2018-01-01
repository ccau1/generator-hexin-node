'use strict';

const SequelizeGenericRepository = require('hexin-core/repos/SequelizeGenericRepository');

class IamRepo extends SequelizeGenericRepository {
  constructor(ctxt) {
    super(ctxt.Iam, ctxt);
  }
}

module.exports = IamRepo;
