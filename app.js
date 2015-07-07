'use strict';

var express       = require('express')
  , logger        = require('morgan')
  , bodyParser    = require('body-parser')
  , cors          = require('cors')
  , auth          = require('./middlewares/basic-auth')
  , app           = express();

app.use(logger('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('*', cors());

app.use('/', require('./api/home/routes'));
app.use('/events', auth, require('./api/events/routes'));

app.disable('x-powered-by');

module.exports = app;
