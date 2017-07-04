'use strict';

const {AppStartConfig} = require('hexin-core');

module.exports = class RouterConfig extends AppStartConfig {
  init(next) {
    const {app, router, baseUrl} = this.appConfig;

    // Register all our routes with /api
    app.use(baseUrl, router);
    next();
  }
};
