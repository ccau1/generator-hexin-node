const configs = require('./configs');
const AppStart = require('./app_start');
const constants = require('./configs/constants');

// set options in config folder based on NODE_ENV
configs.init(process.env.NODE_ENV);
configs.setConstants(constants);

// trigger app_start calls
new AppStart(configs.base).init().catch(err => {
  // TODO:: log error to log file
  console.error(err);
  process.exit(1);
});
