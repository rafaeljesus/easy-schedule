'use strict';

const server    = require('../app')
  , port        = process.env.PORT || 3000;

if (!module.parent) {
  server.listen(port);
  console.log('App is running at: ', port);
}
