'use strict';

const koa       = require('koa')
  , mount       = require('koa-mount')
  , auth        = require('./middlewares/auth')
  , app         = koa()
  , APIhome     = require('./api/home/routes')
  , APIevents   = require('./api/events/routes');

app.use(auth());
app.use(mount('/v1', APIhome.middleware()));
app.use(mount('/v1/events', APIevents.middleware()));

module.exports = app;
