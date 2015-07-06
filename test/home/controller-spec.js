'use strict';

var app       = require('../../app')
  , request   = require('supertest')(app);

describe('HomeControllerSpec', function() {

  it('should respond 200', function(done) {
    request
      .get('/')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });

});
