'use strict'

const chai      = require('chai')
  , mocha       = require('mocha')
  , expect      = chai.expect
  , redis       = require('../../lib/redis')
  , History     = require('../../api/history/model')

require('co-mocha')(mocha)

describe('HistoryModel', function() {

  let login = 'rafaeljesus'
  let fixture = require('./fixture')()

  afterEach(function* (done) {
    try {
      yield redis.flushdb()
      done()
    } catch(err) {
      done(err)
    }
  })

  describe('.find', function() {

    before(function *(done) {
      try {
        yield [
          History.create(fixture.history1),
          History.create(fixture.history2)
        ]
        done()
      } catch(err) {
        done(err)
      }
    })

    it('should find all history', function* (done) {
      try {
        let res = yield History.find(login)
        expect(res.length).to.be.equal(2)
        done()
      } catch(err) {
        done(err)
      }
    })
  })

  describe('.create', function() {

    it('should create a history event', function* (done) {
      try {
        let res = yield History.create(fixture.history1)
        expect(res).to.be.eql(1)
        done()
      } catch(err) {
        done(err)
      }
    })
  })

})
