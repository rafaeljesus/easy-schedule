'use strict';

const _   = require('lodash')
  , Event = require('./model');

exports.index = function* (next) {
  let login = this.user.login;
  this.body = yield Event.find(login);
};

exports.create = function* (next) {
  let login = this.user.login
    , event = this.request.body;

  try {
    this.body = yield Event.create(login, event);
  } catch(err) {
    this.throw(500, err);
  }
};

exports.update = function* (next) {
  let login = this.user.login;

  let event = _.assign(this.request.body, {
    id: this.params.id
  });

  try {
    this.body = yield Event.update(login, event);
  } catch(err) {
    this.throw(500, err);
  }
};

exports.show = function* (next) {
  let login = this.user.login
    , id = this.params.id;

  try {
    this.body = yield Event.get(login, id);
  } catch(err) {
    this.throw(500, err);
  }
};

exports.delete = function* (next) {
  let login = this.user.login
    , id = this.params.id;

  try {
    this.body = yield Event.delete(login, id);
  } catch(err) {
    this.throw(500, err);
  }
};
