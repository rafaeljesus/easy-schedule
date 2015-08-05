'use strict';

const chai      = require('chai')
  , mocha       = require('mocha')
  , sinon       = require('sinon')
  , sinonChai   = require('sinon-chai')
  , schedule    = require('node-schedule')
  , expect      = chai.expect
  , redis       = require('../../lib/redis-sub')
  , Event       = require('../../api/events/model')
  , scheduler   = require('../../api/events/scheduler');

chai.use(sinonChai);
require('co-mocha')(mocha);

describe('SchedulerSpec', function() {

  let fixture = require('./fixture')().event1;
  let message = {
    action: 'created',
    body: fixture
  };

  describe('#use', function() {

    let spy;

    afterEach(function() {
      spy.restore();
    });

    it('should subscribe to schedule:created', function() {
      spy = sinon.spy(redis, 'subscribe');
      scheduler.use(redis);
      expect(spy).to.have.been.calledWith('schedule:created');
    });

    it('should subscribe to schedule:updated', function() {
      spy = sinon.spy(redis, 'subscribe');
      scheduler.use(redis);
      expect(spy).to.have.been.calledWith('schedule:updated');
    });

    it('should listen to redis message', function() {
      spy = sinon.spy(redis, 'on');
      scheduler.use(redis);
      expect(spy).to.have.been.calledWith('message');
    });
  });

  describe('#start', function() {

    let findAllStub
      , _scheduleStub
      , fixture = require('./fixture')()
      , evt1 = fixture.event1
      , evt2 = fixture.event2;

    afterEach(function() {
      findAllStub.restore();
      _scheduleStub.restore();
    });

    it('should return all events', function* () {
      let sch = scheduler(redis);
      _scheduleStub = sinon.stub(sch, '_schedule');
      findAllStub = sinon.stub(Event, 'findAll', function() {
        return [evt1, evt2];
      });
      yield sch.start();
      expect(findAllStub).to.have.been.called;
      expect(_scheduleStub).to.have.been.calledTwice;
    });
  });

  describe('#handleMessage', function() {

    let channel, spy;

    beforeEach(function() {
      channel = {};
      spy = sinon.spy(schedule, 'scheduleJob');
    });

    afterEach(function() {
      spy.restore();
    });

    context('when action is created', function() {

      it('should schedule a job event', function* (done) {
        let sch = scheduler(redis);
        yield sch.handleMessage(channel, JSON.stringify(message));
        expect(spy).to.have.been.calledWith(fixture.cron);
        done();
      });
    });
  });

  describe('#_onEvent', function() {

    let httpMock
      , nock = require('nock');

    before(function() {
      httpMock = nock(message.body.url)
        .get('/')
        .reply(200);
    });

    after(nock.cleanAll);

    afterEach(function() {
      httpMock.done();
    });

    it('should send http request', function(done) {
      let sch = scheduler(redis);
      sch._onEvent(message.body);
      setTimeout(done, 100);
    });
  });

});
