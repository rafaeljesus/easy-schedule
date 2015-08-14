'use strict'

const http  = require('http')
  , cluster = require('cluster')
  , os      = require('os')
  , numCPUs = os.cpus().length

if (cluster.isMaster) {

  for (let i = 0; i < numCPUs; ++i) {
    cluster.fork()
  }

} else {

  let app   = require('../app')
    , port  = process.env.PORT || 3000

  http.createServer(app.callback())

  if (!module.parent) {
    app.listen(port)
  }
}

