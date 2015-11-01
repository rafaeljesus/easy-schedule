import http from 'http'
import app from '../index'
import log from '../libs/log'

const port  = process.env.PORT || 3000

http.createServer(app.callback())
app.listen(port)
log.info(`Easy Schedule API - port ${port}`)
