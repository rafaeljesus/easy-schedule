'use strict';

var Event = require('./model');

module.exports = {

  index: function(req, res) {
    var key = req.user.name;
    Event
      .find(key)
      .then(function(events) {
        res.status(200).json(events);
      })
      .catch(function(err) {
        res.status(500).json(err);
      });
  },

  show: function(req, res) {
    var key = req.user.name;
    var id = req.params.id;
    Event
      .get(key, id)
      .then(function(event) {
        res.status(200).json(event);
      })
      .catch(function(err) {
        res.status(500).json(err);
      });
  }
};
