'use strict';

const chai = require('chai');
const expect = chai.expect;

const configs = require('../../configs');

describe('Service:Auth', function () {
  it('test auth 1', function* () {
    configs.init(process.env.NODE_ENV);

    expect(configs.base).to.not.be.undefined;
  });
});
