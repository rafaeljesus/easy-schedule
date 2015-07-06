'use strict';

var app       = require('../../app')
  , expect    = require('chai').expect
  , Event     = require('../../api/events/model')
  , request   = require('supertest')(app);

describe('EventsControllerSpec', function() {

  describe('GET /events', function() {

    var key = 'user-hash';
    var event = {
      url: 'https://example.com',
      type: 'Recurring',
      cron: '* * * * ?'
    };

    beforeEach(function(done) {
      Event
        .schedule(key, event)
        .then(function(res) {
          expect(res).to.be.ok;
          done();
        })
        .catch(function(err) {
          done(err);
        });
    });

    afterEach(function(done) {
      Event.delete(key).then(function() {
        done();
      });
    });

    it('should find all events', function(done) {
      request
        .get('/events')
        .auth('user-hash', 'user-pass')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, function(err, res) {
          expect(res.body).to.eql(event);
          done();
        });
    });

    xit('should respond 401', function(done) {
      request
        .get();
    });

  });

  describe('GET /events/:id', function() {

    beforeEach(function(done) {
      done();
    });

    it('should find a event by id', function() {
    });
  });

});
