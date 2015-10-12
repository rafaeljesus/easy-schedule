import scheduler from 'node-schedule'
import Scheduler from '../../api/events/scheduler'
import Event from '../../api/events/collection'

describe('Events:SchedulerSpec', () => {

  describe('.start', () => {

    let findAllStub
      , scheduleJobSpy

    beforeEach(function* () {
      findAllStub = sinon.stub(Event, 'findAll', () => [{_id: 'foo'}, {_id: 'bar'}])
      scheduleJobSpy = sinon.spy(scheduler, 'scheduleJob')
      yield Scheduler.start()
    })

    afterEach(() => {
      findAllStub.restore()
      scheduleJobSpy.restore()
    })

    it('should find all events stored on db', () => {
      expect(findAllStub).to.have.been.called
    })

    it('should schedule events', () => {
      expect(scheduleJobSpy).to.have.been.calledTwice
    })

    it('should have scheduled two running jobs', () => {
      expect(Scheduler.runningJobs).to.contain.any.keys('foo', 'bar')
    })
  })

  describe('.create', () => {

    let scheduleJobSpy
      , event = {_id: 'foo', cron: '* * * * *'}

    beforeEach(function* () {
      scheduleJobSpy = sinon.spy(scheduler, 'scheduleJob')
      yield Scheduler.create(event)
    })

    afterEach(() => {
      scheduleJobSpy.restore()
    })

    it('should have scheduled two running jobs', () => {
      expect(Scheduler.runningJobs).to.contain.any.keys('foo')
    })

    it('should schedule new event', () => {
      expect(scheduleJobSpy).to.have.been.calledWith(event.cron)
    })
  })

  // describe.skip('.handleMessage', () => {
  //
  //   let channel = {}
  //     , spy
  //
  //   afterEach(() => {
  //     spy.restore()
  //   })
  //
  //   context('when action is created', () => {
  //
  //     before(() => {
  //       spy = sinon.spy(schedule, 'scheduleJob')
  //     })
  //
  //     it('should schedule a job event', () => {
  //       let sch = scheduler(redis)
  //       sch.handleMessage(channel, JSON.stringify(message))
  //       expect(spy).to.have.been.calledWith(fixture.cron)
  //       expect(sch.runningJobs).to.not.be.empty
  //     })
  //   })
  //
  //   context('when action is updated', () => {
  //
  //     let sch
  //       , cancelSpy
  //       , _scheduleSpy
  //
  //     before(() => {
  //       sch = scheduler(redis)
  //       message.action = 'updated'
  //       sch._schedule(message.body)
  //       cancelSpy = sinon.spy(sch.runningJobs[message.body.id], 'cancel')
  //       _scheduleSpy = sinon.spy(sch, '_schedule')
  //     })
  //
  //     after(() => {
  //       cancelSpy.restore()
  //       _scheduleSpy.restore()
  //     })
  //
  //     it('should update a job event', () => {
  //       sch.handleMessage(channel, JSON.stringify(message))
  //       expect(cancelSpy).to.have.been.called
  //       expect(_scheduleSpy).to.have.been.called
  //       expect(sch.runningJobs).to.not.be.empty
  //     })
  //   })
  //
  //   context('when action is deleted', () => {
  //
  //     let sch
  //       , cancelSpy
  //
  //     before(() => {
  //       sch = scheduler(redis)
  //       message.action = 'deleted'
  //       sch._schedule(message.body)
  //       cancelSpy = sinon.spy(sch.runningJobs[message.body.id], 'cancel')
  //     })
  //
  //     after(() => {
  //       cancelSpy.restore()
  //     })
  //
  //     it('should delete a job event', () => {
  //       sch.handleMessage(channel, JSON.stringify(message))
  //       expect(sch.jobs).to.be.empty
  //     })
  //   })
  // })
  //
  // describe.skip('._schedule', () => {
  //
  //   let sch, spy
  //
  //   before(() => {
  //     sch = scheduler(redis)
  //   })
  //
  //   after(() => {
  //     spy.restore()
  //   })
  //
  //   it('should schedule a job', () => {
  //     spy = sinon.spy(schedule, 'scheduleJob')
  //     sch._schedule(message.body)
  //     expect(spy).to.have.been.calledWith(message.body.cron)
  //     expect(sch.runningJobs).to.not.be.empty
  //   })
  // })
  //
  // describe.skip('._onEvent', () => {
  //
  //   let httpMock
  //     , nock = require('nock')
  //
  //   before(() => {
  //     httpMock = nock(message.body.url)
  //       .get('/')
  //       .reply(200)
  //   })
  //
  //   after(nock.cleanAll)
  //
  //   afterEach(() => {
  //     httpMock.done()
  //   })
  //
  //   it('should send http request', done => {
  //     let sch = scheduler(redis)
  //     sch._onEvent(message.body)
  //     setTimeout(done, 100)
  //   })
  // })
  //
})
