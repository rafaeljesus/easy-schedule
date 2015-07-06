'use strict';

var controller = require('./controller');

module.exports = function(app) {
  app.get('/events', controller.index);
};
