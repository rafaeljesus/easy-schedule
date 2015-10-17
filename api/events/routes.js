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
    let res = yield Event.create(event)
    event._id = res._id
    yield Scheduler.create(event)
    this.body = res._id
  } catch(err) {
    this.throw(500, err)
  }
})

router.put('/:id', function* () {
  let event = this.request.body
    , id = this.params.id

  try {
    let res = yield [
      Event.update(id, event),
      Scheduler.update(id, event)
    ]
    this.body = res[0]
  } catch(err) {
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
    yield [
      Event.remove(id),
      Scheduler.cancel(id)
    ]
    this.body = {message: 'succesfully updated schedule job'}
  } catch(err) {
    this.throw(500, err)
  }
})

export default router
