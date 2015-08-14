'use strict'

const redis = require('../../lib/redis')
  , name    = 'history'

exports.find = function* (login) {
  let key = name + ':' + login
    , evts = yield redis.lrange(key, 0, -1)

  return evts.map(JSON.parse)
}

exports.create = function* (login, data) {
  let key = name + ':' + login

  try {
    return yield redis.lpush(key, JSON.stringify(data))
  } catch(err) {
    throw err
  }
}
