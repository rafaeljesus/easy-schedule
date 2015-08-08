'use strict';

const co        = require('co')
  , request     = require('co-request')
  , _           = require('lodash')
  , Event       = require('../events/model')
  , schedule    = require('node-schedule');

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
      console.log('Scheduler start failed', err);
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
  let cron = evt.cron ?
    evt.cron :
    new Date(evt.when);

  let job = schedule.scheduleJob(cron, this._onEvent.bind(null, evt));
  this.jobs[evt.id] = job;
};

Scheduler.prototype._onEvent = function(evt) {
  co(function* () {
    try {
      let res = yield request(evt.url);
      console.log('succesfully sent cron job request', res.statusCode);
      return res;
    } catch(err) {
      console.log('failed to send cron job request', err);
    }
  });
};

Scheduler.use = function() {
  Scheduler.apply(this, arguments);
};

module.exports = Scheduler;
