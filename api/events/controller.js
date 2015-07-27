'use strict';

const Event = require('./model');

exports.index = function *(next) {
  let key = this.user.name;
  this.body = yield Event.find(key);
};

exports.create = function *(next) {
  let key = this.user.name
    , event = this.body;
  this.body = yield Event.schedule(key, event);
};

exports.show = function *(next) {
  let key = this.user.name
    , id = this.params.id;
  this.body = yield Event.get(key, id);
};
