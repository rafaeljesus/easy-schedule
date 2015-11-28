import koa from 'koa'
import serve from 'koa-static'
import koaBody from 'koa-bodyparser'
import logger from 'koa-logger'
import compress from 'koa-compress'
import helmet from 'koa-helmet'
import cors from 'kcors'
import zlib from 'zlib'
import auth from './libs/auth'
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
app.use(koaBody())
app.use(logger())
app.use(helmet())
app.use(cors({
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}))
app.use(auth.initialize())
app.use(APIhome.routes())
app.use(APItoken.routes())
app.use(APIusers.routes())
app.use(APIevents.routes())
app.use(APIhistory.routes())
app.use(serve('public'))

module.exports = app
