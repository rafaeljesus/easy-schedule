'use strict';

module.exports = {

  index: function(req, res) {
    res.status(200).json({
      message:'Easy Schedule rest api working'
    });
  }

};
