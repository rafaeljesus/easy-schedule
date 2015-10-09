import co from 'co'
import request from 'co-request'
import scheduler from 'node-schedule'
import log from '../../lib/log'
import utils from '../../lib/utils'
import C from '../../lib/constants'
import Event from '../events/collection'
import History from '../history/collection'

const isPlainObject = utils.isPlainObject
  , runningJobs = {}

const onEvent = event => {
  return co(function* () {
    let res = yield request(event.url)
    let logObj = {
      statusCode: res.statusCode,
      body: res.body,
      headers: res.headers
    }
    log.info('succesfully sent cron job request', logObj)
    logObj.event = event._id
    logObj.user = event.user
    logObj.url = event.url
    return yield History.create(logObj)
  }).catch(err => log.error('failed to send cron job request', err))
}

const _cancel = _id => {
  let job = runningJobs[_id]
  if (job) {
    job.cancel()
    job = null
  }
}

const schedule = event => {
  const cron = event.cron ? event.cron : new Date(event.when)
    , job = scheduler.scheduleJob(cron, onEvent.bind(null, event))

  runningJobs[event._id] = job
  log.info('succesfully scheduled job', event)
}

const start = () => {
  co(function* () {
    let res = yield Event.findAll()
    if (!res || res.length === 0) return

    if (isPlainObject(res)) {
      return schedule(res)
    }
    res.map(schedule)
  })
  .catch(err => log.error('scheduler failed to start', err))
}

const create = event => {
 schedule(event)
}

const update = (_id, event) => {
  cancel(_id)
  schedule(event)
}

const cancel = (_id) => {
  _cancel(_id)
}

export default {start, create, update, cancel}
