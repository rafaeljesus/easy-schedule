'use strict';

var express     = require('express')
  , router      = express.Router()
  , controller  = require('./controller');

router.get('/', controller.index);

module.exports = router;
