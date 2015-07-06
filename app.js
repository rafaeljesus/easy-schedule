'use strict';

var restify     = require('restify')
  , app         = restify.createServer();

app.use(restify.bodyParser());
app.use(restify.queryParser());
app.use(restify.authorizationParser());
app.use(restify.CORS());

require('./api/home/routes')(app);
require('./api/events/routes')(app);

module.exports = app;
