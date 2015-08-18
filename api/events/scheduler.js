'use strict'

const co        = require('co')
  , request     = require('co-request')
  , _           = require('lodash')
  , schedule    = require('node-schedule')
  , Event       = require('../events/model')
  , History     = require('../history/model')

let Scheduler = function(emitter) {
  if (!(this instanceof Scheduler)) return new Scheduler(emitter)
  _.bindAll(this, 'handleMessage');
  emitter.on('schedule:created', this.handleMessage)
  emitter.on('schedule:updated', this.handleMessage)
  emitter.on('schedule:deleted', this.handleMessage)
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
    console.log('Scheduler start failed', err)
  }

  return co(findAll)
    .then(onFulfilled)
    .catch(onRejected)
}

Scheduler.prototype.handleMessage = function(payload) {
  let evt = payload.body
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
  let cron = evt.cron ?
    evt.cron :
    new Date(evt.when)

  let cb = this._onEvent.bind(null, evt)
    , job = schedule.scheduleJob(cron, cb)

  this.jobs[evt.id] = job
}

Scheduler.prototype._onEvent = function(evt) {
  let callHttp = function* () {
    return yield request(evt.url)
  }

  let saveHistory = function(res) {
    res = _.result(res, 'statusCode', 'body', 'headers')

    let login = 'rafaeljesus'
      , history = _.extend(res, {
        event: evt.id
        , url: evt.url
      })

    return co(function* () {
      return yield History.create(login, history)
    })
  }

  let onFulfilled = function(res) {
    console.log('succesfully sent cron job request', res)
  }

  let onRejected = function(err) {
    console.log('failed to send cron job request', err)
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
