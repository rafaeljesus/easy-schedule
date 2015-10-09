import koaRouter from 'koa-router'
import Event from './collection'
import Scheduler from './scheduler'

const router = koaRouter()

router.get('/', function* () {
  try {
    this.body = yield Event.findByUser(this.user)
  } catch(err) {
    this.throw(500, err)
  }
})

router.post('/', function* () {
  let event = this.request.body

  try {
    yield [
      Event.create(event),
      Scheduler.create(event)
    ]
    this.body = {message: 'succesfully scheduled event job'}
  } catch(err) {
    this.throw(500, err)
  }
})

router.put('/:id', function* () {
  let event = this.request.body
    , id = this.params.id

  try {
    yield Event.update(id, event)
    this.body = {message: 'succesfully updated schedule job'}
  } catch(err) {
    console.log(err)
    this.throw(500, err)
  }
})

router.get('/:id', function* () {
  const id = this.params.id

  try {
    this.body = yield Event.findById(id)
  } catch(err) {
    this.throw(500, err)
  }
})

router.delete('/:id', function* () {
  const id = this.params.id

  try {
    this.body = yield Event.remove(id)
  } catch(err) {
    this.throw(500, err)
  }
})

module.exports = router
