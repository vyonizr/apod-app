const { UserModel } = require('../models')

module.exports = async (req, res, next) => {
  const { id } = req.authenticatedUser
  let targetUsername = null

  if (req.body.targetUsername) {
    targetUsername = req.body.targetUsername
  }
  else if (req.params.targetUsername) {
    targetUsername = req.params.targetUsername
  }


  const targetUser = await UserModel.findOne({ username: targetUsername }, 'friends')
  const isAlreadyAFriend = targetUser ? targetUser.friends.some(friendID => String(friendID) === id) : false

  if (!targetUser) {
    res.status(404).json({
      status: 'fail',
      message: 'The requested username was not found'
    })
  }
  else if (isAlreadyAFriend) {
    res.status(409).json({
      status: 'fail',
      message: `${targetUsername} is already on your friends list`
    })
  }
  else {
    next()
  }
}