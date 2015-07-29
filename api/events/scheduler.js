'use strict';

const co        = require('co')
  , request     = require('co-request')
  , schedule    = require('node-schedule');

var Scheduler = function(redis) {
  if(!(this instanceof Scheduler)) return new Scheduler(redis);
  redis.subscribe('schedule:created');
  redis.on('message', this.handleMessage);
};

Scheduler.use = function() {
  Scheduler.apply(this, arguments);
};

var scheduleJob = function(evt) {
  let cron = evt.cron ?
    evt.cron :
    new Date(evt.when);

  return new Promise(function(resolve, reject) {
    schedule.scheduleJob(cron, function() {
      resolve(arguments);
    });
  });
};

Scheduler.prototype.handleMessage = function(channel, message) {
  let evt = JSON.parse(message);
  return co(function* () {
    yield scheduleJob(evt);
    let res = yield request(evt.url);
    console.log('succesfully sent cron job request', res.statusCode);
  }).catch(function(err) {
    console.log('failed to send cron job request', err);
  });
};

module.exports = Scheduler;
