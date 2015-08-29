'use strict'

const redis = require('../../lib/redis')
  , name    = 'history'

exports.find = function* (login) {
  let key = name + ':' + login

  try {
    let evts = yield redis.lrange(key, 0, -1)
    return evts.map(JSON.parse)
  } catch(err) {
    throw err
  }
}

exports.create = function* (login, data) {
  let key = name + ':' + login

  try {
    return yield redis.lpush(key, stringify(data))
  } catch(err) {
    throw err
  }
}

function stringify(data) {
  return JSON.stringify(data);
}
