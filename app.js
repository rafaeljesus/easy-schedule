'use strict';

const koa       = require('koa')
  , mount       = require('koa-mount')
  , koaBody     = require('koa-body')
  , logger      = require('koa-logger')
  , cors        = require('kcors')
  , auth        = require('./middlewares/auth')
  , app         = koa()
  , APIhome     = require('./api/home/routes')
  , APIevents   = require('./api/events/routes')
  , redisSub    = require('./lib/redis-sub')
  , scheduler   = require('./api/events/scheduler');

scheduler.use(redisSub);

app.use(logger());
app.use(koaBody());
app.use(cors());
app.use(auth());
app.use(mount('/v1', APIhome.middleware()));
app.use(mount('/v1/events', APIevents.middleware()));

module.exports = app;
