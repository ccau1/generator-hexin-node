const { AppStartConfig } = require('@httpeace_deploy/httpeace-node-core');

module.exports = class RouterConfig extends AppStartConfig {
  init() {
    const { app, router, baseUrl } = this.appConfig;

    // Register all our routes with /api
    app.use(baseUrl, router);
  }
};
