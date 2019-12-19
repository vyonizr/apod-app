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
  addAFriend: '/friends/',
  acceptFriendRequest: '/friends/accept',
  rejectFriendRequest: '/friends/reject',
  removeAFriend: '/friends/remove'
}

const notFoundUsername = 'notfounduser'
let userToken = null
let secondUserToken = null
let thirdUserToken = null
const firstUser = {
  username: 'anrupanna',
  password: 'Apod123'
}

const secondUser = {
  username: 'prismassive',
  password: 'Apod123'
}

const thirdUser = {
  username: 'morphism',
  password: 'Apod123'
}


describe('Users test', () => {
  before(async () => {
    try {
      await UserModel.deleteMany({})

      const registeredUser = await UserModel.create(firstUser)
      const secondRegisteredUser = await UserModel.create(secondUser)
      const thirdRegisteredUser = await UserModel.create(thirdUser)


      await UserModel.findByIdAndUpdate(registeredUser._id, { $push: { friends: thirdRegisteredUser } })
      await UserModel.findByIdAndUpdate(thirdRegisteredUser._id, { $push: { friends: registeredUser } })

      await UserModel.findByIdAndUpdate(registeredUser._id, { $push: { pendingFriends: secondRegisteredUser } })
      await UserModel.findByIdAndUpdate(secondRegisteredUser._id, { $push: { pendingFriends: thirdRegisteredUser } })

      userToken = jwt.sign({
        id: registeredUser._id,
        username: registeredUser.username
      })

      secondUserToken = jwt.sign({
        id: secondRegisteredUser._id,
        username: secondRegisteredUser.username
      })

      thirdUserToken = jwt.sign({
        id: thirdRegisteredUser._id,
        username: thirdRegisteredUser.username
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

  describe('POST /friends/', () => {
    const { addAFriend } = endpoint

    describe('ON SUCCESS', () => {
      const targetUsername = secondUser.username

      it('should return status 200 an empty object', (done) => {
        chai
        .request(app)
        .post(addAFriend)
        .set('content-type', 'application/json')
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
      const selfUsername = firstUser.username
      const targetUsername = thirdUser.username

      it('should return status 400 and { object error } if user does not send mandatory parameter', (done) => {
        chai
        .request(app)
        .post(addAFriend)
        .set('content-type', 'application/json')
        .set('authentication', userToken)
        .end((err, res) => {
          expect(err).to.equal(null)
          expect(res).to.have.status(400)
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('status')
          expect(res.body).to.have.property('message')
          expect(res.body.status).to.be.a('string').and.equal('fail')
          expect(res.body.message).to.be.a('string').and.equal('Invalid mandatory parameter(s)')

          done()
        })
      })

      it('should return status 400 and { object error } if user adds himself', (done) => {
        chai
        .request(app)
        .post(addAFriend)
        .set('content-type', 'application/json')
        .set('authentication', userToken)
        .send({ targetUsername: selfUsername })
        .end((err, res) => {
          expect(err).to.equal(null)
          expect(res).to.have.status(400)
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('status')
          expect(res.body).to.have.property('message')
          expect(res.body.status).to.be.a('string').and.equal('fail')
          expect(res.body.message).to.be.a('string').and.equal('Invalid mandatory parameter(s)')

          done()
        })
      })

      it('should return status 401 and { object error } if user is unauthenticated', (done) => {
        chai
        .request(app)
        .post(addAFriend)
        .send({ targetUsername })
        .end((err, res) => {
          expect(err).to.equal(null)
          expect(res).to.have.status(401)
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('status')
          expect(res.body).to.have.property('message')
          expect(res.body.status).to.be.a('string').and.equal('fail')
          expect(res.body.message).to.be.a('string').and.equal('You are not authenticated. Please login.')

          done()
        })
      })

      it('should return status 404 and { object error } if user adds unregistered username', (done) => {
        chai
        .request(app)
        .post(addAFriend)
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

      it('should return status 409 and { object error } if user adds friend that already on his friends list', (done) => {
        chai
        .request(app)
        .post(addAFriend)
        .set('authentication', userToken)
        .send({ targetUsername: thirdUser.username })
        .end((err, res) => {
          expect(err).to.equal(null)
          expect(res).to.have.status(409)
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('status')
          expect(res.body).to.have.property('message')
          expect(res.body.status).to.be.a('string').and.equal('fail')
          expect(res.body.message).to.be.a('string').and.equal(`${targetUsername} is already on your friends list`)

          done()
        })
      })
    })
  })

  describe('PUT /friends/accept', () => {
    const { acceptFriendRequest } = endpoint
    const targetUsername = firstUser.username

    describe('ON SUCCESS', () => {
      it('should return status 200 and { object success }', (done) => {
        chai
        .request(app)
        .put(acceptFriendRequest)
        .set('authentication', secondUserToken)
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
      it('should return status 400 and { object error } if user does not send mandatory parameter', (done) => {
        chai
        .request(app)
        .put(acceptFriendRequest)
        .set('content-type', 'application/json')
        .set('authentication', userToken)
        .end((err, res) => {
          expect(err).to.equal(null)
          expect(res).to.have.status(400)
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('status')
          expect(res.body).to.have.property('message')
          expect(res.body.status).to.be.a('string').and.equal('fail')
          expect(res.body.message).to.be.a('string').and.equal('Invalid mandatory parameter(s)')

          done()
        })
      })

      it('should return 404 and { object error } if the user accepts a username that does not exist on pending request', (done) => {
        chai
        .request(app)
        .put(acceptFriendRequest)
        .set('authentication', secondUserToken)
        .send({ targetUsername: 'annapurna' })
        .end((err, res) => {
          expect(err).to.equal(null)
          expect(res).to.have.status(404)
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('status')
          expect(res.body).to.have.property('message')
          expect(res.body.status).to.be.a('string').and.equal('fail')
          expect(res.body.message).to.be.a('string').and.equal(`Username annapurna does not exist on pending requests`)

          done()
        })
      })
    })
  })

  describe('PUT /friends/reject', () => {
    const { rejectFriendRequest } = endpoint
    const targetUsername = thirdUser.username

    describe('ON SUCCESS', () => {
      it('should return status 200 and { object success }', (done) => {
        chai
        .request(app)
        .put(rejectFriendRequest)
        .set('authentication', secondUserToken)
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
      it('should return status 400 and { object error } if user does not send mandatory parameter', (done) => {
        chai
        .request(app)
        .put(rejectFriendRequest)
        .set('content-type', 'application/json')
        .set('authentication', secondUserToken)
        .end((err, res) => {
          expect(err).to.equal(null)
          expect(res).to.have.status(400)
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('status')
          expect(res.body).to.have.property('message')
          expect(res.body.status).to.be.a('string').and.equal('fail')
          expect(res.body.message).to.be.a('string').and.equal('Invalid mandatory parameter(s)')

          done()
        })
      })

      it('should return 404 and { object error } if the user rejects a username that does not exist on pending request', (done) => {
        chai
        .request(app)
        .put(rejectFriendRequest)
        .set('authentication', secondUserToken)
        .send({ targetUsername: 'annapurna' })
        .end((err, res) => {
          expect(err).to.equal(null)
          expect(res).to.have.status(404)
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('status')
          expect(res.body).to.have.property('message')
          expect(res.body.status).to.be.a('string').and.equal('fail')
          expect(res.body.message).to.be.a('string').and.equal(`Username annapurna does not exist on pending requests`)

          done()
        })
      })
    })
  })
})