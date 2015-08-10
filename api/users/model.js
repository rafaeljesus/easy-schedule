'use strict';

const redis = require('../../lib/redis')
  , crypto  = require('crypto')
  , name    = 'users';

exports.create = function* (login, password) {
  password = hashDigest.call(null, password);
  let key = name + ':' + login + ':' + password;
  let user = {
    login: login,
    password: password,
    createdAt: new Date()
  };
  return yield redis.hmset(key, user);
};

exports.auth = function* (login, password) {
  password = hashDigest.call(null, password);
  let key = name + ':' + login + ':' + password;
  return yield redis.hgetall(key);
};

exports.delete = function* (login, password) {
  password = hashDigest.call(null, password);
  let key = name + ':' + login + ':' + password;
  return yield redis.del(key);
};

function hashDigest(password) {
  let shaSum = crypto.createHash('sha256');
  shaSum.update(password);
  return shaSum.digest('hex');
}
