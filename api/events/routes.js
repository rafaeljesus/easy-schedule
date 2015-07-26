'use strict';

const router    = require('koa-router')()
  , controller  = require('./controller');

router.get('/', controller.index);
router.get('/:id', controller.show);

module.exports = router;
