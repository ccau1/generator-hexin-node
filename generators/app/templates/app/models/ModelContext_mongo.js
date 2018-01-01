'use strict';

const MongoDbContext = require('@httpeace_deploy/httpeace-node-core/models/MongoDbContext');
const User = require('./User');
const Iam = require('./Iam');
const mongoConnection = require('@httpeace_deploy/httpeace-node-core/helpers/Database').getConnection();
const PluginManager = require('../helpers/PluginManager');

class ModelContext extends MongoDbContext {
  constructor() {
    super(mongoConnection);

    PluginManager.manager().setDbContext(this, mongoConnection);

    this.User = User;
    this.Iam = Iam;
  }
}

module.exports = ModelContext;
