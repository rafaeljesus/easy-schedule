'use strict';

const debug = require('debug')('async-coders.io:middlewares:auth');

var unauthorized = function* (next) {
  if (this.method !== 'GET') {
    return yield* next;
  }
  this.status = 401;
  this.set('WWW-Authenticate', 'Basic realm="sample"');
  if (this.accepts(['html', 'json']) === 'json') {
    this.body = {
      error: 'unauthorized',
      reason: 'login first'
    };
  } else {
    this.body = 'login first';
  }
};

var Auth = function() {
  return function* (next) {
    var authorization = ((this.get('authorization') || '').split(' ')[1] || '').trim();
    if (!authorization) {
      return yield* unauthorized.call(this, next);
    }
    authorization = new Buffer(authorization, 'base64').toString().split(':');
    if (authorization.length !== 2) {
      return yield* unauthorized.call(this, next);
    }

    this.user = {name: authorization[0]};
    debug('auth pass user: %j, headers: %j', this.user, this.header);
    yield* next;
  };
};

module.exports = Auth;
