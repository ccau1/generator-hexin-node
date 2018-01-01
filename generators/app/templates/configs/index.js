const path = require('path');
const fs = require('fs');

const { Config } = require('hexin-core');

module.exports.env = process.env.NODE_ENV || 'development';
module.exports.base = undefined;
module.exports.__global__ = {};
module.exports.constants = undefined;

module.exports.setConstants = constants => {
  this.constants = constants;
};

module.exports.init = function(env) {
  const baseSettings = {
    NODE_ENV: env || this.env
  };

  // if base is already set, don't fetch again
  this.base =
    this.base ||
    Object.assign({}, Config.get('base', baseSettings.NODE_ENV), baseSettings);
};

module.exports.getBase = env => {
  if (!this.base || (env && this.env !== env)) {
    this.env = env || this.env;
    let configFilePath = `${path.dirname(require.main.filename)}/configs/base/${
      this.env
    }.json`;

    if (!fs.existsSync(configFilePath)) {
      configFilePath = `./configs/base/${this.env}.json`;
    }

    this.base = JSON.parse(fs.readFileSync(configFilePath, 'UTF-8'));
  }
  return this.base;
};
