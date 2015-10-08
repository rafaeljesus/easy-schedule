import http from 'http'
import cluster form 'cluster'
import os from 'os'

const numCPUs = os.cpus().length

if (cluster.isMaster) {
  for (let i = 0; i < numCPUs; ++i) {
    cluster.fork()
  }
}

if (cluster.isWorker) {
  const app = require('../app')
    , port  = process.env.PORT || 3000

  http.createServer(app.callback())

  if (!module.parent) {
    app.listen(port)
  }
}
