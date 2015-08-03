'use strict';

const supertest = require('supertest')
  , mocha       = require('mocha')
  , expect      = require('chai').expect
  , app         = require('../../app')
  , request     = supertest(app.listen())
  , Event       = require('../../api/events/model');

require('co-mocha')(mocha);

describe('EventsControllerSpec', function() {

  let key = 'user-hash'
    , fixture = require('./fixture')()
    , evt1 = fixture.event1
    , evt2 = fixture.event2;

  beforeEach(function *(done) {
    try {
      yield [
        Event.save(key, evt1),
        Event.save(key, evt2)
      ];
      done();
    } catch(err) {
      done(err);
    }
  });

  afterEach(function *(done) {
    try {
      yield [
        Event.delete(key, evt1.id),
        Event.delete(key, evt2.id)
      ];
      done();
    } catch(err) {
      done(err);
    }
  });

  it('should respond 401', function(done) {
    request
    .get('/events')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(401, function(err, res) {
      expect(res.body.error).to.equal('unauthorized');
      done();
    });
  });

  describe('GET /v1/events', function() {
    it('should find all events', function(done) {
      request
        .get('/v1/events')
        .auth('user-hash', 'user-pass')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, function(err, res) {
          expect(res.body.length).to.be.equal(2);
          expect(res.body).to.eql([evt2, evt1]);
          done();
        });
    });
  });

  describe('GET /events/:id', function() {
    it('should find a event by id', function(done) {
      request
        .get('/v1/events/' + evt1.id)
        .auth('user-hash', 'user-pass')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, function(err, res) {
          expect(res.body.id).to.eql(evt1.id);
          done();
        });
    });
  });

});
