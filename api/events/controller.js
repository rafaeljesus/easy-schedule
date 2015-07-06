'use strict';

var Event = require('./model');

module.exports = {

  index: function(req, res) {
    Event
      .find(req.username)
      .then(function(events) {
        console.log('controller ', events);
        res.json(200, events);
      })
      .catch(function(err) {
        res.json(500, err);
      });
  }
};
