const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = chai.expect

const { UserModel } = require('../models')
const app = require('../index')

chai.use(chaiHttp)

describe('Users test', () => {
  before(async () => {
    try {
      await UserModel.deleteMany({})
    } catch (err) {
      console.error(err)
    }
  })

  after(async () => {
    try {
      await UserModel.deleteMany({})
    } catch (err) {
      console.error(err)
    }
  })

  describe('POST /users/register', () => {
    describe('ON SUCCESS', () => {
      it('should return status 201 and { object user }', (done) => {
        const objUser = {
          username: 'annapurna',
          password: 'Apod123'
        }

        chai
        .request(app)
        .post('/users/register')
        .send(objUser)
        .end((err, res) => {
          expect(err).to.equal(null)
          expect(res).to.have.status(201)
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('status')
          expect(res.body).to.have.property('data')

          expect(res.body.status).to.be.a('string')
          expect(res.body.status).to.have.string('success')
          expect(res.body.data).to.be.an('object')

          expect(res.body.data).to.have.property('username')
          expect(res.body.data).to.have.property('token')
          expect(res.body.data.username).to.be.a('string')
          expect(res.body.data.token).to.be.a('string')
          done()
        })
      })
    })

    describe('ON FAIL', () => {
      it('should return status 400 and { object error } when user inputs invalid username format', (done) => {
        const objUser = {
          username: 'tester!!!@#',
          password: 'Alpha1234'
        }

        chai
        .request(app)
        .post('/users/register')
        .send(objUser)
        .end((err, res) => {
          expect(err).to.equal(null)
          expect(res).to.have.status(400)
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('status')
          expect(res.body).to.have.property('message')

          expect(res.body.status).to.be.a('string')
          expect(res.body.status).to.have.string('fail')
          expect(res.body.message).to.have.property('errors')
          expect(res.body.message.errors).to.be.an('array')
          done()
        })
      })

      it('should return status 400 and { object error } when user inputs invalid password format', (done) => {
        const objUser = {
          username: 'tester',
          password: 'wrongs'
        }

        chai
        .request(app)
        .post('/users/register')
        .send(objUser)
        .end((err, res) => {
          expect(err).to.equal(null)
          expect(res).to.have.status(400)
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('status')
          expect(res.body).to.have.property('message')

          expect(res.body.status).to.be.a('string')
          expect(res.body.status).to.have.string('fail')
          expect(res.body.message).to.have.property('errors')
          expect(res.body.message.errors).to.be.an('array')
          done()
        })
      })

      it('should return status 409 and { object error } when a username is taken', (done) => {
        const objUser = {
          username: 'annapurna',
          password: 'wrongs'
        }

        chai
        .request(app)
        .post('/users/register')
        .send(objUser)
        .end((err, res) => {
          expect(err).to.equal(null)
          expect(res).to.have.status(409)
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('status')
          expect(res.body).to.have.property('message')

          expect(res.body.status).to.be.a('string')
          expect(res.body.status).to.have.string('fail')
          expect(res.body.message).to.be.a('string')
          expect(res.body.message).to.have.string('Username is already exist')
          done()
        })
      })

      it('should return status 400 and { object error } when user inputs invalid username and password format', (done) => {
        const objUser = {
          username: 'tester!!!@#',
          password: 'wrongs'
        }

        chai
        .request(app)
        .post('/users/register')
        .send(objUser)
        .end((err, res) => {
          expect(err).to.equal(null)
          expect(res).to.have.status(400)
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('status')
          expect(res.body).to.have.property('message')

          expect(res.body.status).to.be.a('string')
          expect(res.body.status).to.have.string('fail')
          expect(res.body.message).to.have.property('errors')
          expect(res.body.message.errors).to.be.an('array')
          done()
        })
      })
    })
  })

  describe('POST /users/login', () => {
    describe('ON SUCCESS', () => {
      it('should return status 200 and { object user }', (done) => {
        const objUser = {
          username: 'annapurna',
          password: 'Apod123'
        }

        chai
        .request(app)
        .post('/users/login')
        .send(objUser)
        .end((err, res) => {
          expect(err).to.equal(null)
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('status')
          expect(res.body).to.have.property('data')
          expect(res.body.status).to.be.a('string')
          expect(res.body.data).to.be.an('object')

          expect(res.body.status).to.have.string('success')
          expect(res.body.data).to.have.property('username')
          expect(res.body.data).to.have.property('id')
          expect(res.body.data).to.have.property('token')
          expect(res.body.data.username).to.be.a('string')
          expect(res.body.data.id).to.be.a('string')
          expect(res.body.data.token).to.be.a('string')
          done()
        })
      })
    })

    describe('ON FAIL', () => {
      it('should return status 401 and { object error } when a user logs in with unregistered username', (done) => {
        const objUser = {
          username: 'liam',
          password: 'liam'
        }

        chai
        .request(app)
        .post('/users/login')
        .send(objUser)
        .end((err, res) => {
          expect(err).to.equal(null)
          expect(res).to.have.status(401)
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('status')
          expect(res.body).to.have.property('message')
          expect(res.body.status).to.be.a('string')
          expect(res.body.message).to.be.a('string')
          done()
        })
      })

      it('should return status 401 and { object error } when a user logs in with wrong password', (done) => {
        const objUser = {
          username: 'annapurna',
          password: 'apod123'
        }

        chai
        .request(app)
        .post('/users/login')
        .send(objUser)
        .end((err, res) => {
          expect(err).to.equal(null)
          expect(res).to.have.status(401)
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('status')
          expect(res.body).to.have.property('message')
          expect(res.body.status).to.be.a('string')
          expect(res.body.status).to.have.string('fail')
          expect(res.body.message).to.be.a('string')
          expect(res.body.message).to.have.string('Wrong username or password')
          done()
        })
      })
    })
  })

  describe('GET /users/profile/:username', () => {
    describe('ON SUCCESS', () => {
      it('should return status 200 and { object user }', (done) => {
        const username = 'annapurna'

        chai
        .request(app)
        .get(`/users/profile/${username}`)
        .end((err, res) => {
          expect(err).to.equal(null)
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('status')
          expect(res.body).to.have.property('data')
          expect(res.body.status).to.be.a('string')
          expect(res.body.status).to.have.string('success')
          expect(res.body.data).to.be.an('object')

          expect(res.body.data).to.have.property('username')
          expect(res.body.data).to.have.property('favorites')
          expect(res.body.data).to.have.property('friends')
          expect(res.body.data).not.to.have.property('password')
          expect(res.body.data).not.to.have.property('role')

          expect(res.body.data.username).to.be.a('string')
          expect(res.body.data.username).to.have.string(username)
          expect(res.body.data.favorites).to.be.an('array')
          expect(res.body.data.friends).to.be.an('array')
          done()
        })
      })
    })

    describe('ON FAIL', () => {
      it('should return status 404 and { object error } when username is not found', (done) => {
        chai
        .request(app)
        .get(`/users/profile/verano`)
        .end((err, res) => {
          expect(err).to.equal(null)
          expect(res).to.have.status(404)
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('status')
          expect(res.body).to.have.property('message')

          expect(res.body.status).to.be.a('string')
          expect(res.body.status).to.have.string('fail')
          expect(res.body.message).to.be.a('string')
          expect(res.body.message).to.have.string('Username not found')
          done()
        })
      })
    })
  })
})