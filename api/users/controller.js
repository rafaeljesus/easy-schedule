'use strict';

const User  = require('./model');

exports.create = function* (next) {
  let login = this.request.body.login
    , password = this.request.body.password;

  try {
    yield User.create(login, password);
    this.status = 201;
    this.type = 'json';
    this.body = {};
  } catch(err) {
    this.throw(500, err);
  }
};
