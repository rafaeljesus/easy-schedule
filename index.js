import koa from 'koa'
import mount from 'koa-mount'
import serve from 'koa-static'
import koaBody from 'koa-bodyparser'
import logger from 'koa-logger'
import compress from 'koa-compress'
import limit from 'koa-better-ratelimit'
import helmet from 'koa-helmet'
import cors from 'kcors'
import zlib from 'zlib'
// import auth from './libs/auth'
import APIhome from './api/home/routes'
import APItoken from './api/token/routes'
import APIusers from './api/users/routes'
import APIevents from './api/events/routes'
import APIhistory from './api/history/routes'

const app = koa()

app.use(compress({
  filter: contentType => /text/i.test(contentType)
  , threshold: 2048
  , flush: zlib.Z_SYNC_FLUSH
}))
app.use(limit({
  duration: 1000 * 60 * 3
  , max: 10
  , blacklist: []
}))
app.use(koaBody())
app.use(logger())
app.use(helmet())
app.use(cors({
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
// app.use(auth.initialize())
app.use(mount('/v1', APIhome.middleware()))
app.use(mount('/v1/token', APItoken.middleware()))
app.use(mount('/v1/users', APIusers.middleware()))
app.use(mount('/v1/events', APIevents.middleware()))
app.use(mount('/v1/history', APIhistory.middleware()))
app.use(serve('public'))

module.exports = app
