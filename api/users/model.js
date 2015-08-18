'use strict'

const crypto  = require('crypto')
  , redis     = require('../../lib/redis')
  , name      = 'users'

exports.create = function* (login, password) {
  password = hashDigest.call(null, password)
  let key = name + ':' + login + ':' + password
  let user = {
    login: login,
    password: password,
    createdAt: new Date()
  }

  try {
    return yield redis.hmset(key, user)
  } catch(err) {
    throw err
  }
}

exports.auth = function* (login, password) {
  password = hashDigest.call(null, password)
  let key = name + ':' + login + ':' + password
  return yield redis.hgetall(key)
}

exports.delete = function* (login, password) {
  password = hashDigest.call(null, password)
  let key = name + ':' + login + ':' + password

  try {
    return yield redis.del(key)
  } catch(err) {
    throw err
  }
}

function hashDigest(password) {
  let shaSum = crypto.createHash('sha256')
  shaSum.update(password)
  return shaSum.digest('hex')
}
