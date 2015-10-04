'use strict'

const supertest = require('supertest')
  , expect      = require('chai').expect
  , app         = require('../../app')
  , request     = supertest(app.listen())
  , User        = require('../../api/users/model')

describe('HomeControllerSpec', () => {

  let login = 'user-login'
    , password = 'user-password'

  before(function* () {
    try {
      yield User.create(login, password)
    } catch(err) {
      expect(err).to.not.be.ok
    }
  })

  it('should respond 200', done => {
    request
      .get('/v1')
      .auth(login, password)
      .expect('Content-Type', /json/)
      .expect(200, done)
  })

})
