'use strict';

var express     = require('express')
  , router      = express.Router()
  , controller  = require('./controller');

router.get('/', controller.index);
router.get('/:id', controller.show);

module.exports = router;
