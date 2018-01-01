'use strict';

const path = require('path');

require.main.filename = path.resolve(__dirname) + '/../configs';
const configs = require('../configs');
const constants = require('../configs/constants');
configs.init(process.env.NODE_ENV);
configs.setConstants(constants);

const AppStart = require('../app_start');
module.exports = {
  _appstart: null,
  _fetched: false,
  init: async function () {
    if (!this._fetched) {
      this._appstart = await (new AppStart(configs.getBase('local'))).init();
      this._fetched = true;
    }
    return this._appstart;
  }
};
