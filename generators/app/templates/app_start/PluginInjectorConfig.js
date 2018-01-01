const { AppStartConfig } = require('hexin-core');
const PluginManager = require('../app/helpers/PluginManager');
// const IamService = require("../app/services/IamService_mongo");
// const config = require("../configs").getBase();

// Plugins
// const media = require('hexin-core-plugins/hexin-plugin-media-node');
// const page = require('hexin-core-plugins/hexin-plugin-page-node');
// const post = require('hexin-core-plugins/hexin-plugin-post-node');

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
