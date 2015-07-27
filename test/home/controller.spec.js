'use strict';

const supertest = require('supertest')
  , app         = require('../../app')
  , request     = supertest(app.listen());

describe('HomeControllerSpec', function() {

  it('should respond 200', function(done) {
    request
      .get('/v1')
      .auth('user-hash', 'user-pass')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });

});
