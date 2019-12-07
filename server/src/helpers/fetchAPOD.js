const axios = require('axios')
const APOD_KEY = process.env.APOD_KEY
const APOD_BASE_URL = 'https://api.nasa.gov/planetary/apod'

module.exports = (date) => {
  return axios.get(`${APOD_BASE_URL}?api_key=${APOD_KEY}&date=${date}`)
}