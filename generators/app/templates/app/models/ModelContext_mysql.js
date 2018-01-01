'use strict';

const SequelizeDbContext = require('hexin-core/models/SequelizeDbContext');
const User = require('./User');
const Iam = require('./Iam');
const sequelizeConnection = require('hexin-core/helpers/Database').getConnection();

class ModelContext extends SequelizeDbContext {
  constructor() {
    super(sequelizeConnection);

    this.User = User;
    this.Iam = Iam;
  }
}

module.exports = ModelContext;
