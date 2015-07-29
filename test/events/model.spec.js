'use strict';

const chai      = require('chai')
  , mocha       = require('mocha')
  , sinon       = require('sinon')
  , sinonChai   = require('sinon-chai')
  , expect      = chai.expect
  , redis       = require('../../lib/redis')
  , Event       = require('../../api/events/model');

chai.use(sinonChai);
require('co-mocha')(mocha);

describe('EventModel', function() {

  let acckey = 'user-hash';
  let event1 = {
    url: 'https://example1.com',
    type: 'Recurring',
    cron: '* * * * ?'
  };
  let event2 = {
    url: 'https://example2.com',
    type: 'Recurring',
    cron: '* * * * ?'
  };

  beforeEach(function *(done) {
    try {
      yield [
        Event.schedule(acckey, event1),
        Event.schedule(acckey, event2)
      ];
      done();
    } catch(err) {
      done(err);
    }
  });

  afterEach(function *(done) {
    try {
      yield Event.delete(acckey);
      done();
    } catch(err) {
      done(err);
    }
  });

  it('should find all events', function* (done) {
    try {
      let evts = yield Event.find(acckey);
      expect(evts.length).to.be.equal(2);
      expect(evts[0].id).to.not.be.empty;
      expect(evts[1].id).to.not.be.empty;
      done();
    } catch(err) {
      done(err);
    }
  });

  it('should get a event by id', function* (done) {
    try {
      let evt = yield Event.get(acckey, event1.id);
      expect(evt.url).to.be.equal(event1.url);
      done();
    } catch(err) {
      done(err);
    }
  });

  it('should schedule a event and publish schedule:new event', function* (done) {
    let spy = sinon.spy(redis, 'publish');
    try {
      let evt = yield Event.schedule(acckey, event1);
      expect(evt.id).to.not.be.empty;
      expect(spy).to.have.been.calledWith('schedule:new');
      done();
    } catch(err) {
      done(err);
    }
    spy.restore();
  });

  it('should update a schedule a event');

  it('should delete a event by id');

});
