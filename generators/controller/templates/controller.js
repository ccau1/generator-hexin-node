'use strict';

const co = require('co');
const {ControllerBase} = require('hexin-core');

// Service
const AuthService = new require('../services/AuthService');

module.exports = class AuthController extends ControllerBase {
  constructor(app) {
    super(app, 'auth', AuthService);
  }

  renderRoutes(router) {
    const {authorize} = this;
  }
}
