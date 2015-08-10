'use strict';

const router    = require('koa-router')()
  , controller  = require('./controller');

router.post('/', controller.create);

module.exports = router;
