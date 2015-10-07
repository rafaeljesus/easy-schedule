import koaRouter from 'koa-router'
import History from './collection'

const router = koaRouter()

router.get('/', function* () {
  try {
    this.body = yield History.findByUser(this.user)
  } catch(err) {
    this.throw(500, err)
  }
})

module.exports = router
