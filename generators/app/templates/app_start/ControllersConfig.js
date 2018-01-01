const { AppStartConfig } = require('@httpeace_deploy/httpeace-node-core');
const fs = require('fs');
const path = require('path');
const PluginManager = require('../app/helpers/PluginManager');

module.exports = class ControllersConfig extends AppStartConfig {
  init(next) {
    const controllers = [];
    this.handleControllers(
      path.join(__dirname, '../app/controllers'),
      controllers
    ).then(() => {
      const controllersWithoutServiceClass = controllers.filter(
        c => !Object.keys(c.ctrl).length
      );
      if (controllersWithoutServiceClass.length) {
        console.warn(
          '## following controllers does not have a proper service class:\n',
          controllersWithoutServiceClass.map(c => c.name)
        );
      }
      next();
    });
  }

  handleControllers(dir, controllers = []) {
    const { router } = this.appConfig;
    let promises = [];

    promises = promises.concat(PluginManager.manager().setControllers(router));

    fs.readdirSync(dir).forEach(file => {
      const fileFullPath = `${dir}/${file}`;
      if (fs.statSync(fileFullPath).isDirectory()) {
        promises.push(this.handleControllers(fileFullPath, controllers));
      } else if (file.split('.').pop() === 'js' && !/^_.*$/.test(file)) {
        const Controller = require(fileFullPath); // eslint-disable-line import/no-dynamic-require
        promises.push(
          controllers.push({
            ctrl: new Controller(router),
            name: file.replace(/\.[^/.]+$/, ''),
            file,
            path: dir,
            fullPath: fileFullPath
          })
        );
      }
    });

    return Promise.all(promises);
  }
};
