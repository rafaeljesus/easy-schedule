'use strict';

const _     = require('lodash')
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

exports.save = function* (acckey, evt) {
  let key = name + ':' + acckey;
  let action = 'updated';

  if (!evt.id) {
    action = 'created';
    evt = _.assign(evt, {
      id: uuid.v4(),
      status: 'active'
    });
  }

  let evtfy = JSON.stringify(evt);
  yield [
    redis.hmset(key + ':' + evt.id, evt),
    redis.lpush(key, evtfy),
    redis.publish('schedule:' + action, evtfy)
  ];

  return yield this.get(acckey, evt.id);
};

exports.delete = function* (acckey, id) {
  id || (id = 0);
  try {
    let key = name + ':' + acckey;
    let res = yield [
      redis.del(key),
      redis.del(key + ':' + id)
    ];
    return res;
  } catch(err) {
    throw err;
  }
};
