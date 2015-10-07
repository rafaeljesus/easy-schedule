import koa from 'koa'
import mount from 'koa-mount'
import koaBody from 'koa-body'
import logger from 'koa-logger'
import compress from 'koa-compress'
import limit from 'koa-better-ratelimit'
import cors from 'kcors'
import zlib from 'zlib'
import auth from './middlewares/auth'
import APIhome from './api/home/routes'
import APIusers from './api/users/routes'
import APIevents from './api/events/routes'

const app = koa()

const compressOpts = {
  filter: contentType => /text/i.test(contentType)
  , threshold: 2048
  , flush: zlib.Z_SYNC_FLUSH
}

const limitOpts = {
  duration: 1000 * 60 * 3
  , max: 10
  , blacklist: []
}

const handleErr = function* (next) {
  try {
    yield next
  } catch(err) {
    this.type = 'json'
    this.status = err.status || 500
    this.body = {error: 'A unexpected error ocurred'}
    this.app.emit('error', err, this)
  }
}

app.use(compress(compressOpts))
app.use(limit(limitOpts))
app.use(koaBody())
app.use(logger())
app.use(cors())
app.use(auth())
app.use(mount('/v1', APIhome.middleware()))
app.use(mount('/v1/users', APIusers.middleware()))
app.use(mount('/v1/events', APIevents.middleware()))
// app.use(mount('/v1/history', APIhistory.middleware()))
app.use(handleErr)

module.exports = app
