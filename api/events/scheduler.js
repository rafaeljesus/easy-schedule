'use strict';

const co        = require('co')
  , request     = require('co-request')
  , Event       = require('../events/model')
  , schedule    = require('node-schedule');

let Scheduler = function(redis) {
  if (!(this instanceof Scheduler)) return new Scheduler(redis);
  this.jobs = {};
  redis.subscribe('schedule:created');
  redis.subscribe('schedule:updated');
  redis.on('message', this.handleMessage.bind(this));
  this.start();
};

Scheduler.prototype.start = function* () {
  try {
    let args = yield Event.findAll();
    args = Array.prototype.slice.call(args);
    args.map(this._schedule, this);
  } catch(err) {
    console.log('Scheduler start failed');
  }
};

Scheduler.prototype.handleMessage = function* (channel, message) {
  let payload = JSON.parse(message)
    , evt = payload.body;

  this._schedule(evt);
};

Scheduler.prototype._schedule = function(evt) {
  let cron = evt.cron ?
    evt.cron :
    new Date(evt.when);

  schedule.scheduleJob(cron, this._onEvent.bind(null, evt));
};

Scheduler.prototype._onEvent = function(evt) {
  co(function* () {
    return yield request(evt.url);
  }).then(function(res) {
    console.log('succesfully sent cron job request', res.statusCode);
  }).catch(function(err) {
    console.log('failed to send cron job request', err);
  });
};

Scheduler.use = function() {
  Scheduler.apply(this, arguments);
};

module.exports = Scheduler;
