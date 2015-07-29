'use strict';

const co        = require('co')
  , wrapper     = require('co-redis')
  , redis       = require('redis')
  , config      = require('../config/redis')[process.env.NODE_ENV]
  , client      = wrapper(redis.createClient(config.port, config.host));

module.exports = client;
