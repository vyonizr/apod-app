const dayjs = require('dayjs')

const firstAPODUnix = 803260800

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const getRandomDate = () => {
  const randomUnix = getRandomInt(firstAPODUnix, Math.floor(Date.now() / 1000))
  return dayjs.unix(randomUnix).format('YYYY-MM-DD')
}

module.exports = getRandomDate