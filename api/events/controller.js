'use strict';

const Event = require('./model');

exports.index = function *(next) {
  let key = this.user.name;
  this.body = yield Event.find(key);
};

exports.show = function *(next) {
  let key = this.user.name
    , id = this.params.id;
  this.body = yield Event.get(key, id);
};
