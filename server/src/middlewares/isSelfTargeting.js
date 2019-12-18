module.exports = (req, res, next) => {
  const { username } = req.params
  let targetUsername = null
  if (req.body.targetUsername) {
    targetUsername = req.body.targetUsername
  }
  else if (req.params.targetUsername) {
    targetUsername = req.params.targetUsername
  }

  if (!targetUsername) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid mandatory parameter(s)'
    })
  }
  else if (targetUsername === username) {
    res.status(400).json({
      status: 'fail',
      message: 'Cannot send a friend request to oneself'
    })
  }
  else {
    next()
  }
}