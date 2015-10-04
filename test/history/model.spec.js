'use strict'

const chai      = require('chai')
  , mocha       = require('mocha')
  , expect      = chai.expect
  , redis       = require('../../lib/redis')
  , History     = require('../../api/history/model')

require('co-mocha')(mocha)

describe('HistoryModel', () => {

  let login = 'rafaeljesus'
  let fixture = require('./fixture')()

  afterEach(function* () {
    try {
      yield redis.flushdb()
    } catch(err) {
      expect(err).to.not.be.ok
    }
  })

  describe('.find', () => {

    before(function* () {
      try {
        yield [
          History.create(fixture.history1),
          History.create(fixture.history2)
        ]
      } catch(err) {
        expect(err).to.not.be.ok
      }
    })

    it('should find all history', function* () {
      try {
        let res = yield History.find(login)
        expect(res.length).to.be.equal(2)
      } catch(err) {
        expect(err).to.not.be.ok
      }
    })
  })

  describe('.create', () => {

    it('should create a history event', function* () {
      try {
        let res = yield History.create(fixture.history1)
        expect(res).to.be.eql(1)
      } catch(err) {
        expect(err).to.not.be.ok
      }
    })
  })

})
