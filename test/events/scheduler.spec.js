'use strict';

const chai      = require('chai')
  , mocha       = require('mocha')
  , sinon       = require('sinon')
  , sinonChai   = require('sinon-chai')
  , schedule    = require('node-schedule')
  , expect      = chai.expect
  , redis       = require('../../lib/redis-sub')
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

  it('#start');

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
