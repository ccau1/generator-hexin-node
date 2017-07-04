'use strict';

const SequelizeDbContext = require('hexin-core/models/SequelizeDbContext');
const User = require('./User');
const sequelizeConnection = require('hexin-core/helpers/Database').getConnection('mysql-db');

class ModelContext extends SequelizeDbContext {
  constructor() {
    super(sequelizeConnection);

    this.User = User;
  }
}

module.exports = ModelContext;
