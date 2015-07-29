'use strict';

let _       = require('lodash')
  , uuid    = require('node-uuid')
  , redis   = require('../../lib/redis')
  , name    = 'events';

exports.find = function* (acckey) {
  let key = name + ':' + acckey;
  let evts = yield redis.lrange(key, 0, -1);
  return evts.map(JSON.parse);
};

exports.get = function* (acckey, id) {
  let key = name + ':' + acckey;
  return yield redis.hgetall(key + ':' + id);
};

exports.schedule = function* (acckey, evt) {
  evt = _.assign(evt, {
    id: uuid.v4(),
    status: 'active'
  });

  let key = name + ':' + acckey;
  let evtfy = JSON.stringify(evt);

  yield [
    redis.hmset(key + ':' + evt.id, evt),
    redis.lpush(key, evtfy),
    redis.publish('schedule:new', evtfy)
  ];

  return yield this.get(acckey, evt.id);
};

exports.delete = function(acckey) {
  return redis.del(name + ':' + acckey);
};
