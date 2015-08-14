'use strict';

const router    = require('koa-router')()
  , controller  = require('./controller')

router.get('/', controller.index)

module.exports = router
