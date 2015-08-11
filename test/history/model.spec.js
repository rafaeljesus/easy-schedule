'use strict';

const chai      = require('chai')
  , mocha       = require('mocha')
  , expect      = chai.expect
  , redis       = require('../../lib/redis')
  , History     = require('../../api/history/model');

require('co-mocha')(mocha);

describe('HistoryModel', function() {

  let login = 'user-hash';
  let data = {
    event: 'foo',
    status: 200,
    url: 'https://github.com/rafaeljesus/easy-schedule',
    elapsed: 243,
    scheduled: '2013-12-13T20:12:43Z',
    actual: '2013-12-13T20:12:45Z'
  };

  afterEach(function* (done) {
    try {
      yield redis.flushdb();
      done();
    } catch(err) {
      done(err);
    }
  });

  describe('#find', function() {

    before(function *(done) {
      try {
        yield [
          History.create(login, data),
          History.create(login, data)
        ];
        done();
      } catch(err) {
        done(err);
      }
    });

    it('should find all history', function* (done) {
      try {
        let res = yield History.find(login);
        expect(res.length).to.be.equal(2);
        done();
      } catch(err) {
        done(err);
      }
    });
  });

  describe('#create', function() {

    it('should create a history event', function* (done) {
      try {
        let res = yield History.create(login, data);
        expect(res).to.be.equal(1);
        done();
      } catch(err) {
        done(err);
      }
    });
  });

});
