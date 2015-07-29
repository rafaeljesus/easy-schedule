'use strict';

const chai      = require('chai')
  , mocha       = require('mocha')
  , sinon       = require('sinon')
  , sinonChai   = require('sinon-chai')
  , expect      = chai.expect
  , redis       = require('../../lib/redis-sub')
  , scheduler   = require('../../api/events/scheduler');

chai.use(sinonChai);
require('co-mocha')(mocha);

describe('SchedulerSpec', function() {

  describe('#use', function() {

    it('should subscribe to schedule:new', function() {
      let spy = sinon.spy(redis, 'subscribe');
      scheduler.use(redis);
      expect(spy).to.have.been.calledWith('schedule:new');
      spy.restore();
    });

    it('should listen to redis message', function() {
      let spy = sinon.spy(redis, 'on');
      scheduler.use(redis);
      expect(spy).to.have.been.calledWith('message');
      spy.restore();
    });
  });

  describe.skip('#handleMessage', function() {
  });

});
