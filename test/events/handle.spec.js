import nock from 'nock'
import History from '../../api/history/collection'
import handle from '../../api/events/handle'

describe('Events:HandleSpec', () => {

  let httpMock
  let event = {
    _id: 'foo',
    user: {_id: 'bar', name: 'foo'},
    url: 'https://google.com'
  }

  before(() => {
    httpMock = nock(event.url).
      get('/').
      reply(200, {
        statusCode: 200,
        body: {},
        headers: {}
      })
  })

  after(nock.cleanAll)

  afterEach(function* () {
    httpMock.done()
    yield History.cleardb()
  })

  beforeEach(() => handle(event))

  it('should send http request and store response', function* () {
    let res = yield History.findByUser(event.user)
    expect(res[0].event).to.exist
    expect(res[0].user).to.exist
    expect(res[0].url).to.exist
  })

})

