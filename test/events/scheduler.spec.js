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

describe('SchedulerSpec', () => {

  let fixture = require('./fixture')().event1
  fixture.id = 1
  let message = {
    action: 'created',
    body: fixture
  }

  describe('.use', () => {

    let spy

    afterEach(() => {
      spy.restore()
    })

    it('should subscribe to schedule:created|updated|deleted', () => {
      spy = sinon.spy(redis, 'subscribe')
      scheduler.use(redis)
      expect(spy).to.have.been.calledWith('schedule:created')
      expect(spy).to.have.been.calledWith('schedule:updated')
      expect(spy).to.have.been.calledWith('schedule:deleted')
    })

    it('should listen to redis message', () => {
      spy = sinon.spy(redis, 'on')
      scheduler.use(redis)
      expect(spy).to.have.been.calledWith('message')
    })
  })

  describe('.start', () => {

    let sch
      , findAllStub
      , _scheduleStub
      , fixture = require('./fixture')()
      , evt1 = fixture.event1
      , evt2 = fixture.event2

    before(() => {
      sch = scheduler(redis)
    })

    after(() => {
      findAllStub.restore()
      _scheduleStub.restore()
    })

    it('should return all events', function* () {
      _scheduleStub = sinon.stub(sch, '_schedule')
      findAllStub = sinon.stub(Event, 'findAll', () => [evt1, evt2])
      yield sch.start()
      expect(findAllStub).to.have.been.called
      expect(_scheduleStub).to.have.been.calledTwice
    })
  })

  describe('.handleMessage', () => {

    let channel = {}
      , spy

    afterEach(() => {
      spy.restore()
    })

    context('when action is created', () => {

      before(() => {
        spy = sinon.spy(schedule, 'scheduleJob')
      })

      it('should schedule a job event', () => {
        let sch = scheduler(redis)
        sch.handleMessage(channel, JSON.stringify(message))
        expect(spy).to.have.been.calledWith(fixture.cron)
        expect(sch.runningJobs).to.not.be.empty
      })
    })

    context('when action is updated', () => {

      let sch
        , cancelSpy
        , _scheduleSpy

      before(() => {
        sch = scheduler(redis)
        message.action = 'updated'
        sch._schedule(message.body)
        cancelSpy = sinon.spy(sch.runningJobs[message.body.id], 'cancel')
        _scheduleSpy = sinon.spy(sch, '_schedule')
      })

      after(() => {
        cancelSpy.restore()
        _scheduleSpy.restore()
      })

      it('should update a job event', () => {
        sch.handleMessage(channel, JSON.stringify(message))
        expect(cancelSpy).to.have.been.called
        expect(_scheduleSpy).to.have.been.called
        expect(sch.runningJobs).to.not.be.empty
      })
    })

    context('when action is deleted', () => {

      let sch
        , cancelSpy

      before(() => {
        sch = scheduler(redis)
        message.action = 'deleted'
        sch._schedule(message.body)
        cancelSpy = sinon.spy(sch.runningJobs[message.body.id], 'cancel')
      })

      after(() => {
        cancelSpy.restore()
      })

      it('should delete a job event', () => {
        sch.handleMessage(channel, JSON.stringify(message))
        expect(sch.jobs).to.be.empty
      })
    })
  })

  describe('._schedule', () => {

    let sch, spy

    before(() => {
      sch = scheduler(redis)
    })

    after(() => {
      spy.restore()
    })

    it('should schedule a job', () => {
      spy = sinon.spy(schedule, 'scheduleJob')
      sch._schedule(message.body)
      expect(spy).to.have.been.calledWith(message.body.cron)
      expect(sch.runningJobs).to.not.be.empty
    })
  })

  describe('._onEvent', () => {

    let httpMock
      , nock = require('nock')

    before(() => {
      httpMock = nock(message.body.url)
        .get('/')
        .reply(200)
    })

    after(nock.cleanAll)

    afterEach(() => {
      httpMock.done()
    })

    it('should send http request', done => {
      let sch = scheduler(redis)
      sch._onEvent(message.body)
      setTimeout(done, 100)
    })
  })

})
