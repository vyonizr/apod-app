const chai = require('chai')
const chaiHttp = require('chai-http')
const { expect } = chai

const { UserModel } = require('../models')
const app = require('../index')
const { jwt } = require('../helpers')

chai.use(chaiHttp)

const endpoint = {
  userRegister: '/users/register',
  userLogin: '/users/login',
  getAUser: (username) => `/users/profile/${username}`,
  addAFriend: (username) => `/users/profile/${username}/friends`,
  acceptFriendRequest: (username, friendUsername) => `/users/profile/${username}/friends/${friendUsername}/accept`,
  rejectFriendRequest: (username, friendUsername) => `/users/profile/${username}/friends/${friendUsername}/reject`,
  removeAFriend: (username, friendUsername) => `/users/profile/${username}/friends/${friendUsername}/remove`
}

const notFoundUsername = 'notfounduser'
let userToken = null
let secondUserToken = null
const firstUser = {
  username: 'anrupanna',
  password: 'Apod123'
}

const secondUser = {
  username: 'prismassive',
  password: 'Apod123'
}

describe('Users test', () => {
  before(async () => {
    try {
      await UserModel.deleteMany({})

      const registeredUser = await UserModel.create(firstUser)

      const secondRegisteredUser = await UserModel.create(secondUser)

      userToken = jwt.sign({
        id: registeredUser._id,
        username: registeredUser.username
      })

      secondUserToken = jwt.sign({
        id: secondRegisteredUser._id,
        username: secondRegisteredUser.username
      })
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
    const { userRegister } = endpoint

    describe('ON SUCCESS', () => {
      it('should return status 201 and { object user }', (done) => {
        const objUser = {
          username: 'annapurna',
          password: 'Apod123'
        }

        chai
        .request(app)
        .post(userRegister)
        .send(objUser)
        .end((err, res) => {
          expect(err).to.equal(null)
          expect(res).to.have.status(201)
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('status')
          expect(res.body).to.have.property('data')

          expect(res.body.status).to.be.a('string').and.equal('success')
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
        .post(userRegister)
        .send(objUser)
        .end((err, res) => {
          expect(err).to.equal(null)
          expect(res).to.have.status(400)
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('status')
          expect(res.body).to.have.property('message')

          expect(res.body.status).to.be.a('string').and.equal('fail')
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
        .post(userRegister)
        .send(objUser)
        .end((err, res) => {
          expect(err).to.equal(null)
          expect(res).to.have.status(400)
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('status')
          expect(res.body).to.have.property('message')

          expect(res.body.status).to.be.a('string').and.equal('fail')
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
        .post(userRegister)
        .send(objUser)
        .end((err, res) => {
          expect(err).to.equal(null)
          expect(res).to.have.status(409)
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('status')
          expect(res.body).to.have.property('message')

          expect(res.body.status).to.be.a('string').and.equal('fail')
          expect(res.body.message).to.be.a('string').and.equal('Username is already exist')
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
        .post(userRegister)
        .send(objUser)
        .end((err, res) => {
          expect(err).to.equal(null)
          expect(res).to.have.status(400)
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('status')
          expect(res.body).to.have.property('message')

          expect(res.body.status).to.be.a('string').and.equal('fail')
          expect(res.body.message).to.have.property('errors')
          expect(res.body.message.errors).to.be.an('array')
          done()
        })
      })
    })
  })

  describe('POST /users/login', () => {
    const { userLogin } = endpoint

    describe('ON SUCCESS', () => {
      it('should return status 200 and { object user }', (done) => {
        const objUser = {
          username: 'annapurna',
          password: 'Apod123'
        }

        chai
        .request(app)
        .post(userLogin)
        .send(objUser)
        .end((err, res) => {
          expect(err).to.equal(null)
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('status')
          expect(res.body).to.have.property('data')
          expect(res.body.status).to.be.a('string').and.equal('success')
          expect(res.body.data).to.be.an('object')

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
        .post(userLogin)
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
        .post(userLogin)
        .send(objUser)
        .end((err, res) => {
          expect(err).to.equal(null)
          expect(res).to.have.status(401)
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('status')
          expect(res.body).to.have.property('message')
          expect(res.body.status).to.be.a('string').and.equal('fail')
          expect(res.body.message).to.be.a('string').and.equal('Wrong username or password')
          done()
        })
      })
    })
  })

  describe('GET /users/profile/:username', () => {
    const { getAUser } = endpoint

    describe('ON SUCCESS', () => {
      it('should return status 200 and { object user }', (done) => {
        chai
        .request(app)
        .get(getAUser(firstUser.username))
        .end((err, res) => {
          expect(err).to.equal(null)
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('status')
          expect(res.body).to.have.property('data')
          expect(res.body.status).to.be.a('string').and.equal('success')
          expect(res.body.data).to.be.an('object')

          expect(res.body.data).to.have.property('_id')
          expect(res.body.data).to.have.property('username')
          expect(res.body.data).to.have.property('favorites')
          expect(res.body.data).to.have.property('friends')
          expect(res.body.data).not.to.have.property('password')
          expect(res.body.data).not.to.have.property('role')

          expect(res.body.data.username).to.be.a('string').and.equal(firstUser.username)
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
        .get(getAUser(notFoundUsername))
        .end((err, res) => {
          expect(err).to.equal(null)
          expect(res).to.have.status(404)
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('status')
          expect(res.body).to.have.property('message')

          expect(res.body.status).to.be.a('string').and.equal('fail')
          expect(res.body.message).to.be.a('string').and.equal('Username not found')
          done()
        })
      })
    })
  })

  describe('POST /users/profile/:username/friends', () => {
    const { addAFriend } = endpoint
    const selfUsername = firstUser.username
    const targetUsername = secondUser.username

    describe('ON SUCCESS', () => {
      it('should return status 200 an empty object', (done) => {

        chai
        .request(app)
        .post(addAFriend(selfUsername))
        .set('authentication', userToken)
        .send({ targetUsername })
        .end((err, res) => {
          expect(err).to.equal(null)
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('status')
          expect(res.body).to.have.property('data')
          expect(res.body.status).to.be.a('string').and.equal('success')
          expect(res.body.data).to.be.an('object')

          done()
        })
      })
    })

    describe('ON FAIL', () => {
      it('should return status 400 and { object error } if user adds himself', (done) => {
        chai
        .request(app)
        .post(addAFriend(selfUsername))
        .set('authentication', userToken)
        .send({ targetUsername: selfUsername })
        .end((err, res) => {
          expect(err).to.equal(null)
          expect(res).to.have.status(400)
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('status')
          expect(res.body).to.have.property('message')
          expect(res.body.status).to.be.a('string').and.equal('fail')
          expect(res.body.message).to.be.a('string').and.equal('Cannot send a friend request to oneself')

          done()
        })
      })

      it('should return status 404 and { object error } if user adds unregistered username', (done) => {
        chai
        .request(app)
        .post(addAFriend(selfUsername))
        .set('authentication', userToken)
        .send({ targetUsername: notFoundUsername })
        .end((err, res) => {
          expect(err).to.equal(null)
          expect(res).to.have.status(404)
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('status')
          expect(res.body).to.have.property('message')
          expect(res.body.status).to.be.a('string').and.equal('fail')
          expect(res.body.message).to.be.a('string').and.equal('The requested username was not found')

          done()
        })
      })
    })
  })

  describe('PUT /users/profile/:username/friends/:friendUsername/accept', () => {
    const { acceptFriendRequest } = endpoint
    const selfUsername = secondUser.username
    const targetUsername = firstUser.username

    describe('ON SUCCESS', () => {
      it('should return status 200 and { object success }', (done) => {
        chai
        .request(app)
        .put(acceptFriendRequest(selfUsername, targetUsername))
        .set('authentication', secondUserToken)
        .end((err, res) => {
          expect(err).to.equal(null)
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('status')
          expect(res.body).to.have.property('data')
          expect(res.body.status).to.be.a('string').and.equal('success')
          expect(res.body.data).to.be.an('object')

          done()
        })
      })
    })
  })
})