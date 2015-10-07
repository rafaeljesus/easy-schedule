import monk from 'monk'
import wrap from 'co-monk'

const db = monk('localhost/schedule')

module.exports = name => wrap(db.get(name))
