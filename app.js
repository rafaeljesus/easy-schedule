'use strict'

const koa       = require('koa')
  , mount       = require('koa-mount')
  , koaBody     = require('koa-body')
  , logger      = require('koa-logger')
  , compress    = require('koa-compress')
  , limit       = require('koa-better-ratelimit')
  , cors        = require('kcors')
  , zlib        = require('zlib')
  , auth        = require('./middlewares/auth')
  , redisSub    = require('./lib/redis-sub')
  , scheduler   = require('./api/events/scheduler')
  , APIhome     = require('./api/home/routes')
  , APIusers    = require('./api/users/routes')
  , APIevents   = require('./api/events/routes')
  , APIhistory  = require('./api/history/routes')
  , app         = koa()

let compressOpts = {
  filter: function(contentType) {
    return /text/i.test(contentType)
  },
  threshold: 2048,
  flush: zlib.Z_SYNC_FLUSH
}

let limitOpts = {
  duration: 1000 * 60 * 3,
  max: 10,
  blacklist: []
}

let handleErr = function* (next) {
  try {
    yield next
  } catch(err) {
    this.type = 'json'
    this.status = err.status || 500
    this.body = {error: 'A unexpected error ocurred'}
    this.app.emit('error', err, this)
  }
}

scheduler.use(redisSub)

app.use(compress(compressOpts))
app.use(limit(limitOpts))
app.use(koaBody())
app.use(logger())
app.use(cors())
app.use(auth())
app.use(mount('/v1', APIhome.middleware()))
app.use(mount('/v1/users', APIusers.middleware()))
app.use(mount('/v1/events', APIevents.middleware()))
app.use(mount('/v1/history', APIhistory.middleware()))
app.use(handleErr)

module.exports = app
