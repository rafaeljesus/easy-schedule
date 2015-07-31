'use strict';

const cluster   = require('cluster')
  , numCPUs     = require('os').cpus().length
  , server      = require('../app')
  , port        = process.env.PORT || 3000;

if (cluster.isMaster) {

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('listening', function(worker) {
    console.log('Worker started %s', worker.process.pid);
  });

  cluster.on('disconnect', function(worker) {
    console.log('Worker disconnected %s', worker.process.pid);
  });

  cluster.on('exit', function(worker, code, signal) {
    console.log('Worker %s died!', worker.process.pid);
  });

} else {

  if (!module.parent) {
    server.listen(port);
    console.log('App is running at: ', port);
  }
}
