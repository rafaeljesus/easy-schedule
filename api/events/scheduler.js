'use strict';

const co        = require('co')
  , request     = require('co-request')
  , schedule    = require('node-schedule');

let Scheduler = function(redis) {
  if (!(this instanceof Scheduler)) return new Scheduler(redis);
  redis.subscribe('schedule:created');
  redis.on('message', this.handleMessage.bind(this));
};

Scheduler.prototype.handleMessage = function(channel, message) {
  let evt = JSON.parse(message);
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
