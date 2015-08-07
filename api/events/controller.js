'use strict';

const _   = require('lodash')
  , Event = require('./model');

exports.index = function *(next) {
  let key = this.user.name;
  this.body = yield Event.find(key);
};

exports.create = function *(next) {
  let acckey = this.user.name
    , event = this.request.body;
  try {
    this.body = yield Event.create(acckey, event);
  } catch(err) {
    this.throw(500, err);
  }
};

exports.update = function *(next) {
  let acckey = this.user.name;
  let event = _.assign(this.request.body, {
    id: this.params.id
  });
  try {
    this.body = yield Event.update(acckey, event);
  } catch(err) {
    this.throw(500, err);
  }
};

exports.show = function *(next) {
  let acckey = this.user.name
    , id = this.params.id;
  this.body = yield Event.get(acckey, id);
};

exports.delete = function *(next) {
  let acckey = this.user.name
    , id = this.params.id;
  try {
    this.body = yield Event.delete(acckey, id);
  } catch(err) {
    this.throw(500, err);
  }
};
