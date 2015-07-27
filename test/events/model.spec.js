'use strict';

const chai      = require('chai')
  , mocha       = require('mocha')
  // , sinon       = require('sinon')
  // , sinonChai   = require('sinon-chai')
  , expect      = chai.expect
  , Event       = require('../../api/events/model');

// chai.use(sinonChai);
require('co-mocha')(mocha);

describe('EventModel', function() {

  let key = 'user-hash';
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
        Event.schedule(key, event1),
        Event.schedule(key, event2)
      ];
      done();
    } catch(err) {
      done(err);
    }
  });

  afterEach(function *(done) {
    try {
      yield Event.delete(key);
      done();
    } catch(err) {
      done(err);
    }
  });

  it('should find all events', function* (done) {
    try {
      let evts = yield Event.find(key);
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
      let evt = yield Event.get(key, event1.id);
      expect(evt.url).to.be.equal(event1.url);
      done();
    } catch(err) {
      done(err);
    }
  });

  it('should create a schedule event');

  it('should update a schedule a event');

  it('should delete a event by id');

});
