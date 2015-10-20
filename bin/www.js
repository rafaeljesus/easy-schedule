import http from 'http'

const app = require('../app')
  , port  = process.env.PORT || 3000

http.createServer(app.callback())

if (!module.parent) {
  app.listen(port)
}
