const chai = require('chai')
const dayjs = require('dayjs')
const chaiHttp = require('chai-http')
const expect = chai.expect

const app = require('../index')
const { fetchAPOD, jwt, getRandomDate } = require('../helpers')
const { PictureModel, UserModel } = require('../models')

let userToken = null
const sampleDate = '2018-01-01'
let pictureID = null

chai.use(chaiHttp)

describe('Pictures test', () => {
  before(async () => {
    try {
      await UserModel.deleteMany({})
      await PictureModel.deleteMany({})

      const createdUser = await UserModel.create({
        username: 'annapurna',
        password: 'Apod123'
      })

      userToken = jwt.sign({
        id: createdUser._id,
        username: createdUser.username
      })

      const { data } = await fetchAPOD(sampleDate)
      const createdPicture = await PictureModel.create(data)

      pictureID = createdPicture._id
    }
    catch (err) {
      console.error(err);
    }
  })

  after(async () => {
    try {
      await UserModel.deleteMany({})
      await PictureModel.deleteMany({})
    }
    catch (err) {
      console.error(err);
    }
  })

  describe('GET /pictures/', () => {
    describe('ON SUCCESS', () => {
      it('should return status 200 and { object picture } when query date is undefined', (done) => {
        chai
        .request(app)
        .get('/pictures/')
        .end((err, res) => {
          expect(err).to.equal(null)
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('status')
          expect(res.body).to.have.property('data')
          expect(res.body.status).to.be.a('string')
          expect(res.body.data).to.be.an('object')
          done()
        })
      })

      it('should return status 200 and { object picture } when query date is defined', (done) => {
        chai
        .request(app)
        .get('/pictures/')
        .query({ date: getRandomDate()})
        .end((err, res) => {
          expect(err).to.equal(null)
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('status')
          expect(res.body).to.have.property('data')
          expect(res.body.status).to.be.a('string')
          expect(res.body.data).to.be.an('object')
          done()
        })
      })

      it('should return status 200 and { object picture } when query date is empty', (done) => {
        chai
        .request(app)
        .get('/pictures/')
        .query({ date: ''})
        .end((err, res) => {
          expect(err).to.equal(null)
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('status')
          expect(res.body).to.have.property('data')
          expect(res.body.status).to.be.a('string')
          expect(res.body.data).to.be.an('object')
          done()
        })
      })
    })

    describe('ON FAIL', () => {
      it('should return status 400 and { object error } when query date is before June 16 1995', (done) => {
        chai
        .request(app)
        .get('/pictures/')
        .query({ date: '1995-06-15'})
        .end((err, res) => {
          expect(err).to.equal(null)
          expect(res).to.have.status(400)
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('status')
          expect(res.body).to.have.property('message')
          expect(res.body.status).to.be.a('string')
          expect(res.body.message).to.be.an('string')
          done()
        })
      })

      it('should return status 400 and { object error } when query date is tomorrow', (done) => {
        const tomorrowDate = dayjs.unix(Math.floor(Date.now() / 1000) + 86400).format('YYYY-MM-DD')

        chai
        .request(app)
        .get('/pictures/')
        .query({ date: tomorrowDate})
        .end((err, res) => {
          expect(err).to.equal(null)
          expect(res).to.have.status(400)
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('status')
          expect(res.body).to.have.property('message')
          expect(res.body.status).to.be.a('string')
          expect(res.body.message).to.be.an('string')
          done()
        })
      })
    })
  })

  describe('POST /pictures/', () => {
    describe('ON SUCCESS', () => {
      it('should return status 201 and { object picture }', (done) => {
        chai
        .request(app)
        .post('/pictures/')
        .set('authentication', userToken)
        .send({ date: '2019-01-01'})
        .end((err, res) => {
          expect(err).to.equal(null)
          expect(res).to.have.status(201)
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('status')
          expect(res.body).to.have.property('data')
          expect(res.body.status).to.be.a('string')
          expect(res.body.data).to.be.an('object')
          done()
        })
      })

      it('should return status 200 and { object picture } when picture is already exist on DB', (done) => {
        chai
        .request(app)
        .post('/pictures/')
        .set('authentication', userToken)
        .send({ date: sampleDate })
        .end((err, res) => {
          expect(err).to.equal(null)
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('status')
          expect(res.body).to.have.property('data')
          expect(res.body.status).to.be.a('string')
          expect(res.body.data).to.be.an('object')
          done()
        })
      })
    })

    describe('ON FAIL', () => {
      it('should return status 401 and { object error } when user is not authenticated', (done) => {
        chai
        .request(app)
        .post('/pictures/')
        .send({ date: '2019-01-02' })
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
    })
  })

  describe('DELETE /pictures/:pictureID', () => {
    describe('ON SUCCESS', () => {
      it('should return status 204', (done) => {
        chai
        .request(app)
        .delete(`/pictures/${pictureID}`)
        .set('authentication', userToken)
        .end((err, res) => {
          expect(err).to.equal(null)
          expect(res).to.have.status(204)
          done()
        })
      })
    })

    describe('ON FAIL', () => {
      it('should return status 401 and { object fail }', (done) => {
        chai
        .request(app)
        .delete(`/pictures/${sampleDate}`)
        .end((err, res) => {
          expect(err).to.equal(null)
          expect(res).to.have.status(401)
          done()
        })
      })
    })
  })
})