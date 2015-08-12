'use strict';

const co        = require('co')
  , request     = require('co-request')
  , _           = require('lodash')
  , schedule    = require('node-schedule')
  , log         = require('../../lib/log')
  , Event       = require('../events/model')
  , History     = require('../history/model');

let Scheduler = function(redis) {
  if (!(this instanceof Scheduler)) return new Scheduler(redis);
  redis.subscribe('schedule:created');
  redis.subscribe('schedule:updated');
  redis.subscribe('schedule:deleted');
  redis.on('message', this.handleMessage.bind(this));
  this.jobs = {};
  this.start();
};

Scheduler.prototype.start = function() {
  var _this = this;
  return co(function* () {
    try {
      let res = yield Event.findAll();
      if (!res) return;
      if (_.isPlainObject(res)) res = [res];
      res.map(_this._schedule, _this);
    } catch(err) {
      log.error('Scheduler start failed', err);
    }
  });
};

Scheduler.prototype.handleMessage = function(channel, message) {
  let payload = JSON.parse(message)
    , evt = payload.body
    , action = payload.action;

  if (action === 'created') {
    this._schedule(evt);
  } else {
    this.jobs[evt.id].cancel();
    delete this.jobs[evt.id];
    if (action === 'updated') this._schedule(evt);
  }
};

Scheduler.prototype._schedule = function(evt) {
  let cron = evt.cron ? evt.cron : new Date(evt.when)
    , cb = this._onEvent.bind(null, evt)
    , job = schedule.scheduleJob(cron, cb);

  this.jobs[evt.id] = job;
};

Scheduler.prototype._onEvent = function(evt) {
  co(function* () {
    try {
      let login = 'rafaeljesus';
      let res = yield request(evt.url);
      let history = _.extend(
        _.result(res, 'statusCode', 'body', 'headers'), {
        event: evt.id,
        url: evt.url
      });
      yield History.create(login, history);
      log.info('succesfully sent cron job request', history);
      return res;
    } catch(err) {
      log.error('failed to send cron job request', err);
    }
  });
};

Scheduler.use = function() {
  Scheduler.apply(this, arguments);
};

module.exports = Scheduler;
