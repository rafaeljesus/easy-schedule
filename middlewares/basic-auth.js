'use strict';

var basicAuth = require('basic-auth');

var unauthorized = function(res) {
  res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
  return res.status(401).json({message: 'Unauthorized'});
};

var auth = function(req, res, next) {
  var user  = basicAuth(req);
  if (!user || !user.name || !user.pass) {
    return unauthorized.apply(null, [res]);
  }
  if (user.name && user.pass) {
    req.user = user;
    return next();
  }
  return unauthorized.apply(null, [res]);
};

module.exports = auth;
