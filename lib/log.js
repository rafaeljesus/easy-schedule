'use strict';

var bunyan        = require('bunyan')
  , PrettyStream  = require('bunyan-prettystream')
  , prettyStdout  = new PrettyStream();

prettyStdout.pipe(process.stdout);

module.exports = bunyan.createLogger({
  name: 'easy-schedule',
  streams: [{
    level: 'debug',
    type: 'raw',
    stream: prettyStdout
  }]
});
