'use strict';

const UnitOfWorkBase = require('hexin-core/repos/UnitOfWorkBase');

const UserRepo = require('./UserRepo');

class UnitOfWork extends UnitOfWorkBase {
  get UserRepository() {
    if (!this.userRepository) {
      this.userRepository = new UserRepo(this.context);
    }
    return this.userRepository;
  }
}

module.exports = UnitOfWork;
