import supertest from 'supertest'
import mocha from 'mocha'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import coMocha from 'co-mocha'
import chai from 'chai'
import app from '../app'

global.app = app
global.sinon = sinon
global.request = supertest(app.listen())
global.expect = chai.expect

chai.use(sinonChai)
coMocha(mocha)
