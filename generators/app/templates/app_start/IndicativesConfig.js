const { AppStartConfig } = require('@httpeace_deploy/httpeace-node-core');
const indicatives = require('../app/helpers/indicatives');

module.exports = class IndicativesConfig extends AppStartConfig {
  init(next) {
    // init custom indicatives
    indicatives.init();
    next();
  }
};
