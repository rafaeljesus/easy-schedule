'use strict'

const _       = require('lodash')
  , uuid      = require('node-uuid')
  , emitter   = require('./emitter')
  , redis     = require('../../lib/redis')
  , name      = 'events'

exports.findAll = function* () {
  let replied = false
  let done = function(err, res) {
    redis.quit()
    if (!replied) {
      if (!err && !res) {
        err = new Error('Conflict detected')
      }
      replied = true
      return res
    }
  }

  redis.once('error', done)
  redis.watch(name)

  try {
    let res = yield redis
      .multi()
      .hgetall(name)
      .exec()
    return done(null, res)
  } catch(err) {
    done(err)
  }
}

exports.find = function* (login) {
  let key = name + ':' + login
    , evts = yield redis.lrange(key, 0, -1)

  return evts.map(JSON.parse)
}

exports.get = function* (login, id) {
  let key = name + ':' + login

  return yield redis.hgetall(key + ':' + id)
}

exports.create = function* (login, evt) {
  let key = name + ':' + login
    , action = 'created'
    , id = uuid.v1()

  evt = _.assign(evt, {
    id: id,
    status: 'active'
  })

  let args = [action, key, evt, login]

  try {
    return yield saveAndReturn.apply(this, args)
  } catch(err) {
    throw err
  }
}

exports.update = function* (login, evt) {
  let key = name + ':' + login
    , action = 'updated'
    , args = [action, key, evt, login]

  try {
    return yield saveAndReturn.apply(this, args)
  } catch(err) {
    throw err
  }
}

exports.delete = function* (login, id) {
  id || (id = 0)

  let action = 'deleted'
    , key = name + ':' + login

  let del = function* (evt) {
    return yield [
      redis.del(name),
      redis.del(key),
      redis.del(key + ':' + id)
    ]
  }

  try {
    let evt = yield this.get(login, id)
      , payload = {action: action, body: evt}
      , res = yield del(evt)

    emitter.emit('schedule:' + action, payload)
    return res
  } catch(err) {
    throw err
  }
}

function* saveAndReturn(action, key, evt, login) {
  let payload = {
    action: action,
    body: evt
  }

  let save = function* () {
    return yield [
      redis.hmset(name, evt),
      redis.hmset(key + ':' + evt.id, evt),
      redis.lpush(key, JSON.stringify(evt))
    ]
  }

  try {
    yield save()
    emitter.emit('schedule:' + action, payload)
    return yield this.get(login, evt.id)
  } catch(err) {
    throw err
  }
}
