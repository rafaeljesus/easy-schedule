'use strict';

const redis = require('../../lib/redis');

exports.find = function(key) {
  return redis.hgetall('events-' + key);
};

exports.get = function(key, id) {
  return redis
    .hgetall('events-' + key)
    .then(function(res) {
      if (res.id === id) return res;
    });
};

exports.schedule = function(key, event) {
  return redis.hmset('events-' + key, event);
};

exports.delete = function(key) {
  return redis.del('events-' + key);
};
