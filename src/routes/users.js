const router = require('express').Router()
const { UserController } = require('../controllers/')

router.post('/register', UserController.userRegister)
router.post('/login', UserController.userLogin)
router.get('/profile/:username', UserController.getAUser)

module.exports = router