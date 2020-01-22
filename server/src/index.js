require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const PORT = process.env.PORT || 2048
const routes = require('./routes')
const environment = process.env.NODE_ENV

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/', routes)

mongoose.set('useCreateIndex', true)
mongoose.set('useFindAndModify', false)

let databaseURL = environment === 'test' || environment === 'dev'
? 'mongodb://localhost:27017/nasa-apod-api'
: `mongodb://${process.env.MLAB_USERNAME}:${process.env.MLAB_PASSWORD}@ds151697.mlab.com:51697/heroku_g4q3rqql`

if (environment === 'test') {
  databaseURL += '-test'
}

mongoose.connect(databaseURL, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
  })
})
.catch(error => {
  console.log(error);
})

module.exports = app