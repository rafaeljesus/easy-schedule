'use strict'

const router    = require('koa-router')()
  , controller  = require('./controller')

router.post('/', controller.create)
router.delete('/', controller.delete)

module.exports = router
