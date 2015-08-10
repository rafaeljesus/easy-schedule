'use strict';

const http  = require('http')
  , app     = require('../app')
  , port    = process.env.PORT || 3000;

http.createServer(app.callback());

if (!module.parent) {
  app.listen(port);
}

