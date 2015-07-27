'use strict';

let _       = require('lodash')
  , uuid    = require('node-uuid')
  , redis   = require('../../lib/redis');

exports.find = function* (key) {
  let evts = yield redis.lrange('events-' + key, 0, -1);
  return evts.map(JSON.parse);
};

exports.get = function* (key, id) {
  let evts = yield redis.lrange('events-' + key, 0, -1);
  return _.first(evts
    .map(JSON.parse)
    .filter(function(evt) {
      return evt.id === id;
    }));
};

exports.schedule = function* (key, evt) {
  evt = _.assign(evt, {
    id: uuid.v4()
  });
  return yield redis
    .lpush('events-' + key, JSON.stringify(evt));
    // redis.publish('schedule:start', event);
};

exports.delete = function(key) {
  return redis.del('events-' + key);
};
