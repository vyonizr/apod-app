const { UserModel } = require('../models')

module.exports = async (req, res, next) => {
  const { username } = res.locals.authenticatedUser
  const { targetUsername } = req.body

  const selfUser = await UserModel.findOne({ username }, 'pendingFriends')
  const targetUser = await UserModel.findOne({ username: targetUsername }, '_id')
  const isOnPendingRequest = selfUser.pendingFriends.some(pendingID => String(pendingID) === String(targetUser._id))

  if (!isOnPendingRequest || !targetUser) {
    res.status(404).json({
      status: 'fail',
      message: `Username ${targetUsername} does not exist on pending requests`
    })
  }
  else {
    res.locals.targetUserID = targetUser._id
    next()
  }
}