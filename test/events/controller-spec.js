'use strict';

const supertest = require('supertest')
  , expect      = require('chai').expect
  , app         = require('../../app')
  , request     = supertest(app.listen())
  , Event       = require('../../api/events/model');

describe('EventsControllerSpec', function() {

  describe('GET /v1/events', function() {

    let key = 'user-hash';
    let event = {
      url: 'https://example.com',
      type: 'Recurring',
      cron: '* * * * ?'
    };

    beforeEach(function(done) {
      Event.schedule(key, event)
        .then(function() {
          done();
        }).catch(function(err) {
          done(err);
        });
    });

    afterEach(function(done) {
      Event.delete(key)
        .then(function() {
          done();
        }).catch(function(err) {
          done(err);
        });
    });

    it('should find all events', function(done) {
      request
        .get('/v1/events')
        .auth('user-hash', 'user-pass')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, function(err, res) {
          expect(res.body).to.eql(event);
          done();
        });
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
  });

  describe('GET /events/:id', function() {

    let key = 'user-hash';
    let event = {
      id: '1231231209838997678236',
      url: 'https://example.com',
      type: 'Recurring',
      cron: '* * * * ?'
    };

    beforeEach(function(done) {
      Event.schedule(key, event)
        .then(function(res) {
          expect(res).to.be.ok;
          done();
        }).catch(function(err) {
          done(err);
        });
    });

    afterEach(function(done) {
      Event.delete(key).then(function() {
        done();
      });
    });

    it('should find a event by id', function(done) {
      request
        .get('/v1/events/' + event.id)
        .auth('user-hash', 'user-pass')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, function(err, res) {
          expect(res.body).to.eql(event);
          done();
        });
    });
  });

});
