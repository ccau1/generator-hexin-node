'use strict';

const {ControllerBase} = require('@httpeace_deploy/httpeace-node-core');

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
