const router = require('express').Router()
const users = require('./users')
const pictures = require('./pictures')

router.use('/users', users)
router.use('/pictures', pictures)

module.exports = router