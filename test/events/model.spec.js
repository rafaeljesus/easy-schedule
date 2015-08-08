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

  afterEach(function *(done) {
    try {
      yield redis.flushdb();
      done();
    } catch(err) {
      done(err);
    }
  });

  describe('#find', function() {

    let fixture = require('./fixture')()
      , evt1 = fixture.event1
      , evt2 = fixture.event2;

    before(function *(done) {
      try {
        yield [
          Event.create(acckey, evt1),
          Event.create(acckey, evt2)
        ];
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
  });

  describe('#get', function() {

    let fixture = require('./fixture')()
      , evt1 = fixture.event1;

    before(function *(done) {
      try {
        evt1 = yield Event.create(acckey, evt1);
        done();
      } catch(err) {
        done(err);
      }
    });

    it('should get a event by id', function* (done) {
      try {
        let evt = yield Event.get(acckey, evt1.id);
        expect(evt.url).to.be.equal(evt1.url);
        done();
      } catch(err) {
        done(err);
      }
    });
  });

  describe('#create', function() {

    let spy
      , fixture = require('./fixture')()
      , evt1 = fixture.event1;

    before(function() {
      spy = sinon.spy(redis, 'publish');
    });

    after(function* () {
      spy.restore();
    });

    it('should create a event and publish schedule:created', function* (done) {
      try {
        evt1 = yield Event.create(acckey, evt1);
        expect(evt1.id).to.not.be.empty;
        expect(spy).to.have.been.calledWith('schedule:created');
        done();
      } catch(err) {
        done(err);
      }
    });
  });

  describe('#update', function() {

    let spy
      , fixture = require('./fixture')()
      , evt1 = fixture.event1;

    before(function* (done) {
      spy = sinon.spy(redis, 'publish');
      evt1 = yield Event.create(acckey, evt1);
      done();
    });

    after(function *() {
      spy.restore();
    });

    it('should update a event and publish schedule:updated', function* (done) {
      evt1.url = 'https://example2.com';
      try {
        let evt = yield Event.update(acckey, evt1);
        expect(evt.url).to.be.equal(evt1.url);
        expect(spy).to.have.been.calledWith('schedule:updated');
        done();
      } catch(err) {
        done(err);
      }
    });
  });

  describe('#delete', function() {

    let spy
      , fixture = require('./fixture')()
      , evt1 = fixture.event1;

    before(function* (done) {
      spy = sinon.spy(redis, 'publish');
      try {
        evt1 = yield Event.create(acckey, evt1);
        done();
      } catch(err) {
        done(err);
      }
    });

    it('should delete a event and publish schedule:deleted', function* (done) {
      try {
        let res = yield Event.delete(acckey, evt1.id);
        expect(res).to.have.length(4);
        expect(spy).to.have.been.calledWith('schedule:deleted');
        done();
      } catch(err) {
        done(err);
      }
    });
  });

});
