'use strict'

const chai      = require('chai')
  , mocha       = require('mocha')
  , sinon       = require('sinon')
  , sinonChai   = require('sinon-chai')
  , schedule    = require('node-schedule')
  , expect      = chai.expect
  , redis       = require('../../lib/redis-sub')
  , Event       = require('../../api/events/model')
  , scheduler   = require('../../api/events/scheduler')

chai.use(sinonChai)
require('co-mocha')(mocha)

describe('SchedulerSpec', function() {

  let fixture = require('./fixture')().event1
  fixture.id = 1
  let message = {
    action: 'created',
    body: fixture
  }

  describe('#use', function() {

    let spy

    afterEach(function() {
      spy.restore()
    })

    it('should subscribe to schedule:created|updated|deleted', function() {
      spy = sinon.spy(redis, 'subscribe')
      scheduler.use(redis)
      expect(spy).to.have.been.calledWith('schedule:created')
      expect(spy).to.have.been.calledWith('schedule:updated')
      expect(spy).to.have.been.calledWith('schedule:deleted')
    })

    it('should listen to redis message', function() {
      spy = sinon.spy(redis, 'on')
      scheduler.use(redis)
      expect(spy).to.have.been.calledWith('message')
    })
  })

  describe('#start', function() {

    let sch
      , findAllStub
      , _scheduleStub
      , fixture = require('./fixture')()
      , evt1 = fixture.event1
      , evt2 = fixture.event2

    before(function() {
      sch = scheduler(redis)
    })

    after(function() {
      findAllStub.restore()
      _scheduleStub.restore()
    })

    it('should return all events', function* () {
      _scheduleStub = sinon.stub(sch, '_schedule')
      findAllStub = sinon.stub(Event, 'findAll', function() {
        return [evt1, evt2]
      })
      yield sch.start()
      expect(findAllStub).to.have.been.called
      expect(_scheduleStub).to.have.been.calledTwice
    })
  })

  describe('#handleMessage', function() {

    let channel = {}
      , spy

    afterEach(function() {
      spy.restore()
    })

    context('when action is created', function() {

      before(function() {
        spy = sinon.spy(schedule, 'scheduleJob')
      })

      it('should schedule a job event', function() {
        let sch = scheduler(redis)
        sch.handleMessage(channel, JSON.stringify(message))
        expect(spy).to.have.been.calledWith(fixture.cron)
        expect(sch.jobs).to.not.be.empty
      })
    })

    context('when action is updated', function() {

      let sch
        , cancelSpy
        , _scheduleSpy

      before(function() {
        sch = scheduler(redis)
        message.action = 'updated'
        sch._schedule(message.body)
        cancelSpy = sinon.spy(sch.jobs[message.body.id], 'cancel')
        _scheduleSpy = sinon.spy(sch, '_schedule')
      })

      after(function() {
        cancelSpy.restore()
        _scheduleSpy.restore()
      })

      it('should update a job event', function() {
        sch.handleMessage(channel, JSON.stringify(message))
        expect(cancelSpy).to.have.been.called
        expect(_scheduleSpy).to.have.been.called
        expect(sch.jobs).to.not.be.empty
      })
    })

    context('when action is deleted', function() {

      let sch
        , cancelSpy

      before(function() {
        sch = scheduler(redis)
        message.action = 'deleted'
        sch._schedule(message.body)
        cancelSpy = sinon.spy(sch.jobs[message.body.id], 'cancel')
      })

      after(function() {
        cancelSpy.restore()
      })

      it('should delete a job event', function() {
        sch.handleMessage(channel, JSON.stringify(message))
        expect(sch.jobs).to.be.empty
      })
    })
  })

  describe('#_schedule', function() {

    let sch, spy

    before(function() {
      sch = scheduler(redis)
    })

    after(function() {
      spy.restore()
    })

    it('should schedule a job', function() {
      spy = sinon.spy(schedule, 'scheduleJob')
      sch._schedule(message.body)
      expect(spy).to.have.been.calledWith(message.body.cron)
      expect(sch.jobs).to.not.be.empty
    })
  })

  describe('#_onEvent', function() {

    let httpMock
      , nock = require('nock')

    before(function() {
      httpMock = nock(message.body.url)
        .get('/')
        .reply(200)
    })

    after(nock.cleanAll)

    afterEach(function() {
      httpMock.done()
    })

    it('should send http request', function(done) {
      let sch = scheduler(redis)
      sch._onEvent(message.body)
      setTimeout(done, 100)
    })
  })

})
