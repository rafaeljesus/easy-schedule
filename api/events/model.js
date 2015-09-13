'use strict'

const _     = require('lodash')
  , uuid    = require('node-uuid')
  , redis   = require('../../lib/redis')
  , C       = require('../../lib/constants')

exports.findAll = function* () {
  return yield redis.hgetall(C.EVENTS)
}

exports.find = function* (login) {
  let key = C.EVENTS + ':' + login
    , evts = yield redis.lrange(key, 0, -1)

  return evts.map(JSON.parse)
}

exports.get = function* (login, id) {
  let key = C.EVENTS + ':' + login
  return yield redis.hgetall(key + ':' + id)
}

exports.create = function* (login, evt) {
  let key = C.EVENTS + ':' + login
    , id = uuid.v1()

  evt = _.assign(evt, {
    id: id,
    status: C.ACTIVE,
    login: login
  })

  let args = [C.CREATED, key, evt, login]

  return yield* saveAndReturn.apply(this, args)
}

exports.update = function* (login, evt) {
  let key = C.EVENTS + ':' + login
    , args = [C.UPDATED, key, evt, login]

  return yield* saveAndReturn.apply(this, args)
}

exports.delete = function* (login, id) {
  id || (id = 0)

  let key = C.EVENTS + ':' + login
  let del = function* (evt) {
    return yield [
      redis.del(C.EVENTS),
      redis.del(key),
      redis.del(key + ':' + id),
      redis.publish('schedule:' + C.DELETED, payload.call(null, C.DELETED, evt))
    ]
  }

  let evt = yield this.get(login, id)
  return yield* del(evt)
}

function* saveAndReturn(action, key, evt, login) {
  yield [
    redis.hmset(C.EVENTS, evt),
    redis.hmset(key + ':' + evt.id, evt),
    redis.lpush(key, JSON.stringify(evt)),
    redis.publish('schedule:' + action, payload.call(null, action, evt))
  ]
  return yield* this.get(login, evt.id)
}

function payload(action, evt) {
  return JSON.stringify({
    action: action,
    body: evt
  })
}
