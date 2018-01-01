const { AppStartConfig } = require('@httpeace_deploy/httpeace-node-core');
const PluginManager = require('../app/helpers/PluginManager');
// const IamService = require("../app/services/IamService_mongo");
// const config = require("../configs").getBase();

// Plugins
// const media = require('@httpeace_deploy/httpeace-plugin-media-node');
// const page = require('@httpeace_deploy/httpeace-plugin-page-node');
// const post = require('@httpeace_deploy/httpeace-plugin-post-node');

module.exports = class PluginInjectorConfig extends AppStartConfig {
  preInit(next) {
    this.pluginManager = PluginManager.manager();
    // this.pluginManager.addPlugin(media, {iamService: IamService, iams: config.iams});
    // this.pluginManager.addPlugin(page, {});
    // this.pluginManager.addPlugin(post, {});
    next();
  }

  init(next) {
    next();
  }
};
