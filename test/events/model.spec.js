'use strict'

const chai      = require('chai')
  , mocha       = require('mocha')
  , sinon       = require('sinon')
  , sinonChai   = require('sinon-chai')
  , expect      = chai.expect
  , redis       = require('../../lib/redis')
  , Event       = require('../../api/events/model')

chai.use(sinonChai)
require('co-mocha')(mocha)

describe('EventModel', () => {

  let acckey = 'user-hash'

  afterEach(function* () {
    try {
      yield redis.flushdb()
    } catch(err) {
      expect(err).to.not.be.ok
    }
  })

  describe('.findAll', () => {

    let fixture = require('./fixture')()
      , evt1 = fixture.event1

    beforeEach(function* () {
      try {
        yield Event.create(acckey, evt1)
      } catch(err) {
        expect(err).to.not.be.ok
      }
    })

    it('should find all events', function* () {
      try {
        let evts = yield Event.findAll()
        expect(evts.id).to.not.be.empty
      } catch(err) {
        expect(err).to.not.be.ok
      }
    })
  })

  describe('.find', () => {

    let fixture = require('./fixture')()
      , evt1 = fixture.event1
      , evt2 = fixture.event2

    beforeEach(function* () {
      try {
        yield [
          Event.create(acckey, evt1),
          Event.create(acckey, evt2)
        ]
      } catch(err) {
        expect(err).to.not.be.ok
      }
    })

    it('should find events', function* () {
      try {
        let evts = yield Event.find(acckey)
        expect(evts.length).to.be.equal(2)
        expect(evts[0].id).to.not.be.empty
        expect(evts[1].id).to.not.be.empty
      } catch(err) {
        expect(err).to.not.be.ok
      }
    })
  })

  describe('.get', () => {

    let fixture = require('./fixture')()
      , evt1 = fixture.event1

    beforeEach(function* () {
      try {
        evt1 = yield Event.create(acckey, evt1)
      } catch(err) {
        expect(err).to.not.be.ok
      }
    })

    it('should get a event by id', function* () {
      try {
        let evt = yield Event.get(acckey, evt1.id)
        expect(evt.url).to.be.equal(evt1.url)
      } catch(err) {
        expect(err).to.not.be.ok
      }
    })
  })

  describe('.create', () => {

    let spy
      , fixture = require('./fixture')()
      , evt1 = fixture.event1

    beforeEach(() => {
      spy = sinon.spy(redis, 'publish')
    })

    after(() => {
      spy.restore()
    })

    it('should create a event and publish schedule:created', function* () {
      try {
        evt1 = yield Event.create(acckey, evt1)
        expect(evt1.id).to.not.be.empty
        expect(spy).to.have.been.calledWith('schedule:created')
      } catch(err) {
        expect(err).to.not.be.ok
      }
    })
  })

  describe('.update', function() {

    let spy
      , fixture = require('./fixture')()
      , evt1 = fixture.event1

    beforeEach(function* () {
      spy = sinon.spy(redis, 'publish')
      evt1 = yield Event.create(acckey, evt1)
    })

    after(() => {
      spy.restore()
    })

    it('should update a event and publish schedule:updated', function* () {
      evt1.url = 'https://example2.com'
      try {
        let evt = yield Event.update(acckey, evt1)
        expect(evt.url).to.be.equal(evt1.url)
        expect(spy).to.have.been.calledWith('schedule:updated')
      } catch(err) {
        expect(err).to.not.be.ok
      }
    })
  })

  describe('.delete', () => {

    let spy
      , fixture = require('./fixture')()
      , evt1 = fixture.event1

    beforeEach(function* () {
      spy = sinon.spy(redis, 'publish')
      try {
        evt1 = yield Event.create(acckey, evt1)
      } catch(err) {
        expect(err).to.not.be.ok
      }
    })

    it('should delete a event and publish schedule:deleted', function* () {
      try {
        let res = yield Event.delete(acckey, evt1.id)
        expect(res).to.have.length(4)
        expect(spy).to.have.been.calledWith('schedule:deleted')
      } catch(err) {
        expect(err).to.not.be.ok
      }
    })
  })

})
