'use strict';

const supertest = require('supertest')
  , mocha       = require('mocha')
  , _           = require('lodash')
  , expect      = require('chai').expect
  , redis       = require('../../lib/redis')
  , app         = require('../../app')
  , request     = supertest(app.listen())
  , User        = require('../../api/users/model')
  , Event       = require('../../api/events/model');

require('co-mocha')(mocha);

describe('EventsControllerSpec', function() {

  let fixture = require('./fixture')()
    , evt1 = fixture.event1
    , evt2 = fixture.event2
    , login = 'user-login'
    , password = 'user-password';

  beforeEach(function* (done) {
    try {
      let res = yield [
        Event.create(login, evt1),
        Event.create(login, evt2),
        User.create(login, password)
      ];
      evt1 = res[0];
      evt2 = res[1];
      done();
    } catch(err) {
      done(err);
    }
  });

  afterEach(function* (done) {
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
    .set('Accept-Encoding', 'gzip')
    .expect('Content-Type', /json/)
    .expect(401, function(err, res) {
      if (err) return done(err);
      expect(res.body.error).to.equal('unauthorized');
      done();
    });
  });

  describe('GET /v1/events', function() {
    it('should find all events', function(done) {
      request
        .get('/v1/events')
        .auth(login, password)
        .set('Accept', 'application/json')
        .set('Accept-Encoding', 'gzip')
        .expect('Content-Type', /json/)
        .expect(200, function(err, res) {
          if (err) return done(err);
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
        .auth(login, password)
        .set('Accept', 'application/json')
        .set('Accept-Encoding', 'gzip')
        .expect('Content-Type', /json/)
        .expect(200, function(err, res) {
          if (err) return done(err);
          expect(res.body.id).to.eql(evt1.id);
          done();
        });
    });
  });

  describe('POST /v1/events', function() {
    it('should create a event', function(done) {
      request
        .post('/v1/events')
        .auth(login, password)
        .set('Accept', 'application/json')
        .set('Accept-Encoding', 'gzip')
        .send(_.omit(evt1, 'id'))
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
      request
        .put('/v1/events/' + evt1.id)
        .auth(login, password)
        .send(_.omit(evt1, 'id'))
        .set('Accept', 'application/json')
        .set('Accept-Encoding', 'gzip')
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
        .auth(login, password)
        .set('Accept', 'application/json')
        .set('Accept-Encoding', 'gzip')
        .expect('Content-Type', /json/)
        .expect(200, function(err, res) {
          if (err) return done(err);
          expect(res.status).to.be.equal(200);
          done();
        });
    });
  });
});
