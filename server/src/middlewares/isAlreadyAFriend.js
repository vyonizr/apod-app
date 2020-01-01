const { UserModel } = require('../models')

module.exports = async (req, res, next) => {
  const { id } = res.locals.authenticatedUser
  const targetUsername = req.method !== 'DELETE' && req.body.targetUsername
  ? req.body.targetUsername
  : req.method === 'DELETE' && req.params.username
  ? req.params.username
  : null

  const targetUser = await UserModel.findOne({ username: targetUsername }, 'friends')
  const isAlreadyAFriend = targetUser ? targetUser.friends.some(friendID => String(friendID) === id) : false

  if (!targetUser) {
    res.status(404).json({
      status: 'fail',
      message: 'The requested username was not found'
    })
  }
  else if (!isAlreadyAFriend && req.method === 'DELETE') {
    res.status(404).json({
      status: 'fail',
      message: `${targetUsername} is not on your friends list`
    })
  }
  else if (isAlreadyAFriend && (req.method === 'PUT' || req.method === 'POST')) {
    res.status(409).json({
      status: 'fail',
      message: `${targetUsername} is already on your friends list`
    })
  }
  else {
    next()
  }
}