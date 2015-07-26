'use strict';

const redis     = require('promise-redis')(promiseFactory)
  , config      = require('../config/redis')[process.env.NODE_ENV]
  , client      = redis.createClient(config.port, config.host);

function promiseFactory(resolver) {
  return new Promise(resolver);
}

module.exports = client;
