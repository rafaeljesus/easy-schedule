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

  let message = {
    url: 'http://google.com',
    cron: '* * * * * *',
    retries: 1
  };

  describe('#use', function() {

    it('should subscribe to schedule:created', function() {
      let spy = sinon.spy(redis, 'subscribe');
      scheduler.use(redis);
      expect(spy).to.have.been.calledWith('schedule:created');
      spy.restore();
    });

    it('should listen to redis message', function() {
      let spy = sinon.spy(redis, 'on');
      scheduler.use(redis);
      expect(spy).to.have.been.calledWith('message');
      spy.restore();
    });
  });

  describe('#handleMessage', function() {

    it('should schedule a job event', function(done) {
      let channel = {};
      let spy = sinon.spy(schedule, 'scheduleJob');
      let sch = scheduler(redis);
      sch.handleMessage(channel, JSON.stringify(message));
      expect(spy).to.have.been.calledWith(message.cron);
      done();
    });
  });

  describe('#_onEvent', function() {

    let httpMock
      , nock = require('nock');

    before(function() {
      httpMock = nock(message.url)
        .get('/')
        .reply(200);
    });

    after(nock.cleanAll);

    afterEach(function() {
      httpMock.done();
    });

    it('should send http request', function(done) {
      let sch = scheduler(redis);
      sch._onEvent(message);
      setTimeout(done, 100);
    });
  });

});
