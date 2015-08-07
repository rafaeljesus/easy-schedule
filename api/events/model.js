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

exports.create = function* (acckey, evt) {
  let key = name + ':' + acckey;
  let action = 'created';

  evt = _.assign(evt, {
    id: uuid.v4(),
    status: 'active'
  });

  try {
    let args = [action, key, evt];
    yield save.apply(null, args);
    return yield this.get(acckey, evt.id);
  } catch(err) {
    throw err;
  }
};

exports.update = function* (acckey, evt) {
  let key = name + ':' + acckey;
  let action = 'updated';
  try {
    let args = [action, key, evt];
    yield save.apply(null, args);
    return yield this.get(acckey, evt.id);
  } catch(err) {
    throw err;
  }
};

exports.delete = function* (acckey, id) {
  id || (id = 0);
  let key = name + ':' + acckey;
  try {
    let evt = yield this.get(acckey, id);
    let args = [key, id, evt];
    return yield del.apply(null, args);
  } catch(err) {
    throw err;
  }
};

function* del(key, id, evt) {
  let action = 'deleted';
  return yield [
    redis.del(name),
    redis.del(key),
    redis.del(key + ':' + id),
    redis.publish('schedule:' + action, JSON.stringify({
      action: action,
      body: evt
    }))
  ];
}

function* save(action, key, evt) {
  return yield [
    redis.hmset(name, evt),
    redis.hmset(key + ':' + evt.id, evt),
    redis.lpush(key, JSON.stringify(evt)),
    redis.publish('schedule:' + action, JSON.stringify({
      action: action,
      body: evt
    }))
  ];
}
