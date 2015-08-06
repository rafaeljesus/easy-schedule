'use strict';

const _     = require('lodash')
  , uuid    = require('node-uuid')
  , redis   = require('../../lib/redis')
  , name    = 'events';

exports.findAll = function* () {
  return yield redis.hgetall(name);
};

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

  try {
    yield [
      redis.hmset(name, evt),
      redis.hmset(key + ':' + evt.id, evt),
      redis.lpush(key, JSON.stringify(evt)),
      redis.publish('schedule:' + action, JSON.stringify({
        action: action,
        body: evt
      }))
    ];

    return yield this.get(acckey, evt.id);
  } catch(err) {
    throw err;
  }
};

exports.delete = function* (acckey, id) {
  id || (id = 0);
  try {
    let key = name + ':' + acckey;
    let evt = yield this.get(acckey, id);

    let res = yield [
      redis.del(name),
      redis.del(key),
      redis.del(key + ':' + id),
      redis.publish('schedule:deleted', JSON.stringify({
        action: 'deleted',
        body: evt
      }))
    ];
    return res;
  } catch(err) {
    throw err;
  }
};
