const router = require('express').Router()
const { UserController } = require('../controllers')
const { isAuthenticated, isSelfTargeting, isAlreadyAFriend, isOnPendingRequest } = require('../middlewares')

router.post('/', isAuthenticated, isSelfTargeting, isAlreadyAFriend, UserController.addAFriend)
router.delete('/:username', isAuthenticated, isSelfTargeting, isAlreadyAFriend, UserController.removeAFriend)
router.put('/accept', isAuthenticated, isSelfTargeting, isOnPendingRequest, isAlreadyAFriend, UserController.acceptAFriendRequest)
router.put('/reject', isAuthenticated, isSelfTargeting, isOnPendingRequest, isAlreadyAFriend, UserController.rejectAFriendRequest)

module.exports = router