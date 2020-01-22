module.exports = (req, res, next) => {
  const { username } = res.locals.authenticatedUser
  const targetUsername = req.method !== 'DELETE' && req.body.targetUsername
  ? req.body.targetUsername
  : req.method === 'DELETE' && req.params.username
  ? req.params.username
  : null

  if (!username || !targetUsername || targetUsername === username) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid mandatory parameter(s)'
    })
  }
  else {
    next()
  }
}