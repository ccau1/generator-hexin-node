'use strict';

const sequelize = require('hexin-core/helpers/Database').getConnection('mysql-db');
const Sequelize = require('sequelize');

const Iam = sequelize.define('iam', {
  // does not need to define primary key, _id is defined here to sync with mongo structure
  _id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  type: {
    type: Sequelize.STRING
  },
  subType: {
    type: Sequelize.STRING
  },
  description: {
    type: Sequelize.STRING
  },
  secretAccessKey: {
    type: Sequelize.STRING
  },
  accessKeyId: {
    type: Sequelize.STRING
  },
  credentialsName: {
    type: Sequelize.STRING
  },
  port: {
    type: Sequelize.STRING
  },
  host: {
    type: Sequelize.STRING
  },
  bucket: {
    type: Sequelize.STRING
  },
  region: {
    type: Sequelize.STRING
  },
  isActive: {
    type: Sequelize.STRING
  }
});

module.exports = Iam;
