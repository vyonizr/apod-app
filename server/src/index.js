require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const PORT = process.env.PORT || 80
const routes = require('./routes')

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/', routes)

mongoose.set('useCreateIndex', true)
mongoose.set('useFindAndModify', false)

let databaseURL = 'mongodb://localhost:27017/nasa-apod-api'

switch(process.env.NODE_ENV) {
  case 'test': {
    databaseURL += '-test'
  }
  break;

  case 'prod': {
    databaseURL += '-prod'
  }
  break;
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