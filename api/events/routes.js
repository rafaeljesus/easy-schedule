'use strict'

const router    = require('koa-router')()
  , controller  = require('./controller')

router.get('/', controller.index)
router.post('/', controller.create)
router.put('/:id', controller.update)
router.get('/:id', controller.show)
router.delete('/:id', controller.delete)

module.exports = router
