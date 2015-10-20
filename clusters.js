import cluster from 'cluster'
import os from 'os'
import co from 'co'
import Scheduler from './api/events/scheduler'
import log from './lib/log'

const CPUS = os.cpus()

if (cluster.isMaster) {
  co(function* () {
    yield Scheduler.start()
  })

  CPUS.map(() => cluster.fork())

  cluster.on('listening', worker => {
    log.info('Cluster %d conected', worker.process.pid)
  })

  cluster.on('disconnect', worker => {
    log.info('Cluster %d disconected', worker.process.pid)
  })

  cluster.on('exit', worker => {
    log.info('Cluster %d exited', worker.process.pid)
    cluster.fork()
  })
}

if (cluster.isWorker) {
  require('./bin/www')
}
