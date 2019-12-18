const router = require('express').Router()
const { UserController } = require('../controllers/')
const { isAuthenticated, isSelfTargeting, isAlreadyAFriend } = require('../middlewares')

router.post('/register', UserController.userRegister)
router.post('/login', UserController.userLogin)
router.get('/profile/:username', UserController.getAUser)
router.post('/profile/:username/friends', isAuthenticated, isSelfTargeting, isAlreadyAFriend, UserController.addAFriend)
router.put('/profile/:username/friends/:friendUsername/accept', isAuthenticated, UserController.acceptAFriendRequest)
router.put('/profile/:username/friends/:friendUsername/reject', isAuthenticated, UserController.rejectAFriendRequest)
router.delete('/profile/:username/friends/:friendUsername/remove', isAuthenticated, UserController.removeAFriend)

module.exports = router