'use strict';

const supertest = require('supertest')
  , mocha       = require('mocha')
  , expect      = require('chai').expect
  , redis       = require('../../lib/redis')
  , app         = require('../../app')
  , request     = supertest(app.listen())
  , Event       = require('../../api/events/model');

require('co-mocha')(mocha);

describe('EventsControllerSpec', function() {

  let fixture = require('./fixture')()
    , evt1 = fixture.event1
    , evt2 = fixture.event2
    , key = 'user-hash';

  beforeEach(function *(done) {
    try {
      yield [
        Event.create(key, evt1),
        Event.create(key, evt2)
      ];
      done();
    } catch(err) {
      done(err);
    }
  });

  afterEach(function *(done) {
    try {
      yield redis.flushdb();
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

  describe('GET /v1/events/:id', function() {
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

  describe('POST /v1/events', function() {
    it('should create a event', function(done) {
      request
        .post('/v1/events')
        .auth('user-hash', 'user-pass')
        .set('Accept', 'application/json')
        .send(evt1)
        .expect('Content-Type', /json/)
        .expect(200, function(err, res) {
          if (err) return done(err);
          expect(res.body.id).to.be.ok;
          done();
        });
    });
  });

  describe('PUT /v1/events/:id', function() {
    it('should update a event', function(done) {
      evt1.url = 'https://github.com/rafaeljesus';
      delete evt1.id;
      request
        .put('/v1/events/' + evt1.id)
        .auth('user-hash', 'user-pass')
        .send(evt1)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, function(err, res) {
          if (err) return done(err);
          expect(res.body.url).to.be.equal(evt1.url);
          done();
        });
    });
  });

  describe('DELETE /v1/events/:id', function() {
    it('should delete a event', function(done) {
      request
        .delete('/v1/events/' + evt1.id)
        .auth('user-hash', 'user-pass')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, function(err, res) {
          if (err) return done(err);
          expect(res.status).to.be.equal(200);
          done();
        });
    });
  });
});
