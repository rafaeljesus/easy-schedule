import supertest from 'supertest'
import mocha from 'mocha'
import coMocha from 'co-mocha'
import chai from 'chai'
import app from '../app'

global.app = app
global.request = supertest(app.listen())
global.expect = chai.expect

coMocha(mocha)
