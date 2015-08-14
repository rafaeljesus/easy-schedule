'use strict'

const co        = require('co')
  , request     = require('co-request')
  , _           = require('lodash')
  , schedule    = require('node-schedule')
  , log         = require('../../lib/log')
  , Event       = require('../events/model')
  , History     = require('../history/model')

let Scheduler = function(redis) {
  if (!(this instanceof Scheduler)) return new Scheduler(redis)
  redis.subscribe('schedule:created')
  redis.subscribe('schedule:updated')
  redis.subscribe('schedule:deleted')
  redis.on('message', this.handleMessage.bind(this))
  this.jobs = {}
  this.start()
}

Scheduler.prototype.start = function() {
  let _this = this
  let findAll = function* () {
    return yield Event.findAll()
  }

  let onFulfilled = function(res) {
    if (!res) return
    if (_.isPlainObject(res)) res = [res]
    res.map(_this._schedule, _this)
  }

  let onRejected = function(err) {
    log.error('Scheduler start failed', err)
  }

  return co(findAll)
    .then(onFulfilled)
    .catch(onRejected)
}

Scheduler.prototype.handleMessage = function(channel, message) {
  let payload = JSON.parse(message)
    , evt = payload.body
    , action = payload.action

  if (action === 'created') {
    this._schedule(evt)
  } else {
    this.jobs[evt.id].cancel()
    delete this.jobs[evt.id]
    if (action === 'updated') this._schedule(evt)
  }
}

Scheduler.prototype._schedule = function(evt) {
  let cron = evt.cron ? evt.cron : new Date(evt.when)
    , cb = this._onEvent.bind(null, evt)
    , job = schedule.scheduleJob(cron, cb)

  this.jobs[evt.id] = job
}

Scheduler.prototype._onEvent = function(evt) {
  let callHttp = function* () {
    return yield request(evt.url)
  }

  let saveHistory = function* (res) {
    res = _.result(res, 'statusCode', 'body', 'headers')
    let login = 'rafaeljesus'
      , history = _.extend(res, {
        event: evt.id
        , url: evt.url
      })
    yield History.create(login, history)
  }

  let onFulfilled = function(res) {
    log.info('succesfully sent cron job request', res)
  }

  let onRejected = function(err) {
    log.error('failed to send cron job request', err)
  }

  return co(callHttp)
    .then(saveHistory)
    .then(onFulfilled)
    .catch(onRejected)
}

Scheduler.use = function() {
  Scheduler.apply(this, arguments)
}

module.exports = Scheduler
