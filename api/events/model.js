'use strict';

const _     = require('lodash')
  , uuid    = require('node-uuid')
  , redis   = require('../../lib/redis')
  , name    = 'events';

exports.findAll = function* () {
  return yield redis.hgetall(name);
};

exports.find = function* (login) {
  let key = name + ':' + login;
  let evts = yield redis.lrange(key, 0, -1);
  return evts.map(JSON.parse);
};

exports.get = function* (login, id) {
  let key = name + ':' + login;
  return yield redis.hgetall(key + ':' + id);
};

exports.create = function* (login, evt) {
  let key = name + ':' + login
    , action = 'created'
    , id = uuid.v1();

  evt = _.assign(evt, {
    id: id,
    status: 'active'
  });

  let args = [action, key, evt, login];

  try {
    return yield saveAndReturn.apply(this, args);
  } catch(err) {
    throw err;
  }
};

exports.update = function* (login, evt) {
  let key = name + ':' + login
    , action = 'updated'
    , args = [action, key, evt, login];

  try {
    return yield saveAndReturn.apply(this, args);
  } catch(err) {
    throw err;
  }
};

exports.delete = function* (login, id) {
  id || (id = 0);
  let key = name + ':' + login;
  try {
    let evt = yield this.get(login, id);
    let args = [key, id, evt];
    return yield del.apply(null, args);
  } catch(err) {
    throw err;
  }
};

function* saveAndReturn(action, key, evt, login) {
  let args = [action, key, evt];
  yield save.apply(null, args);
  return yield this.get(login, evt.id);
}

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
