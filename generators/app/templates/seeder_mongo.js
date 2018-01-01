'use strict';

const Seeder = require('@httpeace_deploy/httpeace-node-core/helpers/Seeder');
const DbConfig = require('@httpeace_deploy/httpeace-node-core/app_start/configs/DbConfig');
const Database = require('@httpeace_deploy/httpeace-node-core/helpers/Database');

// configs
const configs = require('./configs');
configs.init(process.env.NODE_ENV);

// plugin models
const Plugin_PageModel = require('@httpeace_deploy/httpeace-plugin-page-node/models/Page');

new Seeder()

  // pre-load settings, and pass mongoose connection into next()
  .connection((next) => {
    (new DbConfig())._preInit(() => {
      next(Database.getConnection());
    }, configs.base);
  })

  // addDatas accepts either string (path) or array
  .addDatas([
    './app/seeds/iam.json',
    './app/seeds/user.json',
    './app/seeds/page.json'
  ])

  // addModels accepts either string (path) or function that returns a mongoose
  .registerModels([
    () => new require('./app/models/ModelContext.js'),
    () => Plugin_PageModel('mongo', Database.getConnection())
  ])

  // clearAllCollections clears all existing collections. Alternatively,
  // you can you clearCollections([]) to specify which collections to clear
  .clearAllCollections()

  // init is required to put all above statements into action. Callback
  // in first argument
  .init(() => process.exit(0));
