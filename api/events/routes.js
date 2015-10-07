import koaRouter from 'koa-router'
import Event from './collection'

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
    this.body = yield Event.create(event)
  } catch(err) {
    this.throw(500, err)
  }
})

router.put('/:id', function* () {
  let event = this.request.body
    , id = this.params.id

  try {
    this.body = yield Event.update(id, event)
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
