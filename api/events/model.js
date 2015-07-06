'use strict';

var assert    = require('assert')
  , BPromise  = require('bluebird')
  , redis     = require('../../lib/redis');

module.exports = {

  find: BPromise.method(function(key) {
    assert(!!key, 'Key is mandatory');

    return redis
      .hgetall('events-' + key)
      .then(function(res) {
        return res;
      });
  }),

  schedule: BPromise.method(function(key, event) {
    assert(!!key, 'Key is mandatory');

    return redis
      .hmset('events-' + key, event)
      .then(function(res) {
        return res;
      });
  }),

  delete: BPromise.method(function(key) {
    return redis
      .del('events-' + key)
      .then(function(res) {
        return res;
      });
  })

};
