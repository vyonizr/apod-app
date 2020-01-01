const router = require('express').Router()
const users = require('./users')
const pictures = require('./pictures')
const friends = require('./friends')

router.use('/users', users)
router.use('/pictures', pictures)
router.use('/friends', friends)
router.get('*', (req, res) => {
  res.status(404).send('Not found');
});

module.exports = router