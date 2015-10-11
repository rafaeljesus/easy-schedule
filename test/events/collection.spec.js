import Event from '../../api/events/collection'

describe('Events:CollectionSpec', () => {

  afterEach(function* () {
    try {
      yield Event.cleardb()
    } catch(err) {
      expect(err).to.exist
    }
  })

  describe('.findAll', () => {

    let fixture = require('./fixture')()
      , evt1 = fixture.event1

    beforeEach(function* () {
      try {
        yield Event.create(evt1)
      } catch(err) {
        expect(err).to.not.be.ok
      }
    })

    it('should find all events', function* () {
      try {
        let res = yield Event.findAll()
        expect(res).to.not.be.empty
      } catch(err) {
        expect(err).to.not.be.ok
      }
    })
  })

  describe('.findByUser', () => {

    let fixture = require('./fixture')()
      , userFixture = {name: 'foo', _id: 'bar'}
      , evt1 = fixture.event1
      , evt2 = fixture.event2

    beforeEach(function* () {
      evt1.user = userFixture
      evt2.user = userFixture
      try {
        yield [
          Event.create(evt1),
          Event.create(evt2)
        ]
      } catch(err) {
        expect(err).to.exist
      }
    })

    it('should find events by user', function* () {
      try {
        let res = yield Event.findByUser(userFixture)
        expect(res.length).to.be.equal(2)
        expect(res[0]._id).to.not.be.empty
        expect(res[1]._id).to.not.be.empty
      } catch(err) {
        expect(err).to.not.exist
      }
    })
  })

  describe('.get', () => {

    let fixture = require('./fixture')()
      , evt1 = fixture.event1

    beforeEach(function* () {
      try {
        evt1 = yield Event.create(evt1)
      } catch(err) {
        expect(err).to.not.exist
      }
    })

    it('should get a event by id', function* () {
      try {
        let evt = yield Event.findById(evt1._id)
        expect(evt.url).to.be.equal(evt1.url)
      } catch(err) {
        expect(err).to.not.exist
      }
    })
  })

  describe('.create', () => {

    let fixture = require('./fixture')()
      , evt1 = fixture.event1

    it('should create a event and publish schedule:created', function* () {
      try {
        evt1 = yield Event.create(evt1)
        expect(evt1._id).to.exist
      } catch(err) {
        expect(err).to.not.exist
      }
    })
  })

  describe('.update', function() {

    let fixture = require('./fixture')()
      , evt1 = fixture.event1

    beforeEach(function* () {
      evt1 = yield Event.create(evt1)
    })

    it('should update a event and publish schedule:updated', function* () {
      evt1.url = 'https://example2.com'
      try {
        let _id = evt1._id
        delete evt1._id
        let evt = yield Event.update(_id, evt1)
        expect(evt.url).to.be.equal(evt1.url)
      } catch(err) {
        expect(err).to.not.exist
      }
    })
  })

  describe('.delete', () => {

    let fixture = require('./fixture')()
      , evt1 = fixture.event1

    beforeEach(function* () {
      try {
        evt1 = yield Event.create(evt1)
      } catch(err) {
        expect(err).to.not.exist
      }
    })

    it('should delete a event and publish schedule:deleted', function* () {
      try {
        let res = yield Event.remove(evt1._id)
        expect(res).to.eql(1)
      } catch(err) {
        expect(err).to.not.exist
      }
    })
  })

})
