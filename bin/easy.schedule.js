import http from 'http'
import cluster from 'cluster'
import os from 'os'
import co from 'co'
import Scheduler from '../api/events/scheduler'

const numCPUs = os.cpus().length

if (cluster.isMaster) {

  Scheduler.start()

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
