'use strict';

const sequelize = require('@httpeace_deploy/httpeace-node-core/helpers/Database').getConnection('mysql-db');
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

// force: true will drop the table if it already exists
Iam.sync({force: true}).then(() => {
  // Table created
  return Iam.create(
    {
      'type': 'AWS',
      'subType': 'ses',
      'description': 'aws ses (ses-user-wttwe)',
      'secretAccessKey': 'AkkmYQZfIAe4GlMlnijXkHHI8BR0I4cvhet9f+anr7YG',
      'accessKeyId': 'AKIAJ3GRSWSC6YOFZSXA',
      'credentialsName': 'ses-smtp-user.wtt-we',
      'port': 587,
      'host': 'email-smtp.us-west-2.amazonaws.com',
      'isActive': true
    },
    {
      'type': 'AWS',
      'subType': 's3',
      'description': 'aws s3 iam (s3-devcdn-wtt-worldexpress.com)',
      'secretAccessKey': 'AXfNu+818HMhumVq+34Y5J3XMybkiOIctkRFnIzQ',
      'accessKeyId': 'AKIAIIIR5UEZIGC4OU6A',
      'credentialsName': 's3-devcdn-wttwe-user',
      'bucket': 'devcdn.wtt-we.com',
      'host': 's3-ap-southeast-1.amazonaws.com',
      'region': 'ap-southeast-1',
      'isActive': true
    }
  );
});

module.exports = Iam;
