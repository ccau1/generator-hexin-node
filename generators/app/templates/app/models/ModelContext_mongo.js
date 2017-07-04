'use strict';

const MongoDbContext = require('hexin-core/models/MongoDbContext');
const User = require('./User');
const mongoConnection = require('hexin-core/helpers/Database').getConnection('mongo-db');

class ModelContext extends MongoDbContext {
  constructor() {
    super(mongoConnection);

    this.User = User;
  }
}

module.exports = ModelContext;
