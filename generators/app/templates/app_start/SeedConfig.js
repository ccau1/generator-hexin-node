const { AppStartConfig } = require('hexin-core');
const Seeder = require('hexin-core/helpers/Seeder');
const Database = require('hexin-core/helpers/Database');
// plugin models
// const Plugin_PageModel = require('hexin-core-plugins/hexin-plugin-page-node/models/Page');

module.exports = class SeedConfig extends AppStartConfig {
  init(next) {
    const { seed } = this.appConfig;

    const ModelContext = require('../app/models');

    new Seeder()
      // if isEnabled is false, the seed will not run
      .isEnabled(seed ? seed.enable : false)

      // showLog is a switch to show/hide logs inside seed
      .showLog(seed ? seed.showLog : false)

      // clearAllCollections clears all existing collections. Alternatively,
      // you can you clearCollections([]) to specify which collections to clear
      .clearAllCollections()

      // onlyPopulateEmptyCollection will only populate on models that have no documents
      // .onlyPopulateEmptyCollection()

      // addDatas accepts either string (path) or array
      .addDatas([
        <% if (pagePlugin) {%>'./app/seeds/page.json',<%} %>
        './app/seeds/iam.json',
        './app/seeds/user.json'
      ])

      // This is for registering the models to use
      // addModels accepts either string (path) or function that returns a mongoose
      .registerModels([() => ModelContext])

      // pre-load settings, and pass mongoose connection into next()
      .connection(next_ => {
        next_(Database.getConnection());
      })

      // init is required to put all above statements into action. Callback
      // in first argument
      .init(() => {
        if (seed && seed.enable) {
          console.info('Seeding completed.');
        }
        next();
      })
      .catch(err => {
        if (seed && seed.enable) {
          console.info('Seeding failed.');
        }
        console.warn(err);
      });
  }
};
