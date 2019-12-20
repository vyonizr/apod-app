const router = require('express').Router()
const users = require('./users')
const pictures = require('./pictures')
const friends = require('./friends')

router.use('/users', users)
router.use('/pictures', pictures)
router.use('/friends', friends)

module.exports = router