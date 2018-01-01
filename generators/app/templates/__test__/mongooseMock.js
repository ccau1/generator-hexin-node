'use strict';

const sinon = require('sinon');
const events = require('events');

const mongoose = {};
module.exports = mongoose;

// Mongoose-mock emits events
// when Models or Documents are created.
// This allows for the mock injector to get notifications
// about use of the mock and get a chance to access
// the mocked models and document produced.
events.EventEmitter.call(mongoose);
mongoose.__proto__ = events.EventEmitter.prototype; // jshint ignore:line

// ## Schema
const Schema = function () {
  function Model(properties) {
    const self = this;

    if (properties) {
      Object.keys(properties).forEach(function (key) {
        self[key] = properties[key];
      });
    }
    this.save = sinon.stub();
    this.increment = sinon.stub();
    this.remove = sinon.stub();
    mongoose.emit('document', this);
  }

  Model.statics = {};
  Model.methods = {};
  Model.static = sinon.stub();
  Model.method = sinon.stub();
  Model.pre = sinon.stub();

  Model.path = function () {
    return {
      validate: sinon.stub()
    };
  };

  Model.virtual = function () {
    function SetterGetter() {
      return {
        set: function () {
          return new SetterGetter();
        },
        get: function () {
          return new SetterGetter();
        }
      };
    }
    return new SetterGetter();
  };

  const stubFn = (returnObj = []) => () => {
    const modelReturn = Object.assign({}, Model, {
      then: (fn) => {
        modelReturn.obj = fn(modelReturn.obj ? modelReturn.obj : returnObj);
        return modelReturn;
      },
      catch: () => {
        return modelReturn;
      }
    });
    return modelReturn;
  };

  Model.aggregate = stubFn();
  Model.count = stubFn();
  Model.create = stubFn({});
  Model.distinct = stubFn();
  Model.ensureIndexes = stubFn();
  Model.find = stubFn([]);
  Model.findById = stubFn({});
  Model.findByIdAndRemove = stubFn({});
  Model.findByIdAndUpdate = stubFn({});
  Model.findOne = stubFn({});
  Model.findOneAndRemove = stubFn({});
  Model.findOneAndUpdate = stubFn({});
  Model.geoNear = stubFn();
  Model.geoSearch = stubFn();
  Model.index = stubFn();
  Model.mapReduce = stubFn();
  Model.plugin = stubFn();
  Model.populate = stubFn();
  Model.remove = stubFn();
  Model.set = stubFn();
  Model.update = stubFn([]);
  Model.where = stubFn([]);
  Model.sort = stubFn();
  Model.skip = stubFn();
  Model.limit = stubFn();
  Model.lean = stubFn();

  mongoose.emit('model', Model);
  return Model;
};

// compiled models are stored in models_
// and may be retrieved by name.
const models_ = {};
function createModelFromSchema(name, Type) {
  if (Type) {
    if (Type.statics) {
      Object.keys(Type.statics).forEach(function (key) {
        Type[key] = Type.statics[key];
      });
    }
    if (Type.methods) {
      Object.keys(Type.methods).forEach(function (key) {
        Type.prototype[key] = Type.methods[key];
      });
    }
    models_[name] = Type;
  }
  return models_[name];
}

mongoose.Types = {ObjectId: (id) => id};
mongoose.Schema = Schema;
mongoose.Schema.Types = {ObjectId: ''}; // Defining mongoose types as dummies.
mongoose.model = createModelFromSchema;
mongoose.connect = sinon.stub;
