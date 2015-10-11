import scheduler from 'node-schedule'
import Scheduler from '../../api/events/scheduler'
import Event from '../../api/events/collection'

describe('Events:SchedulerSpec', () => {

  describe('.start', () => {

    let findAllStub
      , scheduleJobSpy

    beforeEach(() => {
      findAllStub = sinon.stub(Event, 'findAll', () => [{_id: 'foo'}, {_id: 'bar'}])
      scheduleJobSpy = sinon.spy(scheduler, 'scheduleJob')
    })

    afterEach(() => {
      findAllStub.restore()
      scheduleJobSpy.restore()
    })

    it('should schedule all events stored on db', function* () {
      yield Scheduler.start()
      expect(findAllStub).to.have.been.called
      expect(scheduleJobSpy).to.have.been.calledTwice
    })
  })

  describe.skip('.handleMessage', () => {

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

  describe.skip('._schedule', () => {

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

  describe.skip('._onEvent', () => {

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
