import User from '../../api/users/collection'
import Event from '../../api/events/collection'

describe('Events:RoutesSpec', () => {

  let fixture = require('./fixture')()
    , evt1 = fixture.event1
    , evt2 = fixture.event2
    , name = 'user-name'
    , password = 'user-password'

  beforeEach(function* () {
    try {
      let user = yield User.create(name, password)
      evt1.user = user
      evt2.user = user
      let res = yield [
        Event.create(evt1),
        Event.create(evt2),
      ]
      evt1 = res[0]
      evt2 = res[1]
    } catch(err) {
      expect(err).to.not.exist
    }
  })

  afterEach(function* () {
    try {
      yield [
        User.cleardb(),
        Event.cleardb()
      ]
    } catch(err) {
      expect(err).to.not.exist
    }
  })

  it('should respond 401', done => {
    request.
      get('/events').
      set('Accept', 'application/json').
      set('Accept-Encoding', 'gzip').
      expect('Content-Type', /json/).
      expect(401, done)
  })

  describe('GET /v1/events', () => {
    it('should find all events', done => {
      request.
        get('/v1/events').
        auth(name, password).
        set('Accept', 'application/json').
        set('Accept-Encoding', 'gzip').
        expect('Content-Type', /json/).
        expect(200, done)
    })
  })

  describe('GET /v1/events/:id', () => {
    it('should find a event by id', done => {
      request.
        get('/v1/events/' + evt1._id).
        auth(name, password).
        set('Accept', 'application/json').
        set('Accept-Encoding', 'gzip').
        expect('Content-Type', /json/).
        expect(200, done)
    })
  })

  describe('POST /v1/events', () => {
    it('should create a event', done => {
      delete evt1._id
      const newEvent = evt1
      request.
        post('/v1/events').
        auth(name, password).
        set('Accept', 'application/json').
        set('Accept-Encoding', 'gzip').
        send(newEvent).
        expect('Content-Type', /json/).
        expect(200, done)
    })
  })

  describe('PUT /v1/events/:id', () => {
    it('should update a event', done => {
      let _id = evt1._id
      delete evt1._id
      evt1.url = 'https://github.com/rafaeljesus'

      request.
        put('/v1/events/' + _id).
        auth(name, password).
        send(evt1).
        set('Accept', 'application/json').
        set('Accept-Encoding', 'gzip').
        expect('Content-Type', /json/).
        expect(200, done)
    })
  })

  describe('DELETE /v1/events/:id', () => {
    it('should delete a event', done => {
      request.
        delete('/v1/events/' + evt1._id).
        auth(name, password).
        set('Accept', 'application/json').
        set('Accept-Encoding', 'gzip').
        expect('Content-Type', /json/).
        expect(200, done)
    })
  })
})
