'use strict'

const supertest = require('supertest')
  , app         = require('../../app')
  , request     = supertest(app.listen())
  , User        = require('../../api/users/model')

describe('HomeControllerSpec', function() {

  let login = 'user-login'
    , password = 'user-password'

  before(function* (done) {
    try {
      yield User.create(login, password)
      done()
    } catch(err) {
      done(err)
    }
  })

  it('should respond 200', function(done) {
    request
      .get('/v1')
      .auth(login, password)
      .expect('Content-Type', /json/)
      .expect(200, done)
  })

})
