'use strict'

const redis = require('../../lib/redis')
  , C       = require('../../lib/constants')

exports.find = function* (login) {
  let key = C.HISTORY + ':' + login
    , evts = yield redis.lrange(key, 0, -1)

  return evts.map(JSON.parse)
}

exports.create = function* (login, data) {
  let key = C.HISTORY + ':' + login
  return yield redis.lpush(key, stringify(data))
}

function stringify(data) {
  return JSON.stringify(data);
}
