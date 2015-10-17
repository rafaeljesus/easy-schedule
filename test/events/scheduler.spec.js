import scheduler from 'node-schedule'
import Scheduler from '../../api/events/scheduler'
import Event from '../../api/events/collection'

describe('Events:SchedulerSpec', () => {

  let scheduleJobSpy
    , event

  beforeEach(() => {
    event = {_id: 'foo', cron: '* * * * *'}
    scheduleJobSpy = sinon.spy(scheduler, 'scheduleJob')
    Scheduler.runningJobs = {}
  })

  afterEach(() => scheduleJobSpy.restore())

  describe.skip('.start', () => {

    let findAllStub

    beforeEach(function* () {
      findAllStub = sinon.stub(Event, 'findAll', () => [
        {_id: 'foo'},
        {_id: 'bar'}
      ])
      yield Scheduler.start()
    })

    afterEach(() => findAllStub.restore())

    it('should find all events stored on db', () => {
      expect(findAllStub).to.have.been.called
    })

    it('should schedule events', () => {
      expect(scheduleJobSpy).to.have.been.calledTwice
    })

    it('should have scheduled two running jobs', () => {
      expect(Scheduler.getScheduledEvents()).to.contain.any.keys('foo', 'bar')
    })
  })

  describe('.create', () => {

    beforeEach(function* () {
      yield Scheduler.create(event)
    })

    it('should have one scheduled running jobs', () => {
      const running = Scheduler.getScheduledEvents()
      const len = Object.keys(running).length
      expect(len).to.equal(1)
      expect(running).to.contain.any.keys('foo')
    })

    it('should schedule new event', () => {
      expect(scheduleJobSpy).to.have.been.calledWith(event.cron)
    })
  })

  describe.skip('.update', () => {

    beforeEach(function* () {
      yield Scheduler.create(event)
    })

    it('should update scheduled event', function* () {
      event.cron = '1 * * * *'
      yield Scheduler.update(event._id, event)
      expect(scheduleJobSpy).to.have.been.calledWith(event.cron)
    })

    it('should have one scheduled running jobs', () => {
      // expect(Scheduler.runningJobs.length).to.have.length(1)
      console.log(Scheduler.runningJobs)
      expect(Scheduler.runningJobs).to.contain.any.keys('foo')
    })
  })

  describe.skip('.cancel', () => {

    beforeEach(function* () {
      yield Scheduler.create(event)
    })

    it('should cancel a scheduled job', function* () {
      let res = yield Scheduler.cancel(event._id)
      expect(res.ok).to.eql(1)
      expect(Scheduler.runningJobs[event._id]).to.not.exist
    })
  })

})
