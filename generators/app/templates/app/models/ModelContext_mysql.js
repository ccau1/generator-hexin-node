'use strict';

const SequelizeDbContext = require('@httpeace_deploy/httpeace-node-core/models/SequelizeDbContext');
const User = require('./User');
const Iam = require('./Iam');
const sequelizeConnection = require('@httpeace_deploy/httpeace-node-core/helpers/Database').getConnection();

class ModelContext extends SequelizeDbContext {
  constructor() {
    super(sequelizeConnection);

    this.User = User;
    this.Iam = Iam;
  }
}

module.exports = ModelContext;
