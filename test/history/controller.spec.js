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

describe('HistoryControllerSpec', () => {

  let login = 'rafaeljesus'
    , password = 'user-password-hash'
    , fixture = require('./fixture')()

  beforeEach(function* () {
    try {
      yield [
        History.create(fixture.history1),
        History.create(fixture.history2),
        User.create(login, password)
      ]
    } catch(err) {
      expect(err).to.not.be.ok
    }
  })

  afterEach(function* () {
    try {
      yield redis.flushdb()
    } catch(err) {
      expect(err).to.not.be.ok
    }
  })

  describe('GET /v1/history', () => {
    it('should find event history', done => {
      request
        .get('/v1/history')
        .auth(login, password)
        .set('Accept', 'application/json')
        .set('Accept-Encoding', 'gzip')
        .expect('Content-Type', /json/)
        .expect(200, (err, res) => {
          if (err) return done(err)
          expect(res.body).to.have.length(2)
          done()
        })
    })
  })
})
