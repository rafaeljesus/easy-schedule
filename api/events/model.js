'use strict';

var BPromise  = require('bluebird')
  , redis     = require('../../lib/redis');

module.exports = {

  find: BPromise.method(function(key) {
    return redis
      .hgetall('events-' + key)
      .then(function(res) {
        return res;
      });
  }),

  get: BPromise.method(function(key, id) {
    return redis
      .hgetall('events-' + key)
      .then(function(res) {
        if (res.id === id) return res;
      });
  }),

  schedule: BPromise.method(function(key, event) {
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
