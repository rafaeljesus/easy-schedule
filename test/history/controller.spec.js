'use strict'

const supertest = require('supertest')
  , mocha       = require('mocha')
  , expect      = require('chai').expect
  , redis       = require('../../lib/redis')
  , app         = require('../../app')
  , request     = supertest(app.listen())
  , User        = require('../../api/users/model')
  , History     = require('../../api/history/model')

require('co-mocha')(mocha)

describe('HistoryControllerSpec', function() {

  let login = 'rafaeljesus'
    , password = 'user-password-hash'
    , fixture = require('./fixture')()

  beforeEach(function* (done) {
    try {
      yield [
        History.create(login, fixture.history1),
        History.create(login, fixture.history2),
        User.create(login, password)
      ]
      done()
    } catch(err) {
      done(err)
    }
  })

  afterEach(function* (done) {
    try {
      yield redis.flushdb()
      done()
    } catch(err) {
      done(err)
    }
  })

  describe('GET /v1/history', function() {
    it('should find event history', function(done) {
      request
        .get('/v1/history')
        .auth(login, password)
        .set('Accept', 'application/json')
        .set('Accept-Encoding', 'gzip')
        .expect('Content-Type', /json/)
        .expect(200, function(err, res) {
          if (err) return done(err)
          expect(res.body).to.have.length(3)
          done()
        })
    })
  })
})
