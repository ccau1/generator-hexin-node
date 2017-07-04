'use strict';

const {AppStartConfig} = require('hexin-core');

module.exports = class UnitOfWorkConfig extends AppStartConfig {
  init(next) {
    const {router} = this.appConfig;
    router.use(this.middleware.bind(this));
    this.ModelContext = require('../app/models/ModelContext');
    this.UnitOfWork = require('../app/repos/_unitOfWork');
    next();
  }

  middleware(req, res, next) {
    const {UnitOfWork, ModelContext} = this;
    if (!req.unitOfWork) {
      req.unitOfWork = new UnitOfWork(new ModelContext());
      req.unitOfWork.init().then(result => {
        next();
      });
    }
    res.on('finish', () => {
      if (req.unitOfWork && req.unitOfWork.context && req.unitOfWork.context.commit) {
        req.unitOfWork.context.commit(false);
      }
    });
  }
};
