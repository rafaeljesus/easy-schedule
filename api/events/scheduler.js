'use strict'

const co        = require('co')
  , request     = require('co-request')
  , _           = require('lodash')
  , cluster     = require('cluster')
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
  this.runningJobs = {}

  if (cluster.worker && cluster.worker.id === 1) {
    this.start()
  }
}

Scheduler.prototype.start = function() {
  let _this = this
  return co(function* () {
    let res = yield Event.findAll()
    if (!res || _.isNull(_.first(res))) return
    if (_.isPlainObject(res)) res = [res]
    res.map(_this._schedule, _this)
  }).catch(function(err) {
    log.error('scheduler start failed', err)
  })
}

Scheduler.prototype.handleMessage = function(channel, message) {
  let payload = JSON.parse(message)
    , evt = payload.body
    , action = payload.action

  if (action === 'created') {
    this._schedule(evt)
  } else {
    let job = this.runningJobs[evt.id]
    if (job) {
      job.cancel()
      job = undefined
    }
    if (action === 'updated') this._schedule(evt)
  }
}

Scheduler.prototype._schedule = function(evt) {
  let cron = evt.cron
    ? evt.cron
    : new Date(evt.when)

    , cb = this._onEvent.bind(this, evt)
    , job = schedule.scheduleJob(cron, cb)

  this.runningJobs[evt.id] = job
  log.info('succesfully scheduled job', evt)
}

Scheduler.prototype._onEvent = function(evt) {
  return co(function* () {
    let res = yield request(evt.url)
    res = _.result(res, 'statusCode', 'body', 'headers')
    log.info('succesfully sent cron job request', res)

    let login = 'rafaeljesus'
      , history = _.assign(res, {
        event: evt.id
        , url: evt.url
      })

    yield History.create(login, history)
  })
  .catch(function(err) {
    log.error('failed to send cron job request', err)
  })
}

Scheduler.use = function() {
  Scheduler.apply(this, arguments)
}

module.exports = Scheduler
