import koaRouter from 'koa-router'

const router = koaRouter()

router.get('/', function* () {
  this.type = 'json'
  this.status = 200
  this.body = {message: 'Easy Schedule rest api working'}
})

module.exports = router
