class PluginManager {
  constructor() {
    this.plugins = [];
  }

  addPlugin(plugin, settings) {
    this.plugins.push(Object.assign({}, plugin, settings));
  }

  setDbContext(ctxt, dbConnection) {
    this.plugins.forEach(plugin => {
      plugin.models.forEach(model => {
        ctxt[model.name] = model.getModel('mongo', dbConnection, plugin);
      });
    });
  }

  setRepos(ctxt, dbContext) {
    this.plugins.forEach(plugin => {
      plugin.repos.forEach(repo => {
        const Repo = repo.repo;
        ctxt[repo.name] = new Repo(dbContext, plugin);
      });
    });
  }

  setControllers(router) {
    const controllers = [];
    this.plugins.forEach(plugin => {
      plugin.controllers.forEach(controller => {
        const Ctrl = controller.controller;
        controllers.push({
          ctrl: new Ctrl(router, plugin),
          name: controller.name,
          file: 'plugin',
          path: 'plugin',
          fullPath: 'plugin'
        });
      });
    });
  }

  setLocales() {
    const result = {};
    this.plugins.forEach(plugin => {
      if (plugin.locale) {
        Object.keys(plugin.locale).forEach(localeKey => {
          result[localeKey] = Object.assign(
            {},
            result[localeKey],
            plugin.locale[localeKey]
          );
        });
      }
    });
    return result;
  }
}

module.exports = PluginManager;

module.exports._manager = null;
module.exports.manager = () => {
  if (!module.exports._manager) {
    module.exports._manager = new PluginManager();
  }

  return module.exports._manager;
};
