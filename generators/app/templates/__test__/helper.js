'use strict';

const sinon = require('sinon');
const bootstrap = require('./bootstrap.js');
const Locale = require('hexin-core/helpers/Locale');
const path = require('path');
const PluginManager = require('../app/helpers/PluginManager');
const configs = require('../configs').getBase();
const jwt = require('jwt-simple');
const MongoGenericRepository = require('hexin-core/repos/MongoGenericRepository');
const Error = require('hexin-core/helpers/Error');

// const proxyquire = require('proxyquire');
const mongooseMock = require('./mongooseMock');
// const UnitOfWork = require('../app/repos');

const mock = require('mock-require');
mock('hexin-core/helpers/Database', {
  getConnection: () => mongooseMock
});
// MongoGenericRepository.prototype.handleCall = () => [];
Error.setGlobal();

module.exports = {
  getLocales: function () {
    const locale = new Locale({
      default: 'en',
      sources: [
        path.dirname(require.main.filename) + '/locales',
        PluginManager.manager().setLocales()
      ],
      accept: {
        zh_HK: ['zh_HK'],
        zh_CN: ['zh_CN'],
        en: ['en-us', 'en-au', 'en-bz', 'en-zw', 'en-gb', 'en-tt', 'en-za', 'en-ph', 'en-nz', 'en-jm', 'en-ie', 'en-ca']
      }
    });

    return locale;
  },
  baseTest: function (globalVar, callback, customFn) {
    let _callback = callback;
    let _globalVar = globalVar;
    if (!callback) {
      _callback = globalVar;
      _globalVar = null;
    }

    return function () {
      customFn(async (beFn) => {
        this.setRepo = async (repo) => {
          await this.stub(repo, 'handleCall', []);
          return repo;
        };

        beforeEach(function (done) {
          this.sinon = sinon.sandbox.create();
          this.stub = async (className, functionName, returnValue) => {
            return this.sinon.stub(className, functionName)
              .returns(Promise.resolve(returnValue));
          };
          this.mock = this.sinon.mock;
          this.spy = this.sinon.spy;

          beFn.bind(this)(async () => {
            if (globalVar) {
              const varKeys = Object.keys(globalVar);
              let varKey = null;
              for (let i = 0; i < varKeys.length; i++) {
                varKey = varKeys[i];
                this[varKey] = await (globalVar[varKey].bind(this))(this);
              }
            }
            done();
          });
        });
      }, async (aeFn) => {
        afterEach(function (done) {
          this.sinon.restore();
          aeFn.bind(this)(done);
        });
      });

      _callback.bind(this)();
    };
  },
  repoTest: function (globalVar, callback) {
    const {baseTest} = module.exports;

    return baseTest(globalVar, callback, function (beforeEach, afterEach) {
      beforeEach(function (done) {
        const ModelContext = require('../app/models');
        const UnitOfWork = require('../app/repos');
        this.modelContext = new ModelContext();
        this.unitOfWork = new UnitOfWork(this.modelContext);
        done();
      });
      afterEach(function (done) {
        done();
      });
    });
  },
  serviceTest: function (globalVar, callback) {
    const {baseTest} = module.exports;

    return baseTest(globalVar, callback, function (beforeEach, afterEach) {
      beforeEach(function (done) {
        const ModelContext = require('../app/models');
        const UnitOfWork = require('../app/repos');
        this.modelContext = new ModelContext();
        this.unitOfWork = new UnitOfWork(this.modelContext);
        this.locale = {t: () => 'translated', lang: 'en'};
        done();
      });
      afterEach(function (done) {
        done();
      });
    });
  },
  controllerTest: function (globalVar, callback) {
    const {baseTest} = module.exports;

    return baseTest(globalVar, callback, function (beforeEach, afterEach) {
      beforeEach(function (done) {
        const ModelContext = require('../app/models');
        const UnitOfWork = require('../app/repos');
        this.modelContext = new ModelContext();
        this.unitOfWork = new UnitOfWork(this.modelContext);
        this.locale = {t: () => 'translated', lang: 'en'};

        this.current_user = {
          _id: '88d996d1849ff06e84762ad5',
          firstName: 'firstname',
          lastName: 'lastname',
          avatars: []
        };
        this.res = {
          json: function (obj) {
            this.result = obj;
            return obj;
          },
          send: function (obj) {
            this.result = obj;
            return obj;
          },
          status: function () { return this; }
        };

        done();
      });
      afterEach(function (done) {
        done();
      });
    });
  }
};
