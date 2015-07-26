'use strict';

const server = require('../app')
  , port      = process.env.PORT || 3000;

if (!module.parent) {
  server.listen(port);
  server.on('listening', onListening);
  server.on('error', onError);
}

function onListening() {
  console.log('App is running at: ', port);
}

function onError(err) {
  console.log(err, 'App failed to start');
  throw err;
}
